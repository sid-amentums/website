'use client'

import { useState } from 'react'
import OrderCard, { type OrderCardData } from '@/components/account/OrderCard'

export default function TrackOrderForm() {
  const [orderId, setOrderId] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<OrderCardData | null>(null)
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), phone }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error ?? 'No matching order found. Check your Order ID and phone number.')
        return
      }
      setOrder(data.order)
      setRazorpayKeyId(data.razorpayKeyId ?? null)
    } catch {
      setError('Something went wrong — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="mb-2 font-serif text-3xl text-ink">Track My Order</h1>
      <p className="mb-8 text-sm text-mid">
        Enter your Order ID and the phone number used at checkout to check your order status.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Order ID
          </label>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. from your order confirmation page"
            required
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Mobile Number
          </label>
          <input
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number"
            required
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Track Order'}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm text-red">{error}</p> : null}

      {order ? (
        <div className="mt-8">
          <OrderCard order={order} razorpayKeyId={razorpayKeyId} allowPaymentResume />
        </div>
      ) : null}
    </div>
  )
}
