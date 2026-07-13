import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import OrderCard, { type OrderCardData } from '@/components/account/OrderCard'
import BanToggleButton from '@/components/admin/customers/BanToggleButton'
import TagEditor from '@/components/admin/customers/TagEditor'
import EmailComposer from '@/components/admin/customers/EmailComposer'
import ActivityTimeline, { type ActivityRow } from '@/components/admin/customers/ActivityTimeline'
import { getCustomerSegments, SEGMENT_LABELS, type Segment } from '@/lib/customers/segments'

export const revalidate = 0

const SEGMENT_PILL_CLASS: Record<Segment, string> = {
  vip: 'bg-[#c8a227] text-w',
  repeat: 'bg-ink text-w',
  at_risk: 'bg-red text-w',
  new: 'border border-border-2 text-mid',
}

export default async function AdminCustomerDetailPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabaseAdmin = createAdminClient()
  const supabase = createClient()
  const [{ data: userRes, error: userError }, { data: adminRow }] = await Promise.all([
    supabaseAdmin.auth.admin.getUserById(params.id),
    supabaseAdmin.from('admin_users').select('id').eq('id', params.id).maybeSingle(),
  ])

  if (userError || !userRes.user || adminRow) notFound()
  const user = userRes.user

  const [{ data: orders }, { data: profile }, { data: activity }] = await Promise.all([
    supabaseAdmin
      .from('orders')
      .select(
        'id, created_at, status, items, amount_inr, shipping_status, awb_number, razorpay_order_id, contact_name, contact_phone, contact_email, paid_at'
      )
      .eq('user_id', params.id)
      .order('created_at', { ascending: false }),
    supabase.from('customer_profiles').select('tags').eq('user_id', params.id).maybeSingle(),
    supabase
      .from('customer_activity')
      .select('id, admin_email, type, subject, body, created_at')
      .eq('user_id', params.id)
      .order('created_at', { ascending: false }),
  ])

  const banned = Boolean(user.banned_until && new Date(user.banned_until) > new Date())
  const orderRows = (orders ?? []) as (OrderCardData & { paid_at: string | null })[]
  const paidOrders = orderRows.filter((o) => o.status === 'paid')
  const totalSpentInr = paidOrders.reduce((sum, o) => sum + o.amount_inr, 0)
  const lastPaidOrderAt = paidOrders.reduce<string | null>(
    (latest, o) => (o.paid_at && (!latest || o.paid_at > latest) ? o.paid_at : latest),
    null
  )
  const segments = getCustomerSegments({ paidOrderCount: paidOrders.length, totalSpentInr, lastPaidOrderAt })

  const mostRecentOrder = orderRows[0]
  const displayName = mostRecentOrder?.contact_name ?? null
  const knownPhone = mostRecentOrder?.contact_phone ?? null

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/admin/customers" className="mb-4 inline-block text-xs text-mid hover:text-ink">
          ← Back to Customers
        </Link>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border-2 p-5">
          <div>
            <h1 className="font-serif text-2xl text-ink">{displayName ?? user.email}</h1>
            <p className="text-xs text-dim">{user.email}</p>
            <p className="mt-1 text-xs text-dim">
              Signed up {new Date(user.created_at).toLocaleDateString('en-IN')}
              {user.last_sign_in_at
                ? ` · Last login ${new Date(user.last_sign_in_at).toLocaleDateString('en-IN')}`
                : ''}
            </p>
            <p className="mt-2 text-sm text-mid">
              {paidOrders.length} order{paidOrders.length === 1 ? '' : 's'} · ₹
              {totalSpentInr.toLocaleString('en-IN')} spent
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {segments.map((s) => (
                <span
                  key={s}
                  className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase ${SEGMENT_PILL_CLASS[s]}`}
                >
                  {SEGMENT_LABELS[s]}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-medium ${banned ? 'text-red' : 'text-[#1a6b3a]'}`}>
              {banned ? 'Banned' : 'Active'}
            </span>
            <BanToggleButton userId={user.id} initialBanned={banned} />
            {knownPhone ? (
              <a
                href={`https://wa.me/91${knownPhone}?text=${encodeURIComponent(`Hi ${displayName ?? ''}, `.trim() + ' ')}`}
                target="_blank"
                rel="noopener"
                className="rounded-pill bg-[#25D366] px-4 py-1.5 text-xs font-medium text-w hover:opacity-90"
              >
                WhatsApp →
              </a>
            ) : (
              <span className="text-[11px] text-dim">No phone on file yet</span>
            )}
          </div>
        </div>

        <div className="mb-6 rounded-lg border border-border-2 p-5">
          <h2 className="mb-3 text-sm font-medium text-ink">Tags</h2>
          <TagEditor userId={user.id} initialTags={profile?.tags ?? []} />
        </div>

        <div className="mb-6 rounded-lg border border-border-2 p-5">
          <h2 className="mb-3 text-sm font-medium text-ink">Send Email</h2>
          <EmailComposer userId={user.id} customerEmail={user.email ?? ''} />
        </div>

        <div className="mb-6 rounded-lg border border-border-2 p-5">
          <h2 className="mb-3 text-sm font-medium text-ink">Activity</h2>
          <ActivityTimeline userId={user.id} activity={(activity ?? []) as ActivityRow[]} />
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
