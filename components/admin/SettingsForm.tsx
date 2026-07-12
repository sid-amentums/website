'use client'

import { useState } from 'react'

type PublicSettings = {
  razorpayKeyId: string
  gaId: string
  metaPixelId: string
  whatsappPhoneNumberId: string
  whatsappBusinessAccountId: string
  whatsappTemplateName: string
  mailchimpAudienceId: string
}

type SecretName =
  | 'razorpay_key_secret'
  | 'razorpay_webhook_secret'
  | 'whatsapp_access_token'
  | 'mailchimp_api_key'

function SecretField({
  label,
  hint,
  name,
}: {
  label: string
  hint: string
  name: SecretName
}) {
  const [value, setValue] = useState('')
  const [saved, setSaved] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function save() {
    if (!value.trim()) return
    const res = await fetch('/api/admin/settings/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretName: name, secretValue: value.trim() }),
    })
    setValue('')
    setSaved(res.ok)
    setMsg(res.ok ? '•••• saved' : 'Could not save — please try again.')
  }

  return (
    <div className="space-y-3 border-t border-border pt-6">
      <h2 className="text-sm font-medium text-ink">{label}</h2>
      <p className="text-xs text-dim">{hint}</p>
      <div className="flex gap-2">
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={saved ? '•••• saved' : `Enter ${label.toLowerCase()}`}
          className="flex-1 rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
        <button
          onClick={save}
          type="button"
          className="rounded-pill border border-border-2 px-5 text-xs font-medium text-ink hover:border-ink"
        >
          Save
        </button>
      </div>
      {msg ? <p className="text-xs text-mid">{msg}</p> : null}
    </div>
  )
}

export default function SettingsForm({ initial }: { initial: PublicSettings }) {
  const [razorpayKeyId, setRazorpayKeyId] = useState(initial.razorpayKeyId)
  const [gaId, setGaId] = useState(initial.gaId)
  const [metaPixelId, setMetaPixelId] = useState(initial.metaPixelId)
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState(initial.whatsappPhoneNumberId)
  const [whatsappBusinessAccountId, setWhatsappBusinessAccountId] = useState(initial.whatsappBusinessAccountId)
  const [whatsappTemplateName, setWhatsappTemplateName] = useState(initial.whatsappTemplateName)
  const [mailchimpAudienceId, setMailchimpAudienceId] = useState(initial.mailchimpAudienceId)
  const [publicMsg, setPublicMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function savePublicSettings(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setPublicMsg(null)
    const res = await fetch('/api/admin/settings/app-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_key_id: razorpayKeyId,
        ga_measurement_id: gaId,
        meta_pixel_id: metaPixelId,
        whatsapp_phone_number_id: whatsappPhoneNumberId,
        whatsapp_business_account_id: whatsappBusinessAccountId,
        whatsapp_template_name: whatsappTemplateName,
        mailchimp_audience_id: mailchimpAudienceId,
      }),
    })
    setSaving(false)
    setPublicMsg(res.ok ? 'Saved.' : 'Could not save — please try again.')
  }

  return (
    <div className="space-y-8">
      <form onSubmit={savePublicSettings} className="space-y-3">
        <h2 className="text-sm font-medium text-ink">Payments</h2>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Razorpay Key ID
          </label>
          <input
            value={razorpayKeyId}
            onChange={(e) => setRazorpayKeyId(e.target.value)}
            placeholder="rzp_test_..."
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <h2 className="pt-3 text-sm font-medium text-ink">Analytics</h2>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            GA Measurement ID
          </label>
          <input
            value={gaId}
            onChange={(e) => setGaId(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Meta Pixel ID
          </label>
          <input
            value={metaPixelId}
            onChange={(e) => setMetaPixelId(e.target.value)}
            placeholder="e.g. 1234567890"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <h2 className="pt-3 text-sm font-medium text-ink">WhatsApp Business</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Phone Number ID
            </label>
            <input
              value={whatsappPhoneNumberId}
              onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Business Account ID
            </label>
            <input
              value={whatsappBusinessAccountId}
              onChange={(e) => setWhatsappBusinessAccountId(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Order Confirmation Template Name
          </label>
          <input
            value={whatsappTemplateName}
            onChange={(e) => setWhatsappTemplateName(e.target.value)}
            placeholder="e.g. order_confirmation"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <h2 className="pt-3 text-sm font-medium text-ink">Mailchimp</h2>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Audience ID
          </label>
          <input
            value={mailchimpAudienceId}
            onChange={(e) => setMailchimpAudienceId(e.target.value)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        {publicMsg ? <p className="text-xs text-mid">{publicMsg}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="rounded-pill bg-ink px-6 py-2.5 text-xs font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>

      <SecretField
        label="Razorpay Key Secret"
        hint="Write-only — stored in Supabase Vault. Never displayed once saved."
        name="razorpay_key_secret"
      />
      <SecretField
        label="Razorpay Webhook Secret"
        hint="Optional — enables the defense-in-depth webhook verification."
        name="razorpay_webhook_secret"
      />
      <SecretField
        label="WhatsApp Access Token"
        hint="From your Meta Business/WhatsApp Cloud API app. Required to send order confirmation messages."
        name="whatsapp_access_token"
      />
      <SecretField
        label="Mailchimp API Key"
        hint="Used to sync customers to your Mailchimp audience after checkout."
        name="mailchimp_api_key"
      />
    </div>
  )
}
