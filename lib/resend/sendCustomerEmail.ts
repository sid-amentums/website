import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/secrets/getVaultSecret'

// Server-only. Unlike sendOrderNotificationEmail (a background side-effect
// of payment verification that must never fail loudly), this is a direct
// user-initiated admin action — callers need to know if it failed so they
// can show the admin an error instead of silently pretending it sent.
export async function sendCustomerEmail(
  to: string,
  subject: string,
  body: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('app_settings')
    .select('order_notification_from_email')
    .eq('id', 1)
    .single()

  if (!settings?.order_notification_from_email) {
    return { ok: false, error: 'Email sending isn’t configured yet — set a "from" address under Settings → Resend.' }
  }

  const apiKey = await getVaultSecret('resend_api_key')
  if (!apiKey) {
    return { ok: false, error: 'Email sending isn’t configured yet — set a Resend API key under Settings → Resend.' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: settings.order_notification_from_email,
      to: [to],
      subject,
      text: body,
    }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return { ok: false, error: data?.message ? `Resend rejected the email: ${data.message}` : 'Resend rejected the email — please try again.' }
  }
  return { ok: true }
}
