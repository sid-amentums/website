'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type ProductRow = { product_id: string; product_name: string; quantity_sold: number; revenue_inr: number }

const INK = '#0a0a0a'

function formatCompactInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

function truncateName(name: string) {
  return name.length > 18 ? `${name.slice(0, 17)}…` : name
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: { payload: ProductRow }[] }) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-border-2 bg-w px-3 py-2 text-xs shadow-lg">
      <div className="font-medium text-ink">₹{row.revenue_inr.toLocaleString('en-IN')}</div>
      <div className="mt-0.5 text-dim">
        {row.product_name} · {row.quantity_sold} sold
      </div>
    </div>
  )
}

export default function TopProductsChart({ data }: { data: ProductRow[] }) {
  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-mid">No paid orders in this window yet.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 48, left: 4, bottom: 4 }}
        barCategoryGap={12}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="product_name"
          tickFormatter={truncateName}
          tick={{ fontSize: 12, fill: '#0a0a0a' }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f5f4f1' }} />
        <Bar dataKey="revenue_inr" fill={INK} radius={[0, 4, 4, 0]} maxBarSize={24}>
          {data.map((row) => (
            <Cell key={row.product_id} fill={INK} />
          ))}
          <LabelList
            dataKey="revenue_inr"
            position="right"
            formatter={(v: unknown) => (typeof v === 'number' ? formatCompactInr(v) : '')}
            style={{ fontSize: 11, fill: '#6b6b6b' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
