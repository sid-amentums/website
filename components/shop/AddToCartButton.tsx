'use client'

import type { Product, ProductVariant } from '@/lib/types'
import { useCartStore } from '@/lib/cart/store'
import { trackPixelEvent } from '@/lib/analytics/metaPixel'
import { isSaleActive, getEffectivePrice } from '@/lib/pricing/sale'

export default function AddToCartButton({
  product,
  variant,
  className,
}: {
  product: Product
  variant: ProductVariant
  className?: string
}) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <button
      onClick={() => {
        // Cosmetic snapshot only, for cart/checkout preview display — the
        // Razorpay order-create route always recomputes price server-side
        // from the product's live sale fields, this just keeps the preview
        // from looking "wrong" (full price) while a sale is active.
        const unitPrice = isSaleActive(product) ? getEffectivePrice(variant.price_inr, product.sale_percent) : variant.price_inr
        addItem({
          product_id: product.id,
          variant_id: variant.id,
          name_snapshot: product.name,
          variant_label_snapshot: variant.label,
          unit_price_snapshot: unitPrice,
          quantity: 1,
        })
        trackPixelEvent('AddToCart', {
          content_ids: product.id,
          content_name: product.name,
          content_type: 'product',
          value: unitPrice,
          currency: 'INR',
        })
      }}
      className={
        className ??
        'rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w transition-all duration-200 hover:bg-red'
      }
    >
      Add to Cart
    </button>
  )
}
