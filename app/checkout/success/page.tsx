import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CartItem } from '@/lib/types'
import PurchasePixelEvent from '@/components/checkout/PurchasePixelEvent'
import CopyOrderId from '@/components/checkout/CopyOrderId'

export const revalidate = 0

// Reads via the service_role client rather than the caller's session: this
// is the one confirmation view guest orders need (no account, no order
// history), and the order id itself is an unguessable UUID acting as a
// one-time capability token — not indexed or listable anywhere.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string }
}) {
  const orderId = searchParams.order

  if (!orderId) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-mid">No order reference provided.</p>
        <Link href="/shop" className="mt-4 text-sm font-medium text-ink underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const admin = createAdminClient()
  const { data: order } = await admin
    .from('orders')
    .select('id, status, amount_inr, items, contact_name, shipping_address, created_at')
    .eq('id', orderId)
    .maybeSingle()

  if (!order || order.status !== 'paid') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-mid">
          We couldn&apos;t confirm this order yet. If you were charged, please contact support.
        </p>
        <Link href="/shop" className="mt-4 text-sm font-medium text-ink underline">
          Back to shop
        </Link>
      </div>
    )
  }

  const items = order.items as CartItem[]

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <PurchasePixelEvent orderId={order.id} amountInr={order.amount_inr} items={items} />
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366]/10 text-2xl text-[#25D366]">
        ✓
      </div>
      <h1 className="mb-2 font-serif text-3xl text-ink">Order Confirmed</h1>
      <p className="mb-8 text-sm text-mid">
        Thank you, {order.contact_name}. Your payment has been verified and your order is
        confirmed.
      </p>

      <div className="mb-6 divide-y divide-border rounded-lg border border-border text-left">
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

      <div className="mb-6 flex justify-between rounded-lg bg-off px-4 py-3.5 text-sm">
        <span className="text-mid">Total Paid</span>
        <span className="font-medium text-ink">₹{order.amount_inr.toLocaleString('en-IN')}</span>
      </div>

      <CopyOrderId orderId={order.id} />

      <p className="mb-8 text-xs text-dim">
        Save your Order ID above — use it with your phone number on the{' '}
        <Link href="/track-order" className="text-ink underline">
          Track My Order
        </Link>{' '}
        page to check shipping status anytime.
      </p>

      <Link
        href="/shop"
        className="inline-block rounded-pill bg-ink px-8 py-3 text-sm font-medium text-w transition-colors hover:bg-red"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
