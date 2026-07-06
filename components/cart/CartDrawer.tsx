'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore, cartSubtotal } from '@/lib/cart/store'
import CartLineItem from '@/components/cart/CartLineItem'
import { createClient } from '@/lib/supabase/client'
import { useAuthModalStore } from '@/lib/auth/authModalStore'

export default function CartDrawer() {
  const router = useRouter()
  const isOpen = useCartStore((s) => s.isOpen)
  const items = useCartStore((s) => s.items)
  const closeDrawer = useCartStore((s) => s.closeDrawer)

  async function handleCheckoutClick() {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    closeDrawer()
    if (session) {
      router.push('/checkout')
    } else {
      useAuthModalStore.getState().open('checkout')
    }
  }
  const subtotal = cartSubtotal(items)

  return (
    <>
      <div
        className={`fixed inset-0 z-[900] bg-black/30 transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[901] flex h-full w-full max-w-md flex-col bg-w shadow-2xl transition-transform duration-300 ease-spring ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl">Your Cart</h2>
          <button aria-label="Close cart" onClick={closeDrawer} className="text-2xl leading-none text-mid hover:text-ink">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-mid">
              <p className="text-sm">Your cart is empty.</p>
              <Link href="/shop" onClick={closeDrawer} className="mt-4 text-sm font-medium text-ink underline">
                Browse the shop
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem key={`${item.product_id}::${item.variant_id}`} item={item} />
            ))
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-border px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-mid">Subtotal</span>
              <span className="font-medium text-ink">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="block w-full rounded-pill bg-ink py-3.5 text-center text-sm font-medium text-w transition-colors hover:bg-red"
            >
              Checkout
            </button>
          </div>
        ) : null}
      </aside>
    </>
  )
}
