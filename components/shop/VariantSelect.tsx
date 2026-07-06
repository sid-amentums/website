'use client'

import type { ProductVariant } from '@/lib/types'

export default function VariantSelect({
  variants,
  value,
  onChange,
}: {
  variants: ProductVariant[]
  value: string
  onChange: (variantId: string) => void
}) {
  if (variants.length <= 1) return null

  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-wide text-dim">
        Variant
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-border-2 bg-off px-3 py-2 text-xs text-ink outline-none transition-colors focus:border-ink focus:bg-w"
      >
        {variants
          .filter((v) => v.active)
          .map((v) => (
            <option key={v.id} value={v.id}>
              {v.label} — ₹{v.price_inr.toLocaleString('en-IN')}
            </option>
          ))}
      </select>
    </div>
  )
}
