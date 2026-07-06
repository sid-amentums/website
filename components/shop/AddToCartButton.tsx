'use client'

import type { Product, ProductVariant } from '@/lib/types'
import { useCartStore } from '@/lib/cart/store'

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
      onClick={() =>
        addItem({
          product_id: product.id,
          variant_id: variant.id,
          name_snapshot: product.name,
          variant_label_snapshot: variant.label,
          unit_price_snapshot: variant.price_inr,
          quantity: 1,
        })
      }
      className={
        className ??
        'rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w transition-all duration-200 hover:bg-red'
      }
    >
      Add to Cart
    </button>
  )
}
