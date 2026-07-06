'use client'

import { useCartStore, cartCount } from '@/lib/cart/store'

export default function NavCartButton() {
  const items = useCartStore((s) => s.items)
  const openDrawer = useCartStore((s) => s.openDrawer)
  const count = cartCount(items)

  return (
    <button
      aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
      onClick={openDrawer}
      className="relative flex h-8 w-8 items-center justify-center text-ink"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[9px] font-medium text-w">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </button>
  )
}
