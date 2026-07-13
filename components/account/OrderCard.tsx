import type { Order, ShippingStatus } from '@/lib/types'
import ResumePaymentButton from '@/components/checkout/ResumePaymentButton'

const SHIPPING_LABELS: Record<ShippingStatus, string> = {
  pending: 'Pending',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
}

const STATUS_LABELS: Record<Order['status'], string> = {
  created: 'Awaiting Payment',
  paid: 'Paid',
  failed: 'Payment Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
}

export type OrderCardData = Pick<
  Order,
  | 'id'
  | 'created_at'
  | 'status'
  | 'items'
  | 'amount_inr'
  | 'shipping_status'
  | 'awb_number'
  | 'razorpay_order_id'
  | 'contact_name'
  | 'contact_phone'
  | 'contact_email'
>

export default function OrderCard({
  order,
  razorpayKeyId,
  allowPaymentResume = false,
}: {
  order: OrderCardData
  razorpayKeyId?: string | null
  allowPaymentResume?: boolean
}) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="text-xs text-dim">
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <div className="mt-1 text-[11px] text-dim">Order #{order.id.slice(0, 8)}</div>
        </div>
        <span
          className={`rounded-pill px-3 py-1 text-[11px] font-medium uppercase ${
            order.status === 'paid'
              ? 'bg-[#25D366]/10 text-[#1a6b3a]'
              : order.status === 'failed' || order.status === 'cancelled'
                ? 'bg-red-bg text-red'
                : 'bg-off2 text-dim'
          }`}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mb-4 divide-y divide-border">
        {order.items.map((item) => (
          <div
            key={`${item.product_id}::${item.variant_id}`}
            className="flex justify-between py-2 text-sm"
          >
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

      <div className="mb-4 flex justify-between text-sm font-medium">
        <span className="text-mid">Total</span>
        <span className="text-ink">₹{order.amount_inr.toLocaleString('en-IN')}</span>
      </div>

      {order.status === 'paid' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-off px-4 py-3">
          <div className="text-sm">
            <span className="text-mid">Shipping status: </span>
            <span className="font-medium text-ink">
              {SHIPPING_LABELS[order.shipping_status]}
            </span>
            {order.awb_number ? (
              <span className="ml-3 text-mid">
                AWB: <span className="font-medium text-ink">{order.awb_number}</span>
              </span>
            ) : null}
          </div>
          {order.awb_number ? (
            <a
              href="https://www.dtdc.in/trackshipment"
              target="_blank"
              rel="noopener"
              className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:border-ink"
            >
              Track on DTDC ↗
            </a>
          ) : null}
        </div>
      ) : null}

      {order.status === 'created' && allowPaymentResume && order.razorpay_order_id && razorpayKeyId ? (
        <div className="rounded-lg bg-off px-4 py-3">
          <p className="mb-2 text-xs text-mid">
            This order is still awaiting payment — complete it to confirm your purchase.
          </p>
          <ResumePaymentButton
            orderId={order.id}
            razorpayOrderId={order.razorpay_order_id}
            amountInr={order.amount_inr}
            keyId={razorpayKeyId}
            contactName={order.contact_name}
            contactPhone={order.contact_phone}
            contactEmail={order.contact_email}
          />
        </div>
      ) : null}
    </div>
  )
}
