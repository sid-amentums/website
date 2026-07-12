'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Coupon } from '@/lib/types'

function formatWindow(coupon: Coupon) {
  if (!coupon.starts_at && !coupon.expires_at) return 'Always'
  const start = coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString('en-IN') : '…'
  const end = coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString('en-IN') : '…'
  return `${start} – ${end}`
}

function CouponRow({ coupon }: { coupon: Coupon }) {
  const [active, setActive] = useState(coupon.active)
  const [saving, setSaving] = useState(false)

  async function toggleActive() {
    const next = !active
    setActive(next)
    setSaving(true)
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        description: coupon.description,
        active: next,
        max_uses: coupon.max_uses,
        min_order_amount: coupon.min_order_amount,
        starts_at: coupon.starts_at,
        expires_at: coupon.expires_at,
      }),
    })
    setSaving(false)
  }

  return (
    <tr className="border-b border-border">
      <td className="px-3 py-3 align-top">
        <div className="text-sm font-medium text-ink">{coupon.code}</div>
        {coupon.description ? <div className="text-xs text-dim">{coupon.description}</div> : null}
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">
        {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value.toLocaleString('en-IN')} off`}
      </td>
      <td className="px-3 py-3 align-top">
        <span className={`text-xs font-medium ${active ? 'text-[#1a6b3a]' : 'text-red'}`}>
          {active ? 'Active' : 'Deactivated'}
        </span>
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">
        {coupon.usage_count} / {coupon.max_uses ?? '∞'}
      </td>
      <td className="px-3 py-3 align-top text-xs text-mid">{formatWindow(coupon)}</td>
      <td className="px-3 py-3 align-top">
        <div className="flex items-center gap-3">
          <Link href={`/admin/coupons/${coupon.code}/edit`} className="text-xs font-medium text-ink hover:text-red">
            Edit
          </Link>
          <button
            onClick={toggleActive}
            disabled={saving}
            className="text-xs text-mid hover:text-red disabled:opacity-50"
          >
            {active ? 'Deactivate' : 'Reactivate'}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function CouponTable({ coupons }: { coupons: Coupon[] }) {
  if (coupons.length === 0) {
    return <p className="text-sm text-mid">No coupons yet — add your first one.</p>
  }

  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
          <th className="px-3 py-2">Code</th>
          <th className="px-3 py-2">Discount</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Usage</th>
          <th className="px-3 py-2">Window</th>
          <th className="px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((c) => (
          <CouponRow key={c.code} coupon={c} />
        ))}
      </tbody>
    </table>
  )
}
