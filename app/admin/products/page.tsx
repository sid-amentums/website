import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import ProductTable from '@/components/admin/ProductTable'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function AdminProductsPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase.from('products').select('*').order('name', { ascending: true })

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Products</h1>
        <ProductTable products={(data ?? []) as Product[]} />
      </div>
    </div>
  )
}
