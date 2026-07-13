'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (arg: unknown) => void) => void
    }
  }
}

// Resumes payment on an order that already exists (status 'created') and
// already has a Razorpay order attached — unlike RazorpayButton.tsx, this
// never calls /api/razorpay/create-order (no new order, no new pricing
// computation): it reopens the checkout modal against the SAME
// razorpay_order_id + amount fixed at the order's original creation time,
// then hands off to the same, unchanged /api/razorpay/verify route.
export default function ResumePaymentButton({
  orderId,
  razorpayOrderId,
  amountInr,
  keyId,
  contactName,
  contactPhone,
  contactEmail,
}: {
  orderId: string
  razorpayOrderId: string
  amountInr: number
  keyId: string
  contactName: string
  contactPhone: string
  contactEmail: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  function handlePay() {
    setLoading(true)
    setError(null)

    if (typeof window.Razorpay === 'undefined') {
      setError('Payment could not load. Please refresh and try again.')
      setLoading(false)
      return
    }

    const rzp = new window.Razorpay({
      key: keyId,
      amount: amountInr * 100,
      currency: 'INR',
      name: 'Amentum Sports',
      order_id: razorpayOrderId,
      prefill: { name: contactName, contact: `91${contactPhone}`, email: contactEmail },
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
            body: JSON.stringify({ ...r, order_db_id: orderId }),
          })
          if (verifyRes.ok) {
            router.push(`/checkout/success?order=${orderId}`)
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
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
      />
      {error ? <p className="mb-2 text-xs text-red">{error}</p> : null}
      <button
        onClick={handlePay}
        disabled={loading || !scriptReady}
        className="rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w transition-colors hover:bg-red disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Complete Payment →'}
      </button>
    </>
  )
}
