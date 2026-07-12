'use client'

import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type StatusRow = { status: string; order_count: number }

// Status is a fixed, reserved encoding (never themed like a generic
// categorical series) — paid/failed reuse the exact greens/reds already
// used for these same states elsewhere in the admin UI (OrderCard.tsx),
// so "paid" always means the same color across the whole panel.
const STATUS_COLORS: Record<string, string> = {
  paid: '#1a6b3a',
  created: '#a0a0a0',
  failed: '#c8171a',
  refunded: '#8a5cf0',
  cancelled: '#6b6b6b',
}

const STATUS_LABELS: Record<string, string> = {
  paid: 'Paid',
  created: 'Awaiting Payment',
  failed: 'Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: StatusRow }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-border-2 bg-w px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-ink">{row.order_count} order{row.order_count === 1 ? '' : 's'}</div>
      <div className="mt-0.5 text-dim">{STATUS_LABELS[row.status] ?? row.status}</div>
    </div>
  )
}

export default function OrderStatusChart({ data }: { data: StatusRow[] }) {
  const total = data.reduce((sum, d) => sum + d.order_count, 0)

  if (total === 0) {
    return <p className="py-16 text-center text-sm text-mid">No orders in this window yet.</p>
  }

  const coloredData = data.map((row) => ({ ...row, fill: STATUS_COLORS[row.status] ?? '#a0a0a0' }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={coloredData}
          dataKey="order_count"
          nameKey="status"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={2}
          strokeWidth={0}
          isAnimationActive={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend
          formatter={(value: string) => (
            <span className="text-xs text-mid">{STATUS_LABELS[value] ?? value}</span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
