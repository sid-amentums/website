'use client'

import { useRouter } from 'next/navigation'
import { useAuthModalStore } from '@/lib/auth/authModalStore'
import { GUEST_CHECKOUT_FLAG } from '@/lib/auth/guestCheckout'

export default function GuestCheckoutFallback() {
  const router = useRouter()
  const close = useAuthModalStore((s) => s.close)

  function continueAsGuest() {
    window.sessionStorage.setItem(GUEST_CHECKOUT_FLAG, '1')
    close()
    router.push('/checkout')
  }

  return (
    <div className="mt-5 border-t border-border pt-4 text-center">
      <p className="mb-2 text-xs text-mid">Not ready to create an account?</p>
      <button onClick={continueAsGuest} className="text-xs font-medium text-ink underline">
        Continue as guest (one-time checkout, no order history)
      </button>
    </div>
  )
}
