import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createOrderSchema } from '@/lib/validation/checkout'
import { evaluateCoupon, type CouponRow } from '@/lib/validation/coupon'
import { getRazorpayClient, RazorpayNotConfiguredError } from '@/lib/razorpay/client'
import { isSaleActive, getEffectivePrice } from '@/lib/pricing/sale'
import type { CartItem, ProductVariant } from '@/lib/types'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 })
  }
  const input = parsed.data

  // Identify the caller via their own session (RLS-scoped client) — but all
  // subsequent reads/writes use the admin (service_role) client so pricing
  // computation and the order insert never depend on client-controlled RLS
  // paths.
  const supabaseAsUser = createClient()
  const {
    data: { user },
  } = await supabaseAsUser.auth.getUser()

  if (!user && !input.isGuestCheckout) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Re-fetch every product referenced and recompute pricing server-side —
  // client-submitted prices are never trusted.
  const productIds = Array.from(new Set(input.items.map((i) => i.product_id)))
  const { data: products } = await admin
    .from('products')
    .select('id, name, active, checkout_enabled, variants, sale_percent, sale_starts_at, sale_ends_at')
    .in('id', productIds)

  const orderItems: CartItem[] = []
  for (const line of input.items) {
    const product = products?.find((p) => p.id === line.product_id)
    if (!product || !product.active || !product.checkout_enabled) {
      return NextResponse.json(
        { error: `A product in your cart is no longer available. Please refresh your cart.` },
        { status: 400 }
      )
    }
    const variants = (product.variants ?? []) as ProductVariant[]
    const variant = variants.find((v) => v.id === line.variant_id && v.active)
    if (!variant) {
      return NextResponse.json(
        { error: `A selected variant is no longer available. Please refresh your cart.` },
        { status: 400 }
      )
    }
    const unitPrice = isSaleActive(product) ? getEffectivePrice(variant.price_inr, product.sale_percent) : variant.price_inr

    orderItems.push({
      product_id: product.id,
      variant_id: variant.id,
      name_snapshot: product.name,
      variant_label_snapshot: variant.label,
      unit_price_snapshot: unitPrice,
      quantity: line.quantity,
    })
  }

  const subtotalInr = orderItems.reduce((sum, i) => sum + i.unit_price_snapshot * i.quantity, 0)

  let discountInr = 0
  let couponCode: string | null = null
  if (input.couponCode) {
    const { data: coupon } = await admin
      .from('coupons')
      .select('*')
      .eq('code', input.couponCode.toUpperCase())
      .maybeSingle()

    const result = evaluateCoupon(coupon as CouponRow | null, orderItems)
    if (!result.valid) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }
    discountInr = result.discountInr
    couponCode = input.couponCode.toUpperCase()
  }

  const amountInr = Math.max(1, subtotalInr - discountInr)

  let razorpay: Awaited<ReturnType<typeof getRazorpayClient>>
  try {
    razorpay = await getRazorpayClient()
  } catch (err) {
    if (err instanceof RazorpayNotConfiguredError) {
      return NextResponse.json({ error: err.message }, { status: 503 })
    }
    throw err
  }

  const razorpayOrder = await razorpay.client.orders.create({
    amount: amountInr * 100,
    currency: 'INR',
    receipt: `amentum_${Date.now()}`,
    notes: { product_names: orderItems.map((i) => i.name_snapshot).join(', ') },
  })

  const isGuestOrder = !user
  const { data: insertedOrder, error: insertError } = await admin
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      is_guest_order: isGuestOrder,
      items: orderItems,
      subtotal_inr: subtotalInr,
      discount_inr: discountInr,
      amount_inr: amountInr,
      coupon_code: couponCode,
      razorpay_order_id: razorpayOrder.id,
      status: 'created',
      contact_name: input.contact.name,
      contact_phone: input.contact.phone,
      contact_email: input.contact.email,
      shipping_address: input.shippingAddress,
    })
    .select('id')
    .single()

  if (insertError || !insertedOrder) {
    return NextResponse.json({ error: 'Could not create order. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({
    razorpay_order_id: razorpayOrder.id,
    amount_inr: amountInr,
    key_id: razorpay.keyId,
    order_db_id: insertedOrder.id,
  })
}
