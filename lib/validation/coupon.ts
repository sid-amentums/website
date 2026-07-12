import { z } from 'zod'

export const couponValidateSchema = z.object({
  code: z.string().min(1).max(40),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        unit_price_snapshot: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
})

// Every column the admin form can write. No .default() on any field — the
// admin POST route upserts by `code`, so a value silently defaulting on an
// omitted key would corrupt an edit the same way it did for products
// (see lib/validation/product.ts). CouponForm always sends every field.
export const couponAdminSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, 'Code must be letters, numbers, hyphens, or underscores only'),
  type: z.enum(['percent', 'flat']),
  value: z.number().positive(),
  description: z.string().trim().max(300).nullable(),
  active: z.boolean(),
  max_uses: z.number().int().positive().nullable(),
  min_order_amount: z.number().nonnegative().nullable(),
  starts_at: z.string().datetime().nullable(),
  expires_at: z.string().datetime().nullable(),
  eligible_product_ids: z.array(z.string().uuid()).nullable(),
})

export type CouponAdminInput = z.infer<typeof couponAdminSchema>

export type CouponRow = {
  code: string
  type: 'percent' | 'flat'
  value: number
  active: boolean
  usage_count: number
  max_uses: number | null
  min_order_amount: number | null
  starts_at: string | null
  expires_at: string | null
  eligible_product_ids: string[] | null
}

export type CouponEligibleItem = {
  product_id: string
  unit_price_snapshot: number
  quantity: number
}

export type CouponCheckResult =
  | { valid: true; discountInr: number; label: string }
  | { valid: false; message: string }

// Shared by the read-only preview route (app/api/coupon/validate) and the
// real order-create route — both must reject the same set of conditions so
// the preview never promises a discount the order-create route won't honor.
// Takes cart items (not a pre-summed subtotal) so a coupon restricted to
// specific products can compute its discount from only the eligible line
// items, not the whole cart.
export function evaluateCoupon(coupon: CouponRow | null, items: CouponEligibleItem[]): CouponCheckResult {
  if (!coupon || !coupon.active) {
    return { valid: false, message: 'Invalid or inactive coupon code.' }
  }

  const now = new Date()
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { valid: false, message: 'This coupon is not active yet.' }
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return { valid: false, message: 'This coupon has expired.' }
  }
  if (coupon.max_uses !== null && coupon.usage_count >= coupon.max_uses) {
    return { valid: false, message: 'This coupon has reached its usage limit.' }
  }

  const restricted = Boolean(coupon.eligible_product_ids && coupon.eligible_product_ids.length > 0)
  const eligibleItems = restricted
    ? items.filter((i) => coupon.eligible_product_ids!.includes(i.product_id))
    : items

  if (restricted && eligibleItems.length === 0) {
    return { valid: false, message: 'This coupon does not apply to any items in your cart.' }
  }

  const eligibleSubtotalInr = eligibleItems.reduce((sum, i) => sum + i.unit_price_snapshot * i.quantity, 0)

  if (coupon.min_order_amount && eligibleSubtotalInr < coupon.min_order_amount) {
    return {
      valid: false,
      message: `Minimum order amount for this coupon is ₹${coupon.min_order_amount.toLocaleString('en-IN')}.`,
    }
  }

  const discountInr =
    coupon.type === 'percent'
      ? Math.round((eligibleSubtotalInr * coupon.value) / 100)
      : Math.min(coupon.value, eligibleSubtotalInr)

  const label =
    coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value.toLocaleString('en-IN')} off`

  return { valid: true, discountInr, label }
}
