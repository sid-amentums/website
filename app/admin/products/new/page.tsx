import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import AdminNav from '@/components/admin/AdminNav'
import ProductForm from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">New Product</h1>
        <ProductForm />
      </div>
    </div>
  )
}
