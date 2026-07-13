type SaleFields = {
  sale_percent: number | null
  sale_starts_at: string | null
  sale_ends_at: string | null
}

export function isSaleActive(product: SaleFields, now = new Date()): boolean {
  if (!product.sale_percent || !product.sale_starts_at || !product.sale_ends_at) return false
  return now >= new Date(product.sale_starts_at) && now <= new Date(product.sale_ends_at)
}

export function getEffectivePrice(priceInr: number, salePercent: number | null): number {
  if (!salePercent) return priceInr
  return Math.round((priceInr * (100 - salePercent)) / 100)
}
