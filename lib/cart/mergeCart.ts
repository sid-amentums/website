import type { CartItem } from '@/lib/types'

const key = (item: Pick<CartItem, 'product_id' | 'variant_id'>) =>
  `${item.product_id}::${item.variant_id}`

// Pure, unit-testable merge: matching product_id+variant_id lines sum
// quantities (never wipe), new lines append. Used both for guest-side
// "add to cart" (existing = current guest cart) and server-side
// merge-on-login (existing = user's Supabase cart, incoming = guest cart).
export function mergeCartItems(existing: CartItem[], incoming: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>()

  for (const item of existing) {
    merged.set(key(item), { ...item })
  }

  for (const item of incoming) {
    const k = key(item)
    const current = merged.get(k)
    if (current) {
      merged.set(k, { ...current, quantity: Math.min(current.quantity + item.quantity, 99) })
    } else {
      merged.set(k, { ...item })
    }
  }

  return Array.from(merged.values())
}
