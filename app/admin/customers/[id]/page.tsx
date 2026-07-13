import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import AdminNav from '@/components/admin/AdminNav'
import OrderCard, { type OrderCardData } from '@/components/account/OrderCard'
import BanToggleButton from '@/components/admin/customers/BanToggleButton'

export const revalidate = 0

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabaseAdmin = createAdminClient()
  const [{ data: userRes, error: userError }, { data: adminRow }] = await Promise.all([
    supabaseAdmin.auth.admin.getUserById(params.id),
    supabaseAdmin.from('admin_users').select('id').eq('id', params.id).maybeSingle(),
  ])

  // Admin accounts aren't customers — same exclusion as the list page, so
  // this page can never be reached for one even via a direct URL.
  if (userError || !userRes.user || adminRow) notFound()
  const user = userRes.user

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select(
      'id, created_at, status, items, amount_inr, shipping_status, awb_number, razorpay_order_id, contact_name, contact_phone, contact_email'
    )
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  const banned = Boolean(user.banned_until && new Date(user.banned_until) > new Date())
  const orderRows = (orders ?? []) as OrderCardData[]
  const totalSpentInr = orderRows.reduce((sum, o) => (o.status === 'paid' ? sum + o.amount_inr : sum), 0)

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/admin/customers" className="mb-4 inline-block text-xs text-mid hover:text-ink">
          ← Back to Customers
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border-2 p-5">
          <div>
            <h1 className="font-serif text-2xl text-ink">{user.email}</h1>
            <p className="mt-1 text-xs text-dim">
              Signed up {new Date(user.created_at).toLocaleDateString('en-IN')}
              {user.last_sign_in_at
                ? ` · Last login ${new Date(user.last_sign_in_at).toLocaleDateString('en-IN')}`
                : ''}
            </p>
            <p className="mt-2 text-sm text-mid">
              {orderRows.length} order{orderRows.length === 1 ? '' : 's'} · ₹
              {totalSpentInr.toLocaleString('en-IN')} spent
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-medium ${banned ? 'text-red' : 'text-[#1a6b3a]'}`}>
              {banned ? 'Banned' : 'Active'}
            </span>
            <BanToggleButton userId={user.id} initialBanned={banned} />
          </div>
        </div>

        <h2 className="mb-3 text-sm font-medium text-ink">Order History</h2>
        {orderRows.length === 0 ? (
          <p className="text-sm text-mid">This customer hasn&apos;t placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orderRows.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
