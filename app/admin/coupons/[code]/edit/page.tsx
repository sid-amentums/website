import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import CouponForm from '@/components/admin/CouponForm'
import type { Coupon } from '@/lib/types'

export const revalidate = 0

export default async function EditCouponPage({ params }: { params: { code: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', decodeURIComponent(params.code).toUpperCase())
    .maybeSingle()

  if (!data) notFound()

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Edit Coupon</h1>
        <CouponForm coupon={data as Coupon} />
      </div>
    </div>
  )
}
