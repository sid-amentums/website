'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/lib/types'
import VariantSelect from '@/components/shop/VariantSelect'
import AddToCartButton from '@/components/shop/AddToCartButton'
import { trackPixelEvent } from '@/lib/analytics/metaPixel'

const WHATSAPP_NUMBER = '+919827654830'

export default function ProductDetailView({ product }: { product: Product }) {
  const activeVariants = product.variants.filter((v) => v.active)

  useEffect(() => {
    trackPixelEvent('ViewContent', {
      content_ids: product.id,
      content_name: product.name,
      content_type: 'product',
      value: product.variants.find((v) => v.active)?.price_inr,
      currency: 'INR',
    })
  }, [product])
  const [variantId, setVariantId] = useState(activeVariants[0]?.id ?? '')
  const selectedVariant = activeVariants.find((v) => v.id === variantId) ?? activeVariants[0]
  const images = [...product.images].sort((a, b) => a.sort_order - b.sort_order)
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className="grid gap-10 px-6 py-12 md:grid-cols-2 md:px-12 md:py-16">
      <div>
        <div className="flex aspect-square items-center justify-center rounded-lg bg-off p-10">
          {images[activeImage] ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt || product.name}
              width={480}
              height={480}
              className="h-full w-full object-contain"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-off2 text-sm text-dim">
              Image coming soon
            </div>
          )}
        </div>
        {images.length > 1 ? (
          <div className="mt-3 flex gap-2">
            {images.map((img, i) => (
              <button
                key={img.url}
                onClick={() => setActiveImage(i)}
                className={`h-16 w-16 overflow-hidden rounded-md border bg-off p-1.5 ${
                  i === activeImage ? 'border-ink' : 'border-border'
                }`}
              >
                <Image src={img.url} alt={img.alt || product.name} width={56} height={56} className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-dim">
          {product.category}
          {product.wa_certified ? (
            <span className="rounded-md bg-[#25D366] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-w">
              WA Certified
            </span>
          ) : null}
        </div>
        <h1 className="mb-4 font-serif text-4xl leading-tight text-ink">{product.name}</h1>
        {product.long_desc || product.short_desc ? (
          <p className="mb-6 max-w-md text-[15px] leading-relaxed text-mid">
            {product.long_desc ?? product.short_desc}
          </p>
        ) : null}

        {(product.level || product.flex) && (
          <div className="mb-6 flex gap-6 text-xs text-mid">
            {product.level ? (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-dim">Level</div>
                <div className="mt-0.5 text-ink">{product.level}</div>
              </div>
            ) : null}
            {product.flex ? (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-dim">Flex</div>
                <div className="mt-0.5 text-ink">{product.flex}</div>
              </div>
            ) : null}
          </div>
        )}

        {product.checkout_enabled && selectedVariant ? (
          <>
            <VariantSelect variants={activeVariants} value={variantId} onChange={setVariantId} />
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="font-serif text-3xl text-ink">
                ₹{selectedVariant.price_inr.toLocaleString('en-IN')}
              </span>
              <AddToCartButton
                product={product}
                variant={selectedVariant}
                className="rounded-pill bg-ink px-8 py-3.5 text-sm font-medium text-w transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-red hover:shadow-xl"
              />
            </div>
          </>
        ) : (
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              product.whatsapp_message_template || `Enquiry about ${product.name}`
            )}`}
            target="_blank"
            rel="noopener"
            className="mt-6 inline-block rounded-pill border border-border-2 px-8 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink"
          >
            Enquire on WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
