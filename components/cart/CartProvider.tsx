'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/cart/store'

// Hydrates the cart store from localStorage once on mount. Mounted once near
// the root so cart state is available on both marketing and checkout routes.
export default function CartProvider() {
  useEffect(() => {
    useCartStore.getState().hydrate()
  }, [])

  return null
}
