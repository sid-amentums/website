'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import ImageHoverPreview from '@/components/admin/ImageHoverPreview'

function ProductRow({
  product,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  product: Product
  isDragging: boolean
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDragEnd: () => void
}) {
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
    <tr onDragOver={onDragOver} className={`border-b border-border ${isDragging ? 'opacity-40' : ''}`}>
      <td className="w-8 px-2 py-3 align-top">
        <span
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          title="Drag to reorder"
          className="block cursor-grab select-none text-sm leading-none text-dim active:cursor-grabbing"
        >
          ⠿
        </span>
      </td>
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
  const [items, setItems] = useState(products)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)

  function handleDragOver(overId: string) {
    return (e: React.DragEvent) => {
      e.preventDefault()
      if (!draggedId || draggedId === overId) return
      setItems((prev) => {
        const draggedIdx = prev.findIndex((p) => p.id === draggedId)
        const overIdx = prev.findIndex((p) => p.id === overId)
        if (draggedIdx === -1 || overIdx === -1 || draggedIdx === overIdx) return prev
        const next = [...prev]
        const [moved] = next.splice(draggedIdx, 1)
        next.splice(overIdx, 0, moved)
        return next
      })
    }
  }

  async function handleDragEnd() {
    setDraggedId(null)
    setSavingOrder(true)
    await fetch('/api/admin/products/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: items.map((p) => p.id) }),
    })
    setSavingOrder(false)
  }

  if (items.length === 0) {
    return <p className="text-sm text-mid">No products yet — add your first one.</p>
  }

  return (
    <div>
      <p className="mb-2 text-[11px] text-dim">
        Drag <span aria-hidden>⠿</span> to reorder — this also sets the display order on the shop page.
        {savingOrder ? ' Saving…' : ''}
      </p>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
            <th className="px-2 py-2"></th>
            <th className="px-3 py-2">Product</th>
            <th className="px-3 py-2">Category</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">Stock</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              isDragging={draggedId === p.id}
              onDragStart={() => setDraggedId(p.id)}
              onDragOver={handleDragOver(p.id)}
              onDragEnd={handleDragEnd}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
