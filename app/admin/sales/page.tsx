import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import SaleTable from '@/components/admin/SaleTable'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function AdminSalesPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('id, name, sku, variants, sale_percent, sale_starts_at, sale_ends_at')
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-1 font-serif text-2xl text-ink">Sales</h1>
        <p className="mb-6 text-sm text-mid">
          Set a discount % and a date range to put a product on sale — it discounts every variant, shows an
          &quot;On Sale&quot; badge, and reverts automatically once the range ends.
        </p>
        <SaleTable products={(data ?? []) as Pick<Product, 'id' | 'name' | 'sku' | 'variants' | 'sale_percent' | 'sale_starts_at' | 'sale_ends_at'>[]} />
      </div>
    </div>
  )
}
