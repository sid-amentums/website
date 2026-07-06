export type ProductVariant = {
  id: string
  label: string
  weight_grams: number | null
  range_meters: number | null
  price_inr: number
  active: boolean
}

export type ProductImage = {
  url: string
  alt: string
  is_primary: boolean
  sort_order: number
}

export type Product = {
  id: string
  slug: string
  name: string
  sku: string
  category: string
  short_desc: string | null
  long_desc: string | null
  level: string | null
  flex: string | null
  wa_certified: boolean
  variants: ProductVariant[]
  images: ProductImage[]
  active: boolean
  stock: number
  checkout_enabled: boolean
  whatsapp_message_template: string | null
}

export type CartItem = {
  product_id: string
  variant_id: string
  name_snapshot: string
  variant_label_snapshot: string
  unit_price_snapshot: number
  quantity: number
}
