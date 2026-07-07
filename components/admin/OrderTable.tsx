'use client'

import { useState } from 'react'
import type { Order, ShippingStatus } from '@/lib/types'

const SHIPPING_STATUSES: ShippingStatus[] = [
  'pending',
  'packed',
  'shipped',
  'out_for_delivery',
  'delivered',
]

function OrderRow({ order }: { order: Order }) {
  const [awb, setAwb] = useState(order.awb_number ?? '')
  const [shippingStatus, setShippingStatus] = useState<ShippingStatus>(order.shipping_status)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ awb_number: awb.trim() || null, shipping_status: shippingStatus }),
    })
    setSaving(false)
    setMsg(res.ok ? 'Saved' : 'Failed to save')
  }

  return (
    <tr className="border-b border-border align-top">
      <td className="px-3 py-3">
        <div className="text-sm font-medium text-ink">{order.contact_name}</div>
        <div className="text-xs text-dim">{new Date(order.created_at).toLocaleDateString('en-IN')}</div>
        <div className="mt-1 text-[10px] text-dim">{order.id.slice(0, 8)}…</div>
      </td>
      <td className="px-3 py-3 text-sm text-ink">₹{order.amount_inr.toLocaleString('en-IN')}</td>
      <td className="px-3 py-3">
        <span
          className={`rounded-pill px-2.5 py-1 text-[11px] font-medium uppercase ${
            order.status === 'paid'
              ? 'bg-[#25D366]/10 text-[#1a6b3a]'
              : order.status === 'failed' || order.status === 'cancelled'
                ? 'bg-red-bg text-red'
                : 'bg-off2 text-dim'
          }`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-3 py-3">
        <input
          type="text"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          placeholder="AWB number"
          className="w-32 rounded border border-border-2 bg-off px-2 py-1 text-xs outline-none focus:border-ink focus:bg-w"
        />
      </td>
      <td className="px-3 py-3">
        <select
          value={shippingStatus}
          onChange={(e) => setShippingStatus(e.target.value as ShippingStatus)}
          className="rounded border border-border-2 bg-off px-2 py-1 text-xs outline-none focus:border-ink focus:bg-w"
        >
          {SHIPPING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink disabled:opacity-50"
        >
          {saving ? '…' : 'Save'}
        </button>
        {msg ? <div className="mt-1 text-[11px] text-dim">{msg}</div> : null}
      </td>
    </tr>
  )
}

export default function OrderTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-mid">No orders yet.</p>
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
          <th className="px-3 py-2">Customer</th>
          <th className="px-3 py-2">Amount</th>
          <th className="px-3 py-2">Payment</th>
          <th className="px-3 py-2">AWB Number</th>
          <th className="px-3 py-2">Shipping Status</th>
          <th className="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <OrderRow key={o.id} order={o} />
        ))}
      </tbody>
    </table>
  )
}
