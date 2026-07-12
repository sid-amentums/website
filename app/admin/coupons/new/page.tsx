import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import CouponForm from '@/components/admin/CouponForm'

export const revalidate = 0

export default async function NewCouponPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, active')
    .order('name', { ascending: true })

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">New Coupon</h1>
        <CouponForm products={products ?? []} />
      </div>
    </div>
  )
}
