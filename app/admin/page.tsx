import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import DateRangeFilter from '@/components/admin/dashboard/DateRangeFilter'
import RevenueChart from '@/components/admin/dashboard/RevenueChart'
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart'
import TopProductsChart from '@/components/admin/dashboard/TopProductsChart'
import type { Order } from '@/lib/types'

export const revalidate = 0

const ALLOWED_RANGES = [7, 30, 90, 365]

type SummaryRow = {
  all_time_revenue_inr: number
  all_time_order_count: number
  recent_revenue_inr: number
  recent_order_count: number
  avg_order_value_inr: number
  previous_period_revenue_inr: number
  previous_period_order_count: number
}

type TopProductRow = {
  product_id: string
  product_name: string
  quantity_sold: number
  revenue_inr: number
}

type RevenuePoint = { bucket_date: string; revenue_inr: number; order_count: number }
type StatusRow = { status: string; order_count: number }

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function trendFrom(current: number, previous: number): { direction: 'up' | 'down' | 'flat'; pct: number } {
  if (previous === 0) {
    if (current === 0) return { direction: 'flat', pct: 0 }
    return { direction: 'up', pct: 100 }
  }
  const pct = ((current - previous) / previous) * 100
  return { direction: pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat', pct: Math.round(pct) }
}

function StatTile({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend?: { direction: 'up' | 'down' | 'flat'; pct: number }
}) {
  return (
    <div className="rounded-lg border border-border-2 bg-off p-4">
      <div className="text-[11px] uppercase tracking-wide text-dim">{label}</div>
      <div className="mt-1 font-serif text-2xl text-ink">{value}</div>
      {trend ? (
        <div
          className={`mt-1 text-[11px] font-medium ${
            trend.direction === 'up' ? 'text-[#1a6b3a]' : trend.direction === 'down' ? 'text-red' : 'text-dim'
          }`}
        >
          {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {Math.abs(trend.pct)}%{' '}
          <span className="font-normal text-dim">vs previous period</span>
        </div>
      ) : null}
    </div>
  )
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: { days?: string }
}) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const requestedDays = Number(searchParams.days)
  const days = ALLOWED_RANGES.includes(requestedDays) ? requestedDays : 30

  const supabase = createClient()

  const [{ data: summaryRows }, { data: topProducts }, { data: revenueSeries }, { data: statusBreakdown }, { data: recentOrders }] =
    await Promise.all([
      supabase.rpc('admin_dashboard_summary', { p_days: days }),
      supabase.rpc('admin_top_products', { p_days: days, p_limit: 5 }),
      supabase.rpc('admin_revenue_timeseries', { p_days: days }),
      supabase.rpc('admin_order_status_breakdown', { p_days: days }),
      supabase
        .from('orders')
        .select('id, contact_name, amount_inr, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
    ])

  const summary = (summaryRows?.[0] ?? null) as SummaryRow | null
  const products = (topProducts ?? []) as TopProductRow[]
  const revenuePoints = (revenueSeries ?? []) as RevenuePoint[]
  const statusRows = (statusBreakdown ?? []) as StatusRow[]
  const orders = (recentOrders ?? []) as Pick<Order, 'id' | 'contact_name' | 'amount_inr' | 'status' | 'created_at'>[]

  const revenueTrend = summary
    ? trendFrom(summary.recent_revenue_inr, summary.previous_period_revenue_inr)
    : undefined
  const ordersTrend = summary
    ? trendFrom(summary.recent_order_count, summary.previous_period_order_count)
    : undefined

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-ink">Dashboard</h1>
        </div>
        <DateRangeFilter activeDays={days} />

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="All-Time Revenue" value={formatInr(summary?.all_time_revenue_inr ?? 0)} />
          <StatTile label="All-Time Orders" value={String(summary?.all_time_order_count ?? 0)} />
          <StatTile
            label={`Revenue (${days}d)`}
            value={formatInr(summary?.recent_revenue_inr ?? 0)}
            trend={revenueTrend}
          />
          <StatTile
            label={`Orders (${days}d)`}
            value={String(summary?.recent_order_count ?? 0)}
            trend={ordersTrend}
          />
          <StatTile label="Avg. Order Value" value={formatInr(summary?.avg_order_value_inr ?? 0)} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border-2 p-4 lg:col-span-2">
            <h2 className="mb-3 text-sm font-medium text-ink">Revenue Over Time</h2>
            <RevenueChart data={revenuePoints} />
          </div>
          <div className="rounded-lg border border-border-2 p-4">
            <h2 className="mb-3 text-sm font-medium text-ink">Order Status</h2>
            <OrderStatusChart data={statusRows} />
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-border-2 p-4">
          <h2 className="mb-3 text-sm font-medium text-ink">Top Products ({days}d)</h2>
          <TopProductsChart data={products} />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium text-ink hover:text-red">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-mid">No orders yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
                  <th className="px-3 py-2">Customer</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-border">
                    <td className="px-3 py-2 text-sm text-ink">{o.contact_name}</td>
                    <td className="px-3 py-2 text-xs text-mid">{formatInr(o.amount_inr)}</td>
                    <td className="px-3 py-2 text-xs text-mid capitalize">{o.status}</td>
                    <td className="px-3 py-2 text-xs text-mid">
                      {new Date(o.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
