'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import type { CartItem } from '@/lib/types'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (arg: unknown) => void) => void
    }
  }
}

export default function RazorpayButton({
  items,
  couponCode,
  contact,
  shippingAddress,
  isGuestCheckout,
  disabled,
}: {
  items: CartItem[]
  couponCode: string | null
  contact: { name: string; phone: string; email: string }
  shippingAddress: { line1: string; city: string; state: string; pincode: string; country: 'IN' }
  isGuestCheckout: boolean
  disabled: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  async function handlePay() {
    setLoading(true)
    setError(null)

    try {
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
          couponCode,
          contact,
          shippingAddress,
          isGuestCheckout,
        }),
      })
      const createData = await createRes.json()

      if (!createRes.ok) {
        setError(createData.error ?? 'Could not start checkout. Please try again.')
        setLoading(false)
        return
      }

      const { razorpay_order_id, amount_inr, key_id, order_db_id } = createData

      if (typeof window.Razorpay === 'undefined') {
        setError('Payment could not load. Please refresh and try again.')
        setLoading(false)
        return
      }

      const rzp = new window.Razorpay({
        key: key_id,
        amount: amount_inr * 100,
        currency: 'INR',
        name: 'Amentum Sports',
        order_id: razorpay_order_id,
        prefill: { name: contact.name, contact: `91${contact.phone}`, email: contact.email },
        theme: { color: '#c8171a' },
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string
            razorpay_payment_id: string
            razorpay_signature: string
          }
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...r, order_db_id }),
            })
            if (verifyRes.ok) {
              router.push(`/checkout/success?order=${order_db_id}`)
            } else {
              setError('Payment could not be verified. If you were charged, contact support with your payment ID.')
              setLoading(false)
            }
          } catch {
            setError('Payment could not be verified. If you were charged, contact support with your payment ID.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.on('payment.failed', (response: unknown) => {
        const r = response as { error?: { description?: string } }
        setError(r.error?.description ?? 'Payment failed. Please try again.')
        setLoading(false)
      })

      rzp.open()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      {error ? <p className="mb-3 text-xs text-red">{error}</p> : null}
      <button
        onClick={handlePay}
        disabled={disabled || loading || !scriptReady}
        className="w-full rounded-lg bg-ink py-3.5 text-sm font-medium text-w transition-colors hover:bg-red disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Pay Securely with Razorpay →'}
      </button>
    </>
  )
}
