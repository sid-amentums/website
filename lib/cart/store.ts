import { create } from 'zustand'
import type { CartItem } from '@/lib/types'
import {
  addToGuestCart,
  getGuestCart,
  removeFromGuestCart,
  setGuestCart,
  updateGuestCartQuantity,
} from '@/lib/cart/guestCart'

type CartStore = {
  items: CartItem[]
  isOpen: boolean
  hydrated: boolean
  hydrate: () => void
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  setItems: (items: CartItem[]) => void
  hydrateFromServer: (items: CartItem[]) => void
  openDrawer: () => void
  closeDrawer: () => void
}

// Guest-cart-backed cart store. Every mutation writes through to
// localStorage (lib/cart/guestCart.ts) so the cart survives reloads; once
// authenticated, setItems() is called with the merged Supabase cart instead
// (see components/auth/AuthListener.tsx).
export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return
    set({ items: getGuestCart(), hydrated: true })
  },

  addItem: (item) => {
    const next = addToGuestCart(item)
    set({ items: next, isOpen: true })
  },

  removeItem: (productId, variantId) => {
    const next = removeFromGuestCart(productId, variantId)
    set({ items: next })
  },

  updateQuantity: (productId, variantId, quantity) => {
    const next = updateGuestCartQuantity(productId, variantId, quantity)
    set({ items: next })
  },

  setItems: (items) => {
    setGuestCart(items)
    set({ items })
  },

  // Used once after a successful guest-cart-merge-on-login: reflects the
  // authoritative server cart in memory WITHOUT writing it back to the guest
  // localStorage cart. Writing it back would cause the (still-present) guest
  // cart to be re-submitted and re-merged on every subsequent auth event,
  // doubling quantities each time.
  hydrateFromServer: (items) => set({ items }),

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
}))

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.unit_price_snapshot * i.quantity, 0)
}
