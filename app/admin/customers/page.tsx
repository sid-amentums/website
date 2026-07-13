import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import CustomerDirectory, { type CustomerRow } from '@/components/admin/customers/CustomerDirectory'
import { getCustomerSegments } from '@/lib/customers/segments'

export const revalidate = 0

// Small-store scale assumption: one page of up to 200 customers, filtered
// and sorted client-side for instant search — Supabase's Admin Auth API
// has no server-side search parameter, and this store's real customer
// count is nowhere near 200. Revisit with real pagination if that changes.
const MAX_CUSTOMERS = 200

export default async function AdminCustomersPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabaseAdmin = createAdminClient()
  const supabase = createClient()
  const [{ data: listResult }, { data: adminRows }] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: MAX_CUSTOMERS }),
    supabaseAdmin.from('admin_users').select('id'),
  ])

  // Admin accounts are regular auth.users rows too (just with an extra
  // admin_users row) — exclude them here so an admin never appears in
  // their own "Customers" list, which also keeps them out of reach of the
  // ban button below (banning the only admin would lock out the panel).
  const adminIds = new Set((adminRows ?? []).map((a) => a.id))
  const users = listResult.users.filter((u) => !adminIds.has(u.id))
  const userIds = users.map((u) => u.id)

  const [{ data: orders }, { data: profiles }] = await Promise.all([
    userIds.length
      ? supabaseAdmin.from('orders').select('user_id, amount_inr, status, paid_at, created_at, contact_name').in('user_id', userIds)
      : Promise.resolve({
          data: [] as {
            user_id: string | null
            amount_inr: number
            status: string
            paid_at: string | null
            created_at: string
            contact_name: string
          }[],
        }),
    userIds.length
      ? supabase.from('customer_profiles').select('user_id, tags').in('user_id', userIds)
      : Promise.resolve({ data: [] as { user_id: string; tags: string[] }[] }),
  ])

  const statsByUser = new Map<
    string,
    { paidOrderCount: number; totalSpentInr: number; lastPaidOrderAt: string | null; name: string | null; lastOrderCreatedAt: string }
  >()
  for (const order of orders ?? []) {
    if (!order.user_id) continue
    const existing = statsByUser.get(order.user_id) ?? {
      paidOrderCount: 0,
      totalSpentInr: 0,
      lastPaidOrderAt: null,
      name: null,
      lastOrderCreatedAt: '',
    }
    if (order.status === 'paid') {
      existing.paidOrderCount += 1
      existing.totalSpentInr += order.amount_inr
      if (order.paid_at && (!existing.lastPaidOrderAt || order.paid_at > existing.lastPaidOrderAt)) {
        existing.lastPaidOrderAt = order.paid_at
      }
    }
    if (order.created_at > existing.lastOrderCreatedAt) {
      existing.lastOrderCreatedAt = order.created_at
      existing.name = order.contact_name
    }
    statsByUser.set(order.user_id, existing)
  }

  const tagsByUser = new Map((profiles ?? []).map((p) => [p.user_id, p.tags]))

  const customers: CustomerRow[] = users.map((u) => {
    const stats = statsByUser.get(u.id) ?? {
      paidOrderCount: 0,
      totalSpentInr: 0,
      lastPaidOrderAt: null,
      name: null,
      lastOrderCreatedAt: '',
    }
    return {
      id: u.id,
      email: u.email ?? '(no email)',
      name: stats.name,
      createdAt: u.created_at,
      banned: Boolean(u.banned_until && new Date(u.banned_until) > new Date()),
      paidOrderCount: stats.paidOrderCount,
      totalSpentInr: stats.totalSpentInr,
      lastPaidOrderAt: stats.lastPaidOrderAt,
      tags: tagsByUser.get(u.id) ?? [],
      segments: getCustomerSegments(stats),
    }
  })

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Customers</h1>
        <CustomerDirectory customers={customers} />
      </div>
    </div>
  )
}
