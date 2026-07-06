'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import VariantSelect from '@/components/shop/VariantSelect'
import AddToCartButton from '@/components/shop/AddToCartButton'

const WHATSAPP_NUMBER = '+919827654830'

export default function ProductCard({ product }: { product: Product }) {
  const activeVariants = product.variants.filter((v) => v.active)
  const [variantId, setVariantId] = useState(activeVariants[0]?.id ?? '')
  const selectedVariant = activeVariants.find((v) => v.id === variantId) ?? activeVariants[0]
  const primaryImage =
    product.images.find((img) => img.is_primary) ?? product.images[0] ?? null

  const priceLabel = !selectedVariant
    ? null
    : activeVariants.length > 1
      ? `from ₹${Math.min(...activeVariants.map((v) => v.price_inr)).toLocaleString('en-IN')}`
      : `₹${selectedVariant.price_inr.toLocaleString('en-IN')}`

  return (
    <div className="flex flex-col overflow-hidden bg-w transition-colors hover:bg-off">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="flex aspect-[4/3] items-center justify-center bg-off p-6">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              width={320}
              height={240}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-off2 text-xs text-dim">
              Image coming soon
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col border-t border-border p-5">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-dim">
          {product.category}
          {product.wa_certified ? (
            <span className="rounded-md bg-[#25D366] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-w">
              WA Certified
            </span>
          ) : null}
        </div>
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mb-1.5 font-serif text-xl leading-tight text-ink">{product.name}</h3>
        </Link>
        {product.short_desc ? (
          <p className="mb-3.5 flex-1 text-xs leading-relaxed text-mid">{product.short_desc}</p>
        ) : (
          <div className="flex-1" />
        )}

        {product.checkout_enabled && selectedVariant ? (
          <>
            <VariantSelect variants={activeVariants} value={variantId} onChange={setVariantId} />
            <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
              <span className="text-lg font-medium text-ink">{priceLabel}</span>
              <AddToCartButton product={product} variant={selectedVariant} />
            </div>
          </>
        ) : (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              product.whatsapp_message_template || `Enquiry about ${product.name}`
            )}`}
            target="_blank"
            rel="noopener"
            className="mt-auto rounded-pill border border-border-2 px-5 py-2 text-center text-xs font-medium text-ink transition-colors hover:border-ink"
          >
            Enquire on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
