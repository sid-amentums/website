import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import OrderTable from '@/components/admin/OrderTable'
import type { Order } from '@/lib/types'

export const revalidate = 0

export default async function AdminOrdersPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Orders</h1>
        <OrderTable orders={(data ?? []) as Order[]} />
      </div>
    </div>
  )
}
