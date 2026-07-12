import { redirect } from 'next/navigation'
import Link from 'next/link'
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-ink">Products</h1>
          <Link
            href="/admin/products/new"
            className="rounded-pill bg-ink px-5 py-2.5 text-sm font-medium text-w transition-colors hover:bg-red"
          >
            New Product
          </Link>
        </div>
        <ProductTable products={(data ?? []) as Product[]} />
      </div>
    </div>
  )
}
