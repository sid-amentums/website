import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function ShopPage() {
  const supabase = createClient()
  const [{ data, error }, { data: bestSellerRows }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true }),
    supabase.rpc('public_best_seller_ids', { p_limit: 3 }),
  ])

  const products = (data ?? []) as Product[]
  const bestSellerIds = new Set(
    ((bestSellerRows ?? []) as { product_id: string }[]).map((r) => r.product_id)
  )

  return (
    <div className="px-6 pb-24 md:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border py-11">
        <h1 className="font-serif text-3xl text-ink md:text-5xl">Shop Javelins</h1>
      </div>

      {error ? (
        <div className="py-24 text-center text-sm text-mid">
          Couldn&apos;t load the shop right now — please refresh the page.
        </div>
      ) : (
        <ProductGrid products={products} bestSellerIds={bestSellerIds} />
      )}
    </div>
  )
}
