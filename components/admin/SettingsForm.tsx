'use client'

import { useState } from 'react'

export default function SettingsForm({
  initialKeyId,
  initialGaId,
}: {
  initialKeyId: string
  initialGaId: string
}) {
  const [keyId, setKeyId] = useState(initialKeyId)
  const [gaId, setGaId] = useState(initialGaId)
  const [publicMsg, setPublicMsg] = useState<string | null>(null)

  const [keySecret, setKeySecret] = useState('')
  const [keySecretSaved, setKeySecretSaved] = useState(false)
  const [keySecretMsg, setKeySecretMsg] = useState<string | null>(null)

  const [webhookSecret, setWebhookSecret] = useState('')
  const [webhookSecretSaved, setWebhookSecretSaved] = useState(false)
  const [webhookSecretMsg, setWebhookSecretMsg] = useState<string | null>(null)

  async function savePublicSettings(e: React.FormEvent) {
    e.preventDefault()
    setPublicMsg(null)
    const res = await fetch('/api/admin/settings/app-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ razorpay_key_id: keyId, ga_measurement_id: gaId }),
    })
    setPublicMsg(res.ok ? 'Saved.' : 'Could not save — please try again.')
  }

  async function saveSecret(name: 'razorpay_key_secret' | 'razorpay_webhook_secret') {
    const value = name === 'razorpay_key_secret' ? keySecret : webhookSecret
    if (!value.trim()) return

    const res = await fetch('/api/admin/settings/vault', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secretName: name, secretValue: value.trim() }),
    })

    if (name === 'razorpay_key_secret') {
      setKeySecret('')
      setKeySecretSaved(res.ok)
      setKeySecretMsg(res.ok ? '•••• saved' : 'Could not save — please try again.')
    } else {
      setWebhookSecret('')
      setWebhookSecretSaved(res.ok)
      setWebhookSecretMsg(res.ok ? '•••• saved' : 'Could not save — please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={savePublicSettings} className="space-y-3">
        <h2 className="text-sm font-medium text-ink">Public Settings</h2>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Razorpay Key ID
          </label>
          <input
            value={keyId}
            onChange={(e) => setKeyId(e.target.value)}
            placeholder="rzp_test_..."
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
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
        {publicMsg ? <p className="text-xs text-mid">{publicMsg}</p> : null}
        <button
          type="submit"
          className="rounded-pill bg-ink px-6 py-2.5 text-xs font-medium text-w transition-colors hover:bg-red"
        >
          Save
        </button>
      </form>

      <div className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-medium text-ink">Razorpay Key Secret</h2>
        <p className="text-xs text-dim">
          Write-only — stored in Supabase Vault. Never displayed once saved.
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={keySecret}
            onChange={(e) => setKeySecret(e.target.value)}
            placeholder={keySecretSaved ? '•••• saved' : 'Enter key secret'}
            className="flex-1 rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
          <button
            onClick={() => saveSecret('razorpay_key_secret')}
            type="button"
            className="rounded-pill border border-border-2 px-5 text-xs font-medium text-ink hover:border-ink"
          >
            Save
          </button>
        </div>
        {keySecretMsg ? <p className="text-xs text-mid">{keySecretMsg}</p> : null}
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-medium text-ink">Razorpay Webhook Secret</h2>
        <p className="text-xs text-dim">Optional — enables the defense-in-depth webhook verification.</p>
        <div className="flex gap-2">
          <input
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder={webhookSecretSaved ? '•••• saved' : 'Enter webhook secret'}
            className="flex-1 rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
          <button
            onClick={() => saveSecret('razorpay_webhook_secret')}
            type="button"
            className="rounded-pill border border-border-2 px-5 text-xs font-medium text-ink hover:border-ink"
          >
            Save
          </button>
        </div>
        {webhookSecretMsg ? <p className="text-xs text-mid">{webhookSecretMsg}</p> : null}
      </div>
    </div>
  )
}
