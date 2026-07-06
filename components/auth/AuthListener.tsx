'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getGuestCart } from '@/lib/cart/guestCart'
import { useCartStore } from '@/lib/cart/store'
import { useAuthModalStore } from '@/lib/auth/authModalStore'

// Mounted once near the root. On sign-in, merges the guest cart into the
// user's Supabase cart (never wiping it), closes the auth modal, and routes
// to /checkout if that's why the modal was opened.
export default function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event !== 'SIGNED_IN') return

      const guestItems = getGuestCart()
      if (guestItems.length > 0) {
        try {
          const res = await fetch('/api/cart/merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ guestItems }),
          })
          if (res.ok) {
            const { items } = await res.json()
            useCartStore.getState().setItems(items)
          }
        } catch {
          // Non-fatal: the guest cart stays in localStorage and can be
          // merged again on the next sign-in event.
        }
      }

      const { intent, close } = useAuthModalStore.getState()
      close()
      if (intent === 'checkout') {
        router.push('/checkout')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return null
}
