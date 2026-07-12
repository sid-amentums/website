'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Coupon } from '@/lib/types'

function isoToLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function localInputToIso(value: string): string | null {
  if (!value) return null
  return new Date(value).toISOString()
}

export default function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter()
  const isEdit = Boolean(coupon)

  const [code, setCode] = useState(coupon?.code ?? '')
  const [type, setType] = useState<'percent' | 'flat'>(coupon?.type ?? 'percent')
  const [value, setValue] = useState(coupon?.value ?? 10)
  const [description, setDescription] = useState(coupon?.description ?? '')
  const [active, setActive] = useState(coupon?.active ?? true)
  const [maxUses, setMaxUses] = useState<number | ''>(coupon?.max_uses ?? '')
  const [minOrderAmount, setMinOrderAmount] = useState<number | ''>(coupon?.min_order_amount ?? '')
  const [startsAt, setStartsAt] = useState(isoToLocalInput(coupon?.starts_at ?? null))
  const [expiresAt, setExpiresAt] = useState(isoToLocalInput(coupon?.expires_at ?? null))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      code: code.trim(),
      type,
      value: Number(value),
      description: description.trim() || null,
      active,
      max_uses: maxUses === '' ? null : Number(maxUses),
      min_order_amount: minOrderAmount === '' ? null : Number(minOrderAmount),
      starts_at: localInputToIso(startsAt),
      expires_at: localInputToIso(expiresAt),
    }

    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save coupon.')
      return
    }
    router.push('/admin/coupons')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Code
        </label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          readOnly={isEdit}
          className={`w-full rounded-lg border border-border-2 px-3 py-2.5 text-sm uppercase outline-none ${
            isEdit ? 'bg-off text-mid' : 'bg-off focus:border-ink focus:bg-w'
          }`}
        />
        {isEdit ? (
          <p className="mt-1 text-[11px] text-dim">
            Code can&apos;t be changed — deactivate this coupon and create a new one instead.
          </p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'percent' | 'flat')}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          >
            <option value="percent">Percent off</option>
            <option value="flat">Flat amount off</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Value {type === 'percent' ? '(%)' : '(₹)'}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            min={0.01}
            step="0.01"
            required
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Description
        </label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Shown nowhere customer-facing — internal note"
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Max Uses
          </label>
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))}
            min={1}
            placeholder="Unlimited"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Min Order Amount (₹)
          </label>
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value === '' ? '' : Number(e.target.value))}
            min={0}
            placeholder="No minimum"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Starts At
          </label>
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Expires At
          </label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-mid">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Active
      </label>
      {isEdit ? (
        <p className="text-[11px] text-dim">Used {coupon!.usage_count} times so far.</p>
      ) : null}
      {error ? <p className="text-xs text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
      >
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Coupon'}
      </button>
    </form>
  )
}
