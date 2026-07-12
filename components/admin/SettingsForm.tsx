'use client'

import { useState } from 'react'

export type PublicSettings = {
  razorpayKeyId: string
  gaId: string
  metaPixelId: string
  whatsappPhoneNumberId: string
  whatsappBusinessAccountId: string
  whatsappTemplateName: string
  mailchimpAudienceId: string
  orderNotificationEmails: string
  orderNotificationFromEmail: string
}

type SecretName =
  | 'razorpay_key_secret'
  | 'razorpay_webhook_secret'
  | 'whatsapp_access_token'
  | 'mailchimp_api_key'
  | 'resend_api_key'

type PlainFieldConfig = {
  key: keyof PublicSettings
  apiKey: string
  label: string
  placeholder?: string
}

type SecretFieldConfig = {
  name: SecretName
  label: string
  hint: string
}

type ToolConfig = {
  name: string
  description: string
  plainFields: PlainFieldConfig[]
  secretFields: SecretFieldConfig[]
}

// Sorted alphabetically by tool name — each tool is one self-contained
// card (plain config + secret keys together, one Save action) instead of
// splitting every integration's settings across a shared form up top and
// a separate one-off secret box further down the page.
const TOOLS: ToolConfig[] = [
  {
    name: 'Google Analytics',
    description: 'Page-view and traffic analytics.',
    plainFields: [
      { key: 'gaId', apiKey: 'ga_measurement_id', label: 'Measurement ID', placeholder: 'G-XXXXXXXXXX' },
    ],
    secretFields: [],
  },
  {
    name: 'Mailchimp',
    description: 'Syncs customers to your audience after checkout.',
    plainFields: [{ key: 'mailchimpAudienceId', apiKey: 'mailchimp_audience_id', label: 'Audience ID' }],
    secretFields: [{ name: 'mailchimp_api_key', label: 'API Key', hint: 'From your Mailchimp account.' }],
  },
  {
    name: 'Meta Pixel',
    description: 'Tracks page views, add-to-cart, and purchases for Facebook/Instagram ads.',
    plainFields: [
      { key: 'metaPixelId', apiKey: 'meta_pixel_id', label: 'Pixel ID', placeholder: 'e.g. 1234567890' },
    ],
    secretFields: [],
  },
  {
    name: 'Razorpay',
    description: 'Payment processing for checkout.',
    plainFields: [{ key: 'razorpayKeyId', apiKey: 'razorpay_key_id', label: 'Key ID', placeholder: 'rzp_test_...' }],
    secretFields: [
      { name: 'razorpay_key_secret', label: 'Key Secret', hint: 'Required to verify and process payments.' },
      {
        name: 'razorpay_webhook_secret',
        label: 'Webhook Secret',
        hint: 'Optional — enables defense-in-depth webhook verification.',
      },
    ],
  },
  {
    name: 'Resend (Order Notifications)',
    description: 'Sends an email to your team for every successful order.',
    plainFields: [
      {
        key: 'orderNotificationEmails',
        apiKey: 'order_notification_emails',
        label: 'Recipient Email(s)',
        placeholder: 'e.g. info@amentums.com, orders@amentums.com',
      },
      {
        key: 'orderNotificationFromEmail',
        apiKey: 'order_notification_from_email',
        label: 'From Address',
        placeholder: 'orders@yourdomain.com',
      },
    ],
    secretFields: [
      { name: 'resend_api_key', label: 'API Key', hint: 'From resend.com. From Address must be a verified sender in your Resend account.' },
    ],
  },
  {
    name: 'WhatsApp Business',
    description: 'Sends an order confirmation message to customers.',
    plainFields: [
      { key: 'whatsappPhoneNumberId', apiKey: 'whatsapp_phone_number_id', label: 'Phone Number ID' },
      { key: 'whatsappBusinessAccountId', apiKey: 'whatsapp_business_account_id', label: 'Business Account ID' },
      {
        key: 'whatsappTemplateName',
        apiKey: 'whatsapp_template_name',
        label: 'Order Confirmation Template Name',
        placeholder: 'e.g. order_confirmation',
      },
    ],
    secretFields: [
      {
        name: 'whatsapp_access_token',
        label: 'Access Token',
        hint: 'From your Meta Business/WhatsApp Cloud API app.',
      },
    ],
  },
]

function ToolCard({ tool, initial }: { tool: ToolConfig; initial: PublicSettings }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(tool.plainFields.map((f) => [f.apiKey, initial[f.key]]))
  )
  const [secretValues, setSecretValues] = useState<Record<string, string>>({})
  const [secretsSaved, setSecretsSaved] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const isConfigured = tool.plainFields.length > 0 && tool.plainFields.every((f) => values[f.apiKey]?.trim())

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const requests: Promise<Response>[] = []

    if (tool.plainFields.length > 0) {
      requests.push(
        fetch('/api/admin/settings/app-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
      )
    }

    const secretsToSave = tool.secretFields.filter((s) => secretValues[s.name]?.trim())
    for (const secret of secretsToSave) {
      requests.push(
        fetch('/api/admin/settings/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secretName: secret.name, secretValue: secretValues[secret.name].trim() }),
        })
      )
    }

    const results = await Promise.all(requests)
    setSaving(false)

    if (results.every((r) => r.ok)) {
      setMessage('Saved.')
      if (secretsToSave.length > 0) {
        setSecretValues((prev) => {
          const next = { ...prev }
          secretsToSave.forEach((s) => {
            next[s.name] = ''
          })
          return next
        })
        setSecretsSaved((prev) => {
          const next = { ...prev }
          secretsToSave.forEach((s) => {
            next[s.name] = true
          })
          return next
        })
      }
    } else {
      setMessage('Could not save — please try again.')
    }
  }

  return (
    <form onSubmit={handleSave} className="rounded-lg border border-border-2 p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-ink">{tool.name}</h2>
          <p className="mt-0.5 text-xs text-dim">{tool.description}</p>
        </div>
        {tool.plainFields.length > 0 ? (
          <span
            className={`shrink-0 rounded-pill px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
              isConfigured ? 'bg-[#25D366]/10 text-[#1a6b3a]' : 'bg-off2 text-dim'
            }`}
          >
            {isConfigured ? 'Configured' : 'Not set'}
          </span>
        ) : null}
      </div>

      {tool.plainFields.length > 0 ? (
        <div className="mb-4 space-y-3">
          {tool.plainFields.map((field) => (
            <div key={field.apiKey}>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
                {field.label}
              </label>
              <input
                value={values[field.apiKey] ?? ''}
                onChange={(e) => setValues((prev) => ({ ...prev, [field.apiKey]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
              />
            </div>
          ))}
        </div>
      ) : null}

      {tool.secretFields.length > 0 ? (
        <div className={`space-y-3 ${tool.plainFields.length > 0 ? 'border-t border-border pt-4' : ''}`}>
          {tool.secretFields.map((secret) => (
            <div key={secret.name}>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
                {secret.label}
              </label>
              <input
                type="password"
                value={secretValues[secret.name] ?? ''}
                onChange={(e) => setSecretValues((prev) => ({ ...prev, [secret.name]: e.target.value }))}
                placeholder={secretsSaved[secret.name] ? '•••• saved' : `Enter ${secret.label.toLowerCase()}`}
                className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
              />
              <p className="mt-1 text-[11px] text-dim">{secret.hint}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-pill bg-ink px-6 py-2.5 text-xs font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        {message ? <span className="text-xs text-mid">{message}</span> : null}
      </div>
    </form>
  )
}

export default function SettingsForm({ initial }: { initial: PublicSettings }) {
  return (
    <div className="space-y-5">
      {TOOLS.map((tool) => (
        <ToolCard key={tool.name} tool={tool} initial={initial} />
      ))}
    </div>
  )
}
