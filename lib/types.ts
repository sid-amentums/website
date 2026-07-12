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

export type ShippingAddressRecord = {
  line1: string
  city: string
  state: string
  pincode: string
  country: string
}

export type OrderStatus = 'created' | 'paid' | 'failed' | 'refunded' | 'cancelled'

export type ShippingStatus = 'pending' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'

export type ArticleStatus = 'draft' | 'published'

export type Article = {
  id: string
  slug: string
  title: string
  category: string
  author: string
  summary: string | null
  read_time: string | null
  body: string
  status: ArticleStatus
  published_at: string | null
  created_at: string
}

export type Coupon = {
  code: string
  type: 'percent' | 'flat'
  value: number
  description: string | null
  active: boolean
  usage_count: number
  max_uses: number | null
  min_order_amount: number | null
  starts_at: string | null
  expires_at: string | null
  created_at: string
}

export type Order = {
  id: string
  user_id: string | null
  is_guest_order: boolean
  items: CartItem[]
  subtotal_inr: number
  discount_inr: number
  amount_inr: number
  coupon_code: string | null
  status: OrderStatus
  contact_name: string
  contact_phone: string
  contact_email: string
  shipping_address: ShippingAddressRecord
  awb_number: string | null
  shipping_status: ShippingStatus
  paid_at: string | null
  created_at: string
}
