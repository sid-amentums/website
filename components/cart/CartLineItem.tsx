'use client'

import type { CartItem } from '@/lib/types'
import { useCartStore } from '@/lib/cart/store'

export default function CartLineItem({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  return (
    <div className="flex gap-3 border-b border-border py-4">
      <div className="flex-1">
        <div className="font-serif text-[15px] leading-tight text-ink">{item.name_snapshot}</div>
        <div className="mt-1 text-xs text-mid">{item.variant_label_snapshot}</div>
        <div className="mt-2 flex items-center gap-2">
          <button
            aria-label="Decrease quantity"
            className="h-6 w-6 rounded-full border border-border-2 text-xs text-ink hover:border-ink"
            onClick={() =>
              updateQuantity(item.product_id, item.variant_id, item.quantity - 1)
            }
          >
            −
          </button>
          <span className="w-6 text-center text-sm">{item.quantity}</span>
          <button
            aria-label="Increase quantity"
            className="h-6 w-6 rounded-full border border-border-2 text-xs text-ink hover:border-ink"
            onClick={() =>
              updateQuantity(item.product_id, item.variant_id, item.quantity + 1)
            }
          >
            +
          </button>
          <button
            aria-label="Remove item"
            className="ml-2 text-xs text-mid underline hover:text-red"
            onClick={() => removeItem(item.product_id, item.variant_id)}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="whitespace-nowrap text-sm font-medium text-ink">
        ₹{(item.unit_price_snapshot * item.quantity).toLocaleString('en-IN')}
      </div>
    </div>
  )
}
