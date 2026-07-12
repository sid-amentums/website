import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import type { Order } from '@/lib/types'

export const revalidate = 0

type SummaryRow = {
  all_time_revenue_inr: number
  all_time_order_count: number
  recent_revenue_inr: number
  recent_order_count: number
  avg_order_value_inr: number
}

type TopProductRow = {
  product_id: string
  product_name: string
  quantity_sold: number
  revenue_inr: number
}

function formatInr(amount: number) {
  return `₹${amount.toLocaleString('en-IN')}`
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-2 bg-off p-4">
      <div className="text-[11px] uppercase tracking-wide text-dim">{label}</div>
      <div className="mt-1 font-serif text-2xl text-ink">{value}</div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()

  const [{ data: summaryRows }, { data: topProducts }, { data: recentOrders }] = await Promise.all([
    supabase.rpc('admin_dashboard_summary', { p_days: 30 }),
    supabase.rpc('admin_top_products', { p_days: 30, p_limit: 5 }),
    supabase
      .from('orders')
      .select('id, contact_name, amount_inr, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const summary = (summaryRows?.[0] ?? null) as SummaryRow | null
  const products = (topProducts ?? []) as TopProductRow[]
  const orders = (recentOrders ?? []) as Pick<Order, 'id' | 'contact_name' | 'amount_inr' | 'status' | 'created_at'>[]

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Dashboard</h1>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatTile label="All-Time Revenue" value={formatInr(summary?.all_time_revenue_inr ?? 0)} />
          <StatTile label="All-Time Orders" value={String(summary?.all_time_order_count ?? 0)} />
          <StatTile label="Last 30 Days Revenue" value={formatInr(summary?.recent_revenue_inr ?? 0)} />
          <StatTile label="Last 30 Days Orders" value={String(summary?.recent_order_count ?? 0)} />
          <StatTile label="Avg. Order Value" value={formatInr(summary?.avg_order_value_inr ?? 0)} />
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-medium text-ink">Top Products (Last 30 Days)</h2>
          {products.length === 0 ? (
            <p className="text-sm text-mid">No paid orders in this window yet.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Units Sold</th>
                  <th className="px-3 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.product_id} className="border-b border-border">
                    <td className="px-3 py-2 text-sm text-ink">{p.product_name}</td>
                    <td className="px-3 py-2 text-xs text-mid">{p.quantity_sold}</td>
                    <td className="px-3 py-2 text-xs text-mid">{formatInr(p.revenue_inr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
