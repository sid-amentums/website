import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/secrets/getVaultSecret'

type OrderConfirmationDetails = {
  contactName: string
  contactPhone: string
  orderId: string
  amountInr: number
}

// Server-only. Silent no-op if WhatsApp isn't configured (phone-number-id,
// template name, or access token missing) — payment verification must
// never fail or slow down because a marketing integration is unset.
// Requires a Meta Business/WhatsApp Cloud API app with an approved message
// template whose body accepts 3 text parameters (customer name, order id,
// amount) in that order — adjust to match whatever template is actually
// approved, since Meta doesn't let templates be created from here.
export async function sendOrderConfirmationWhatsApp(details: OrderConfirmationDetails): Promise<void> {
  try {
    const admin = createAdminClient()
    const { data: settings } = await admin
      .from('app_settings')
      .select('whatsapp_phone_number_id, whatsapp_template_name')
      .eq('id', 1)
      .single()

    if (!settings?.whatsapp_phone_number_id || !settings?.whatsapp_template_name) return

    const accessToken = await getVaultSecret('whatsapp_access_token')
    if (!accessToken) return

    await fetch(`https://graph.facebook.com/v19.0/${settings.whatsapp_phone_number_id}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: `91${details.contactPhone}`,
        type: 'template',
        template: {
          name: settings.whatsapp_template_name,
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [
                { type: 'text', text: details.contactName },
                { type: 'text', text: details.orderId },
                { type: 'text', text: `₹${details.amountInr.toLocaleString('en-IN')}` },
              ],
            },
          ],
        },
      }),
    })
  } catch {
    // never throw — this must not affect the payment verification response
  }
}
