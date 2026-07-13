'use client'

import { useState } from 'react'
import type { Product, ProductVariant } from '@/lib/types'
import { isSaleActive, getEffectivePrice } from '@/lib/pricing/sale'

type SaleProduct = Pick<Product, 'id' | 'name' | 'sku' | 'variants' | 'sale_percent' | 'sale_starts_at' | 'sale_ends_at'>

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

function statusFor(p: Pick<Product, 'sale_percent' | 'sale_starts_at' | 'sale_ends_at'>, now: Date) {
  if (!p.sale_percent || !p.sale_starts_at || !p.sale_ends_at) return { label: 'No sale', color: 'text-dim' }
  if (isSaleActive(p, now)) return { label: 'Active', color: 'text-[#1a6b3a]' }
  if (now < new Date(p.sale_starts_at)) return { label: 'Scheduled', color: 'text-mid' }
  return { label: 'Expired', color: 'text-dim' }
}

function SaleRow({ product }: { product: SaleProduct }) {
  const [saved, setSaved] = useState(product)
  const [percent, setPercent] = useState(product.sale_percent?.toString() ?? '')
  const [startsAt, setStartsAt] = useState(isoToLocalInput(product.sale_starts_at))
  const [endsAt, setEndsAt] = useState(isoToLocalInput(product.sale_ends_at))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const variants = (product.variants ?? []) as ProductVariant[]
  const cheapest = variants.length ? Math.min(...variants.map((v) => v.price_inr)) : null
  const status = statusFor(saved, new Date())

  async function save(payload: { sale_percent: number | null; sale_starts_at: string | null; sale_ends_at: string | null }) {
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save.')
      return
    }
    setSaved((prev) => ({ ...prev, ...payload }))
  }

  function handleSave() {
    if (!percent || !startsAt || !endsAt) {
      setError('Enter a discount %, start date, and end date.')
      return
    }
    save({ sale_percent: Number(percent), sale_starts_at: localInputToIso(startsAt), sale_ends_at: localInputToIso(endsAt) })
  }

  function handleClear() {
    setPercent('')
    setStartsAt('')
    setEndsAt('')
    save({ sale_percent: null, sale_starts_at: null, sale_ends_at: null })
  }

  return (
    <tr className="border-b border-border align-top">
      <td className="px-3 py-3">
        <div className="text-sm font-medium text-ink">{product.name}</div>
        <div className="text-xs text-dim">{product.sku}</div>
        <div className={`mt-1 text-xs font-medium ${status.color}`}>{status.label}</div>
      </td>
      <td className="px-3 py-3">
        <input
          type="number"
          min={1}
          max={99}
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          placeholder="e.g. 20"
          className="w-20 rounded border border-border-2 bg-off px-2 py-1.5 text-xs outline-none focus:border-ink focus:bg-w"
        />
        <span className="ml-1 text-xs text-dim">% off</span>
        {cheapest !== null && percent ? (
          <div className="mt-1 text-[11px] text-dim">
            from ₹{cheapest.toLocaleString('en-IN')} → ₹{getEffectivePrice(cheapest, Number(percent)).toLocaleString('en-IN')}
          </div>
        ) : null}
      </td>
      <td className="px-3 py-3">
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          className="rounded border border-border-2 bg-off px-2 py-1.5 text-xs outline-none focus:border-ink focus:bg-w"
        />
      </td>
      <td className="px-3 py-3">
        <input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          className="rounded border border-border-2 bg-off px-2 py-1.5 text-xs outline-none focus:border-ink focus:bg-w"
        />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-pill border border-border-2 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={handleClear} disabled={saving} className="text-xs text-red disabled:opacity-50">
            Clear Sale
          </button>
        </div>
        {error ? <p className="mt-1 text-[11px] text-red">{error}</p> : null}
      </td>
    </tr>
  )
}

export default function SaleTable({ products }: { products: SaleProduct[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-mid">No products yet.</p>
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
          <th className="px-3 py-2">Product</th>
          <th className="px-3 py-2">Discount</th>
          <th className="px-3 py-2">Starts</th>
          <th className="px-3 py-2">Ends</th>
          <th className="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <SaleRow key={p.id} product={p} />
        ))}
      </tbody>
    </table>
  )
}
