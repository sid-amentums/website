import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/razorpay/getKeySecret'
import { verifyRazorpayWebhookSignature } from '@/lib/razorpay/signature'

// Defense-in-depth: covers the case where the browser closes right after
// payment but before the client-side /api/razorpay/verify call completes.
// Verifies Razorpay's own webhook signature (a separate secret from the
// order/payment HMAC) before touching anything.
export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = await getVaultSecret('razorpay_webhook_secret')
  if (!webhookSecret) {
    // Not configured yet — accept (200) so Razorpay doesn't retry-storm us,
    // but do nothing. The client-side verify route remains the primary path.
    return NextResponse.json({ ok: true, skipped: 'webhook secret not configured' })
  }

  if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = JSON.parse(rawBody)
  if (payload.event !== 'payment.captured') {
    return NextResponse.json({ ok: true, ignored: payload.event })
  }

  const payment = payload.payload?.payment?.entity
  if (!payment?.order_id || !payment?.id) {
    return NextResponse.json({ ok: true, ignored: 'no payment entity' })
  }

  const admin = createAdminClient()
  const { data: order } = await admin
    .from('orders')
    .select('id, status, coupon_code')
    .eq('razorpay_order_id', payment.order_id)
    .maybeSingle()

  if (!order || order.status === 'paid') {
    return NextResponse.json({ ok: true })
  }

  await admin
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id: payment.id,
      paid_at: new Date().toISOString(),
    })
    .eq('id', order.id)
    .eq('status', 'created')

  if (order.coupon_code) {
    await admin.rpc('increment_coupon_usage', { p_code: order.coupon_code }).then(
      () => {},
      () => {}
    )
  }

  return NextResponse.json({ ok: true })
}
