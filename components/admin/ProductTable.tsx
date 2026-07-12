'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import ImageHoverPreview from '@/components/admin/ImageHoverPreview'

function ProductRow({ product }: { product: Product }) {
  const [active, setActive] = useState(product.active)
  const [saving, setSaving] = useState(false)

  async function toggleActive() {
    const next = !active
    setActive(next)
    setSaving(true)
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: next }),
    })
    setSaving(false)
  }

  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0]
  const priceRange = product.variants.length
    ? Math.min(...product.variants.map((v) => v.price_inr))
    : null

  return (
    <tr className="border-b border-border">
      <td className="px-3 py-3 align-top">
        <div className="flex items-center gap-3">
          {primaryImage ? (
            <ImageHoverPreview src={primaryImage.url} alt={primaryImage.alt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={primaryImage.url} alt={primaryImage.alt} className="h-10 w-10 rounded object-contain" />
            </ImageHoverPreview>
          ) : (
            <div className="h-10 w-10 rounded bg-off" />
          )}
          <div>
            <div className="text-sm font-medium text-ink">{product.name}</div>
            <div className="text-xs text-dim">{product.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">{product.category}</td>
      <td className="px-3 py-3 align-top text-xs text-mid">
        {priceRange !== null ? `From ₹${priceRange.toLocaleString('en-IN')}` : '—'}
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">{product.stock}</td>
      <td className="px-3 py-3 align-top">
        <span className={`text-xs font-medium ${active ? 'text-[#1a6b3a]' : 'text-red'}`}>
          {active ? 'Active' : 'Deactivated'}
        </span>
      </td>
      <td className="px-3 py-3 align-top">
        <div className="flex items-center gap-3">
          <Link href={`/admin/products/${product.id}/edit`} className="text-xs font-medium text-ink hover:text-red">
            Edit
          </Link>
          <button
            onClick={toggleActive}
            disabled={saving}
            className="text-xs text-mid hover:text-red disabled:opacity-50"
          >
            {active ? 'Deactivate' : 'Reactivate'}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function ProductTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-mid">No products yet — add your first one.</p>
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
          <th className="px-3 py-2">Product</th>
          <th className="px-3 py-2">Category</th>
          <th className="px-3 py-2">Price</th>
          <th className="px-3 py-2">Stock</th>
          <th className="px-3 py-2">Status</th>
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
