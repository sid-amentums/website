'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isGuestCheckoutFlagSet } from '@/lib/auth/guestCheckout'
import { useAuthModalStore } from '@/lib/auth/authModalStore'
import CheckoutForm from '@/components/checkout/CheckoutForm'

// Session state is checked server-side in app/checkout/page.tsx (Server
// Component), but the guest-checkout flag lives in sessionStorage, which the
// server can't read — so the guest branch of this guard runs client-side.
// Renders CheckoutForm directly (rather than accepting it as `children`)
// because a function can't cross the Server->Client boundary as a prop —
// both this component and CheckoutForm are Client Components, so composing
// them here keeps everything on one side of that boundary.
export default function CheckoutGuard({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter()
  const [ready, setReady] = useState(isAuthenticated)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setReady(true)
      return
    }
    if (isGuestCheckoutFlagSet()) {
      setIsGuest(true)
      setReady(true)
      return
    }
    // Direct navigation to /checkout with no session and no guest flag —
    // bounce back and reopen the auth modal instead of allowing bypass.
    router.replace('/')
    useAuthModalStore.getState().open('checkout')
  }, [isAuthenticated, router])

  if (!ready) {
    return <div className="flex min-h-[60vh] items-center justify-center text-sm text-mid">Redirecting…</div>
  }

  return <CheckoutForm isGuestCheckout={isGuest} />
}
