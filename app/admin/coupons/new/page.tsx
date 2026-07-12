import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import AdminNav from '@/components/admin/AdminNav'
import CouponForm from '@/components/admin/CouponForm'

export default async function NewCouponPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">New Coupon</h1>
        <CouponForm />
      </div>
    </div>
  )
}
