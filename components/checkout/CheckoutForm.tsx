'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCartStore, cartSubtotal } from '@/lib/cart/store'
import { INDIAN_STATES } from '@/lib/constants'
import CouponInput, { type AppliedCoupon } from '@/components/checkout/CouponInput'
import RazorpayButton from '@/components/checkout/RazorpayButton'
import { trackPixelEvent } from '@/lib/analytics/metaPixel'

export type ShippingAddress = {
  line1: string
  city: string
  state: string
  pincode: string
  country: 'IN'
}

export default function CheckoutForm({ isGuestCheckout }: { isGuestCheckout: boolean }) {
  const items = useCartStore((s) => s.items)
  const subtotal = cartSubtotal(items)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [state, setState] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

  const discount = appliedCoupon?.discountInr ?? 0
  const total = Math.max(0, subtotal - discount)

  useEffect(() => {
    if (items.length === 0) return
    trackPixelEvent('InitiateCheckout', {
      content_ids: items.map((i) => i.product_id).join(','),
      value: subtotal,
      currency: 'INR',
      num_items: items.length,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fire once when checkout is first reached, not on every cart edit
  }, [])

  const fieldsValid =
    firstName.trim() &&
    lastName.trim() &&
    /^\d{10}$/.test(phone) &&
    /.+@.+\..+/.test(email) &&
    address.trim() &&
    city.trim() &&
    /^\d{6}$/.test(pincode) &&
    state

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm text-mid">Your cart is empty.</p>
        <Link href="/shop" className="text-sm font-medium text-ink underline">
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-6 py-12 md:grid-cols-2 md:px-12">
      <div>
        <h1 className="mb-6 font-serif text-3xl text-ink">Checkout</h1>
        {isGuestCheckout ? (
          <p className="mb-5 rounded-lg bg-off px-4 py-3 text-xs text-mid">
            Checking out as guest — this order won&apos;t appear in an account order history.
          </p>
        ) : null}

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              First Name *
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Last Name *
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Mobile Number *
          </label>
          <input
            value={phone}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder="10-digit mobile number"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            Address Line *
          </label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House/Flat No., Street, Area, Landmark"
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              City *
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
              Pincode *
            </label>
            <input
              value={pincode}
              maxLength={6}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
            State *
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <CouponInput
          items={items}
          applied={appliedCoupon}
          onApply={setAppliedCoupon}
          onClear={() => setAppliedCoupon(null)}
        />
      </div>

      <div>
        <h2 className="mb-4 font-serif text-xl text-ink">Order Summary</h2>
        <div className="mb-4 divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <div key={`${item.product_id}::${item.variant_id}`} className="flex justify-between px-4 py-3 text-sm">
              <div>
                <div className="text-ink">{item.name_snapshot}</div>
                <div className="text-xs text-mid">
                  {item.variant_label_snapshot} × {item.quantity}
                </div>
              </div>
              <div className="text-ink">
                ₹{(item.unit_price_snapshot * item.quantity).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 space-y-1.5 rounded-lg bg-off px-4 py-3.5 text-sm">
          <div className="flex justify-between text-mid">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-mid">
              <span>Discount ({appliedCoupon?.code})</span>
              <span>−₹{discount.toLocaleString('en-IN')}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-border-2 pt-1.5 text-base font-medium text-ink">
            <span>Total Payable</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <RazorpayButton
          items={items}
          couponCode={appliedCoupon?.code ?? null}
          contact={{ name: `${firstName.trim()} ${lastName.trim()}`.trim(), phone, email }}
          shippingAddress={{ line1: address, city, state, pincode, country: 'IN' }}
          isGuestCheckout={isGuestCheckout}
          disabled={!fieldsValid}
        />
        <p className="mt-3 text-center text-[11px] text-dim">
          Secured by Razorpay · UPI · Cards · Net Banking · Wallets
        </p>
      </div>
    </div>
  )
}
