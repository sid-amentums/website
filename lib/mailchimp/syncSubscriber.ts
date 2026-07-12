import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/secrets/getVaultSecret'

// Server-only. Silent no-op if Mailchimp isn't configured — same contract
// as sendOrderConfirmationWhatsApp. Upserts (PUT) rather than POSTs so a
// repeat customer's existing subscription/tags are updated, not duplicated.
export async function syncMailchimpSubscriber(email: string, fullName: string): Promise<void> {
  try {
    const admin = createAdminClient()
    const { data: settings } = await admin
      .from('app_settings')
      .select('mailchimp_audience_id')
      .eq('id', 1)
      .single()

    if (!settings?.mailchimp_audience_id) return

    const apiKey = await getVaultSecret('mailchimp_api_key')
    if (!apiKey) return

    // Mailchimp API keys embed their data center as the suffix after '-'
    // (e.g. "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us21").
    const dataCenter = apiKey.split('-').pop()
    if (!dataCenter) return

    const subscriberHash = crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex')
    const [firstName, ...rest] = fullName.trim().split(' ')

    await fetch(
      `https://${dataCenter}.api.mailchimp.com/3.0/lists/${settings.mailchimp_audience_id}/members/${subscriberHash}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'subscribed',
          merge_fields: {
            FNAME: firstName ?? '',
            LNAME: rest.join(' '),
          },
        }),
      }
    )
  } catch {
    // never throw — this must not affect the payment verification response
  }
}
