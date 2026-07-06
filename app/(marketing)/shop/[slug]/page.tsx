import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetailView from '@/components/shop/ProductDetailView'
import type { Product } from '@/lib/types'

export const revalidate = 0

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle()

  if (!data) notFound()

  return <ProductDetailView product={data as Product} />
}
