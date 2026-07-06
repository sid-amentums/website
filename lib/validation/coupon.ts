import { z } from 'zod'

export const couponValidateSchema = z.object({
  code: z.string().min(1).max(40),
  subtotalInr: z.number().nonnegative(),
})

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
}

export type CouponCheckResult =
  | { valid: true; discountInr: number; label: string }
  | { valid: false; message: string }

// Shared by the read-only preview route (app/api/coupon/validate) and the
// real order-create route — both must reject the same set of conditions so
// the preview never promises a discount the order-create route won't honor.
export function evaluateCoupon(coupon: CouponRow | null, subtotalInr: number): CouponCheckResult {
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
  if (coupon.min_order_amount && subtotalInr < coupon.min_order_amount) {
    return {
      valid: false,
      message: `Minimum order amount for this coupon is ₹${coupon.min_order_amount.toLocaleString('en-IN')}.`,
    }
  }

  const discountInr =
    coupon.type === 'percent'
      ? Math.round((subtotalInr * coupon.value) / 100)
      : Math.min(coupon.value, subtotalInr)

  const label =
    coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value.toLocaleString('en-IN')} off`

  return { valid: true, discountInr, label }
}
