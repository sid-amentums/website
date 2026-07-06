'use client'

import { useState } from 'react'
import type { Product, ProductVariant } from '@/lib/types'

function ProductRow({ product }: { product: Product }) {
  const [active, setActive] = useState(product.active)
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants)
  const [msg, setMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function patch(body: { active?: boolean; variants?: ProductVariant[] }) {
    setSaving(true)
    setMsg(null)
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    setMsg(res.ok ? 'Saved' : 'Failed to save')
  }

  async function toggleActive() {
    const next = !active
    setActive(next)
    await patch({ active: next })
  }

  function updatePrice(variantId: string, price: number) {
    setVariants((prev) => prev.map((v) => (v.id === variantId ? { ...v, price_inr: price } : v)))
  }

  return (
    <tr className="border-b border-border">
      <td className="px-3 py-3 align-top">
        <div className="text-sm font-medium text-ink">{product.name}</div>
        <div className="text-xs text-dim">{product.sku}</div>
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">{product.category}</td>
      <td className="px-3 py-3 align-top">
        <label className="flex items-center gap-2 text-xs text-mid">
          <input type="checkbox" checked={active} onChange={toggleActive} />
          Active
        </label>
      </td>
      <td className="px-3 py-3 align-top">
        <div className="space-y-1.5">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center gap-2">
              <span className="w-32 truncate text-xs text-mid">{v.label}</span>
              <input
                type="number"
                value={v.price_inr}
                onChange={(e) => updatePrice(v.id, Number(e.target.value))}
                className="w-24 rounded border border-border-2 bg-off px-2 py-1 text-xs outline-none focus:border-ink focus:bg-w"
              />
            </div>
          ))}
        </div>
      </td>
      <td className="px-3 py-3 align-top">
        <button
          onClick={() => patch({ variants })}
          disabled={saving}
          className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink disabled:opacity-50"
        >
          {saving ? '…' : 'Save Prices'}
        </button>
        {msg ? <div className="mt-1 text-[11px] text-dim">{msg}</div> : null}
      </td>
    </tr>
  )
}

export default function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-mid">No products yet — seed data hasn&apos;t been loaded.</p>
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
          <th className="px-3 py-2">Product</th>
          <th className="px-3 py-2">Category</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Variants / Prices</th>
          <th className="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <ProductRow key={p.id} product={p} />
        ))}
      </tbody>
    </table>
  )
}
