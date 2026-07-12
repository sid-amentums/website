'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import type { Product, ProductVariant, ProductImage } from '@/lib/types'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function nextVariantId(variants: ProductVariant[]): string {
  let max = 0
  for (const v of variants) {
    const m = /^v(\d+)$/.exec(v.id)
    if (m) max = Math.max(max, parseInt(m[1], 10))
  }
  return `v${max + 1}`
}

const CATEGORIES = ['competition', 'training', 'youth', 'mini', 'international', 'institutional']

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const isEdit = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(isEdit)
  const [sku, setSku] = useState(product?.sku ?? '')
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0])
  const [shortDesc, setShortDesc] = useState(product?.short_desc ?? '')
  const [longDesc, setLongDesc] = useState(product?.long_desc ?? '')
  const [level, setLevel] = useState(product?.level ?? '')
  const [flex, setFlex] = useState(product?.flex ?? '')
  const [waCertified, setWaCertified] = useState(product?.wa_certified ?? false)
  const [active, setActive] = useState(product?.active ?? true)
  const [stock, setStock] = useState(product?.stock ?? 0)
  const [checkoutEnabled, setCheckoutEnabled] = useState(product?.checkout_enabled ?? true)
  const [waTemplate, setWaTemplate] = useState(product?.whatsapp_message_template ?? '')
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants ?? [
      { id: 'v1', label: '', weight_grams: null, range_meters: null, price_inr: 0, active: true },
    ]
  )
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(slugify(value))
  }

  function updateVariant(id: string, patch: Partial<ProductVariant>) {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)))
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { id: nextVariantId(prev), label: '', weight_grams: null, range_meters: null, price_inr: 0, active: true },
    ])
  }

  function removeVariant(id: string) {
    setVariants((prev) => (prev.length > 1 ? prev.filter((v) => v.id !== id) : prev))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/products/upload-image', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error ?? 'Upload failed')
        return
      }
      setImages((prev) => [
        ...prev,
        { url: data.url, alt: name || 'Product image', is_primary: prev.length === 0, sort_order: prev.length },
      ])
    } finally {
      setUploading(false)
    }
  }

  function setPrimary(url: string) {
    setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.url === url })))
  }

  function updateImageAlt(url: string, alt: string) {
    setImages((prev) => prev.map((img) => (img.url === url ? { ...img, alt } : img)))
  }

  function removeImage(url: string) {
    setImages((prev) =>
      prev.filter((img) => img.url !== url).map((img, i) => ({ ...img, sort_order: i }))
    )
  }

  function moveImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev]
      const swapWith = index + dir
      if (swapWith < 0 || swapWith >= next.length) return prev
      ;[next[index], next[swapWith]] = [next[swapWith], next[index]]
      return next.map((img, i) => ({ ...img, sort_order: i }))
    })
  }

  function buildPayload() {
    return {
      name: name.trim(),
      slug: slug.trim(),
      sku: sku.trim(),
      category,
      short_desc: shortDesc.trim() || null,
      long_desc: longDesc.trim() || null,
      level: level.trim() || null,
      flex: flex.trim() || null,
      wa_certified: waCertified,
      variants,
      images,
      active,
      stock,
      checkout_enabled: checkoutEnabled,
      whatsapp_message_template: waTemplate.trim() || null,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch(isEdit ? `/api/admin/products/${product!.id}` : '/api/admin/products', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload()),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save product.')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  async function handleToggleActive() {
    if (!isEdit) return
    const next = !active
    setActive(next)
    setStatusMsg(null)
    const res = await fetch(`/api/admin/products/${product!.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: next }),
    })
    setStatusMsg(res.ok ? (next ? 'Reactivated' : 'Deactivated') : 'Failed to update status')
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {isEdit ? (
        <div className="flex items-center justify-between rounded-lg border border-border-2 bg-off px-4 py-3">
          <span className="text-sm text-mid">
            Status:{' '}
            <span className={`font-medium ${active ? 'text-[#1a6b3a]' : 'text-red'}`}>
              {active ? 'Active' : 'Deactivated'}
            </span>
          </span>
          <div className="flex items-center gap-3">
            {statusMsg ? <span className="text-xs text-dim">{statusMsg}</span> : null}
            <button
              type="button"
              onClick={handleToggleActive}
              className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink"
            >
              {active ? 'Deactivate Product' : 'Reactivate Product'}
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-ink">Basics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              required
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              SKU
            </label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Level
            </label>
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="e.g. Pro / Elite"
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Flex
            </label>
            <input
              value={flex}
              onChange={(e) => setFlex(e.target.value)}
              placeholder="e.g. Low"
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Short Description
          </label>
          <textarea
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Long Description
          </label>
          <textarea
            value={longDesc}
            onChange={(e) => setLongDesc(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-xs text-mid">
            <input type="checkbox" checked={waCertified} onChange={(e) => setWaCertified(e.target.checked)} />
            World Athletics Certified
          </label>
          <label className="flex items-center gap-2 text-xs text-mid">
            <input
              type="checkbox"
              checked={checkoutEnabled}
              onChange={(e) => setCheckoutEnabled(e.target.checked)}
            />
            Checkout enabled (uncheck for WhatsApp-enquiry-only products)
          </label>
        </div>
        {!checkoutEnabled ? (
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              WhatsApp Enquiry Message Template
            </label>
            <input
              value={waTemplate}
              onChange={(e) => setWaTemplate(e.target.value)}
              placeholder="Enquiry about {product name}"
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-ink">Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink"
          >
            Add Variant
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((v) => (
            <div key={v.id} className="grid grid-cols-12 items-center gap-2 rounded-lg border border-border-2 bg-off p-2.5">
              <span className="col-span-1 text-[11px] text-dim">{v.id}</span>
              <input
                value={v.label}
                onChange={(e) => updateVariant(v.id, { label: e.target.value })}
                placeholder="Label (e.g. 800g / 90m)"
                className="col-span-4 rounded border border-border-2 bg-w px-2 py-1.5 text-xs outline-none focus:border-ink"
              />
              <input
                type="number"
                value={v.weight_grams ?? ''}
                onChange={(e) => updateVariant(v.id, { weight_grams: e.target.value ? Number(e.target.value) : null })}
                placeholder="grams"
                className="col-span-2 rounded border border-border-2 bg-w px-2 py-1.5 text-xs outline-none focus:border-ink"
              />
              <input
                type="number"
                value={v.range_meters ?? ''}
                onChange={(e) => updateVariant(v.id, { range_meters: e.target.value ? Number(e.target.value) : null })}
                placeholder="metres"
                className="col-span-2 rounded border border-border-2 bg-w px-2 py-1.5 text-xs outline-none focus:border-ink"
              />
              <input
                type="number"
                value={v.price_inr}
                onChange={(e) => updateVariant(v.id, { price_inr: Number(e.target.value) })}
                placeholder="₹ price"
                className="col-span-2 rounded border border-border-2 bg-w px-2 py-1.5 text-xs outline-none focus:border-ink"
              />
              <button
                type="button"
                onClick={() => removeVariant(v.id)}
                disabled={variants.length <= 1}
                className="col-span-1 text-xs text-red disabled:opacity-30"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-6">
        <h2 className="text-sm font-medium text-ink">Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img.url} className="w-32 rounded-lg border border-border-2 bg-off p-2">
              <div className="mb-1.5 flex aspect-square items-center justify-center overflow-hidden rounded bg-w">
                <Image src={img.url} alt={img.alt} width={112} height={112} className="h-full w-full object-contain" />
              </div>
              <input
                value={img.alt}
                onChange={(e) => updateImageAlt(img.url, e.target.value)}
                placeholder="Alt text"
                className="mb-1 w-full rounded border border-border-2 bg-w px-1.5 py-1 text-[10px] outline-none"
              />
              <div className="flex items-center justify-between text-[10px]">
                <button
                  type="button"
                  onClick={() => setPrimary(img.url)}
                  className={img.is_primary ? 'font-medium text-red' : 'text-dim'}
                >
                  {img.is_primary ? 'Primary' : 'Set primary'}
                </button>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0} className="disabled:opacity-30">
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    className="disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button type="button" onClick={() => removeImage(img.url)} className="text-red">
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
          <label className="flex w-32 aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border-2 bg-off text-center text-xs text-dim hover:border-ink">
            {uploading ? '…' : '+ Add Image'}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {error ? <p className="text-xs text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={saving}
        className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
      >
        {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
      </button>
    </form>
  )
}
