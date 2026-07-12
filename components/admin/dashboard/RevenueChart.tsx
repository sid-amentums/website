'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Point = { bucket_date: string; revenue_inr: number; order_count: number }

const RED = '#c8171a'

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function formatCompactInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: Point }[] }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  return (
    <div className="rounded-lg border border-border-2 bg-w px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-ink">₹{point.revenue_inr.toLocaleString('en-IN')}</div>
      <div className="mt-0.5 text-dim">
        {formatShortDate(point.bucket_date)} · {point.order_count} order{point.order_count === 1 ? '' : 's'}
      </div>
    </div>
  )
}

export default function RevenueChart({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e0ddd6" strokeDasharray="0" />
        <XAxis
          dataKey="bucket_date"
          tickFormatter={formatShortDate}
          tick={{ fontSize: 11, fill: '#a0a0a0' }}
          axisLine={{ stroke: '#e0ddd6' }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={formatCompactInr}
          tick={{ fontSize: 11, fill: '#a0a0a0' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#c3c2b7', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue_inr"
          stroke={RED}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={RED}
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
