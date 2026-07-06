'use client'

import { useState } from 'react'

export type AppliedCoupon = { code: string; discountInr: number; label: string }

export default function CouponInput({
  subtotalInr,
  applied,
  onApply,
  onClear,
}: {
  subtotalInr: number
  applied: AppliedCoupon | null
  onApply: (coupon: AppliedCoupon) => void
  onClear: () => void
}) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleApply() {
    if (!code.trim()) return
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotalInr }),
      })
      const result = await res.json()

      if (result.valid) {
        onApply({ code: code.trim().toUpperCase(), discountInr: result.discountInr, label: result.label })
        setMessage({ text: `✓ Coupon applied — ${result.label} (₹${result.discountInr.toLocaleString('en-IN')} saved)`, error: false })
      } else {
        onClear()
        setMessage({ text: result.message ?? 'Invalid coupon code.', error: true })
      }
    } catch {
      setMessage({ text: 'Could not validate coupon — please try again.', error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-dim">
        Coupon Code
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. AMENTUM10"
          className="flex-1 rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm uppercase outline-none focus:border-ink focus:bg-w"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-lg border border-border-2 px-4 text-xs font-medium text-ink transition-colors hover:border-ink disabled:opacity-50"
        >
          {loading ? '…' : applied ? 'Update' : 'Apply'}
        </button>
      </div>
      {message ? (
        <p className={`mt-1.5 text-xs ${message.error ? 'text-red' : 'text-mid'}`}>{message.text}</p>
      ) : null}
    </div>
  )
}
