import { redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminNav from '@/components/admin/AdminNav'

export const revalidate = 0

const PER_PAGE = 50

type CustomerRow = {
  id: string
  email: string
  createdAt: string
  banned: boolean
  orderCount: number
  totalSpentInr: number
}

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const page = Math.max(1, Number(searchParams.page) || 1)

  const supabaseAdmin = createAdminClient()
  const [{ data: listResult }, { data: adminRows }] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE }),
    supabaseAdmin.from('admin_users').select('id'),
  ])

  // Admin accounts are regular auth.users rows too (just with an extra
  // admin_users row) — exclude them here so an admin never appears in
  // their own "Customers" list, which also keeps them out of reach of the
  // ban button below (banning the only admin would lock out the panel).
  const adminIds = new Set((adminRows ?? []).map((a) => a.id))
  const users = listResult.users.filter((u) => !adminIds.has(u.id))

  const userIds = users.map((u) => u.id)
  const { data: orders } = userIds.length
    ? await supabaseAdmin.from('orders').select('user_id, amount_inr, status').in('user_id', userIds)
    : { data: [] }

  const statsByUser = new Map<string, { orderCount: number; totalSpentInr: number }>()
  for (const order of orders ?? []) {
    if (!order.user_id) continue
    const existing = statsByUser.get(order.user_id) ?? { orderCount: 0, totalSpentInr: 0 }
    existing.orderCount += 1
    if (order.status === 'paid') existing.totalSpentInr += order.amount_inr
    statsByUser.set(order.user_id, existing)
  }

  const customers: CustomerRow[] = users.map((u) => ({
    id: u.id,
    email: u.email ?? '(no email)',
    createdAt: u.created_at,
    banned: Boolean(u.banned_until && new Date(u.banned_until) > new Date()),
    orderCount: statsByUser.get(u.id)?.orderCount ?? 0,
    totalSpentInr: statsByUser.get(u.id)?.totalSpentInr ?? 0,
  }))

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Customers</h1>

        {customers.length === 0 ? (
          <p className="text-sm text-mid">No registered customers yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Signed Up</th>
                <th className="px-3 py-2">Orders</th>
                <th className="px-3 py-2">Total Spent</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border">
                  <td className="px-3 py-3 align-top text-sm text-ink">{c.email}</td>
                  <td className="px-3 py-3 align-top text-xs text-mid">
                    {new Date(c.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-3 py-3 align-top text-xs text-mid">{c.orderCount}</td>
                  <td className="px-3 py-3 align-top text-xs text-mid">
                    ₹{c.totalSpentInr.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 align-top">
                    <span className={`text-xs font-medium ${c.banned ? 'text-red' : 'text-[#1a6b3a]'}`}>
                      {c.banned ? 'Banned' : 'Active'}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="text-xs font-medium text-ink hover:text-red"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 flex items-center gap-3">
          {page > 1 ? (
            <Link
              href={`/admin/customers?page=${page - 1}`}
              className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink"
            >
              ← Previous
            </Link>
          ) : null}
          {listResult.users.length === PER_PAGE ? (
            <Link
              href={`/admin/customers?page=${page + 1}`}
              className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink"
            >
              Next →
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  )
}
