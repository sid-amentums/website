import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { couponValidateSchema, evaluateCoupon, type CouponRow } from '@/lib/validation/coupon'

// Read-only preview only — shows the customer "coupon applied" feedback.
// The real, authoritative discount is always recomputed server-side again
// inside app/api/razorpay/create-order/route.ts using this same
// evaluateCoupon() function, so a client can never trust this response for
// the actual charge amount.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = couponValidateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ valid: false, message: 'Invalid request.' }, { status: 400 })
  }

  const supabase = createClient()
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', parsed.data.code.toUpperCase())
    .maybeSingle()

  const result = evaluateCoupon(data as CouponRow | null, parsed.data.items)
  return NextResponse.json(result)
}
