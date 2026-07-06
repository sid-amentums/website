import type { CartItem } from '@/lib/types'
import { mergeCartItems } from '@/lib/cart/mergeCart'

const GUEST_CART_KEY = 'amentum_guest_cart'

export function getGuestCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function setGuestCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
}

export function clearGuestCart(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(GUEST_CART_KEY)
}

export function addToGuestCart(item: CartItem): CartItem[] {
  const next = mergeCartItems(getGuestCart(), [item])
  setGuestCart(next)
  return next
}

export function removeFromGuestCart(productId: string, variantId: string): CartItem[] {
  const next = getGuestCart().filter(
    (i) => !(i.product_id === productId && i.variant_id === variantId)
  )
  setGuestCart(next)
  return next
}

export function updateGuestCartQuantity(
  productId: string,
  variantId: string,
  quantity: number
): CartItem[] {
  const next = getGuestCart()
    .map((i) =>
      i.product_id === productId && i.variant_id === variantId ? { ...i, quantity } : i
    )
    .filter((i) => i.quantity > 0)
  setGuestCart(next)
  return next
}
