import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/shop/ProductGrid'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function ShopPage() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true })

  const products = (data ?? []) as Product[]

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
        <ProductGrid products={products} />
      )}
    </div>
  )
}
