import { notFound, redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import ProductForm from '@/components/admin/ProductForm'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase.from('products').select('*').eq('id', params.id).maybeSingle()

  if (!data) notFound()

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Edit Product</h1>
        <ProductForm product={data as Product} />
      </div>
    </div>
  )
}
