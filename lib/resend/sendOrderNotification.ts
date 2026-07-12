import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/secrets/getVaultSecret'
import { getRazorpayClient } from '@/lib/razorpay/client'
import type { CartItem, ShippingAddressRecord } from '@/lib/types'

type OrderNotificationDetails = {
  orderId: string
  contactName: string
  contactPhone: string
  contactEmail: string
  shippingAddress: ShippingAddressRecord
  items: CartItem[]
  amountInr: number
  createdAt: string
  razorpayPaymentId: string
}

// Server-only. Silent no-op if order notifications aren't configured
// (recipients, from address, or the Vault API key missing) — payment
// verification must never fail or slow down because this is unset. Same
// contract as lib/whatsapp/sendMessage.ts / lib/mailchimp/syncSubscriber.ts.
export async function sendOrderNotificationEmail(details: OrderNotificationDetails): Promise<void> {
  try {
    const admin = createAdminClient()
    const { data: settings } = await admin
      .from('app_settings')
      .select('order_notification_emails, order_notification_from_email')
      .eq('id', 1)
      .single()

    const recipients: string[] = ((settings?.order_notification_emails as string | null) ?? '')
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
    if (recipients.length === 0 || !settings?.order_notification_from_email) return

    const apiKey = await getVaultSecret('resend_api_key')
    if (!apiKey) return

    // Payment mode: try to fetch the real method (upi/card/netbanking/wallet)
    // via Razorpay's Payments API; fall back to a generic label if it fails
    // — this must never block the email on a second external API's uptime.
    let paymentMode = 'Razorpay'
    try {
      const razorpay = await getRazorpayClient()
      const payment = await razorpay.client.payments.fetch(details.razorpayPaymentId)
      if (payment?.method) paymentMode = payment.method.toUpperCase()
    } catch {
      // keep generic fallback
    }

    const [firstName, ...rest] = details.contactName.trim().split(' ')
    const lastName = rest.join(' ')
    const addr = details.shippingAddress

    const itemLines = details.items
      .map(
        (i) =>
          `- ${i.name_snapshot} (${i.variant_label_snapshot}) x${i.quantity} — ₹${(
            i.unit_price_snapshot * i.quantity
          ).toLocaleString('en-IN')}`
      )
      .join('\n')

    const text =
      `New order placed\n\n` +
      `First Name: ${firstName}\nLast Name: ${lastName || '—'}\n` +
      `Phone: ${details.contactPhone}\nEmail: ${details.contactEmail}\n\n` +
      `Shipping Address:\n${addr.line1}, ${addr.city}, ${addr.state} ${addr.pincode}, ${addr.country}\n\n` +
      `Items:\n${itemLines}\n\n` +
      `Total Paid: ₹${details.amountInr.toLocaleString('en-IN')}\n` +
      `Payment Mode: ${paymentMode}\n` +
      `Order Time: ${new Date(details.createdAt).toLocaleString('en-IN')}\n` +
      `Order ID: ${details.orderId}`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: settings.order_notification_from_email,
        to: recipients,
        subject: `New order — ₹${details.amountInr.toLocaleString('en-IN')} from ${details.contactName}`,
        text,
      }),
    })
  } catch {
    // never throw — this must not affect the payment verification response
  }
}
