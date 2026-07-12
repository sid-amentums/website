import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/razorpay/getKeySecret'
import { verifyRazorpaySignature } from '@/lib/razorpay/signature'
import { sendOrderConfirmationWhatsApp } from '@/lib/whatsapp/sendMessage'
import { syncMailchimpSubscriber } from '@/lib/mailchimp/syncSubscriber'
import { sendOrderNotificationEmail } from '@/lib/resend/sendOrderNotification'

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  order_db_id: z.string().uuid(),
})

// CRITICAL PATH: this is the only place an order's status is allowed to
// become 'paid'. The client-side checkout.js `handler` callback firing is
// NOT proof of payment — only a verified HMAC signature is. Runs entirely
// with the service_role client since RLS blocks client-side order updates
// by design (orders_update_none_client).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = verifySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_db_id } = parsed.data

  const admin = createAdminClient()

  const { data: order } = await admin
    .from('orders')
    .select(
      'id, razorpay_order_id, status, coupon_code, contact_name, contact_phone, contact_email, amount_inr, shipping_address, items'
    )
    .eq('id', order_db_id)
    .maybeSingle()

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (order.razorpay_order_id !== razorpay_order_id) {
    // Mismatch between the order this client claims to be paying for and
    // what was actually stored at create-order time — reject outright.
    return NextResponse.json({ error: 'Order mismatch' }, { status: 400 })
  }
  if (order.status === 'paid') {
    // Idempotent: a replayed/duplicate verify call for an already-paid order
    // is a success no-op, not an error.
    return NextResponse.json({ ok: true, order_id: order.id })
  }

  const keySecret = await getVaultSecret('razorpay_key_secret')
  if (!keySecret) {
    return NextResponse.json({ error: 'Payment verification is not configured' }, { status: 503 })
  }

  const isValid = verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    keySecret
  )

  if (!isValid) {
    // Do NOT touch order status on a failed verification — log for fraud
    // monitoring in a real deployment (left as a TODO: wire to an alerting
    // sink) and reject.
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
  }

  const paidAt = new Date().toISOString()

  const { error: updateError } = await admin
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id,
      razorpay_signature,
      paid_at: paidAt,
    })
    .eq('id', order_db_id)
    .eq('status', 'created') // guards against a race with a concurrent verify call

  if (updateError) {
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }

  if (order.coupon_code) {
    await admin.rpc('increment_coupon_usage', { p_code: order.coupon_code }).then(
      () => {},
      () => {} // non-fatal if the RPC is missing/fails — payment is already verified and recorded
    )
  }

  // All three silently no-op if unconfigured and never throw — see
  // lib/whatsapp/sendMessage.ts / lib/mailchimp/syncSubscriber.ts /
  // lib/resend/sendOrderNotification.ts. Payment is already verified and
  // recorded above; these must never affect the response.
  await Promise.all([
    sendOrderConfirmationWhatsApp({
      contactName: order.contact_name,
      contactPhone: order.contact_phone,
      orderId: order.id,
      amountInr: order.amount_inr,
    }),
    syncMailchimpSubscriber(order.contact_email, order.contact_name),
    sendOrderNotificationEmail({
      orderId: order.id,
      contactName: order.contact_name,
      contactPhone: order.contact_phone,
      contactEmail: order.contact_email,
      shippingAddress: order.shipping_address,
      items: order.items,
      amountInr: order.amount_inr,
      createdAt: paidAt,
      razorpayPaymentId: razorpay_payment_id,
    }),
  ])

  return NextResponse.json({ ok: true, order_id: order.id })
}
