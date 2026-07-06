import type { Product } from '@/lib/types'
import ProductCard from '@/components/shop/ProductCard'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-mid">
        <p className="text-sm">No products available right now — check back soon.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-px bg-off3 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
