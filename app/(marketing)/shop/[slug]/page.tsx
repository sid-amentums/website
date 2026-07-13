import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetailView from '@/components/shop/ProductDetailView'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const [{ data }, { data: bestSellerRows }] = await Promise.all([
    supabase.from('products').select('*').eq('slug', params.slug).eq('active', true).maybeSingle(),
    supabase.rpc('public_best_seller_ids', { p_limit: 3 }),
  ])

  if (!data) notFound()

  const bestSellerIds = new Set(
    ((bestSellerRows ?? []) as { product_id: string }[]).map((r) => r.product_id)
  )
  const isBestSeller = (data as Product).featured_best_seller || bestSellerIds.has((data as Product).id)

  return <ProductDetailView product={data as Product} isBestSeller={isBestSeller} />
}
