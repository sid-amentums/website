import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { orderTrackSchema } from '@/lib/validation/orderTracking'

const NOT_FOUND_MESSAGE = 'No matching order found. Check your Order ID and phone number.'

// Public, unauthenticated lookup for guest customers who have no account to
// see order history through. RLS has no anon SELECT policy on orders by
// design (orders_select_own is auth.uid()-scoped) — this route is the
// deliberate, narrow bypass, same justification as
// app/checkout/success/page.tsx. Requires the order id (an unguessable
// UUID, the primary secret) AND the phone number used at checkout, and
// always returns the same generic error on any mismatch — never reveals
// which field was wrong.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = orderTrackSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 })
  }

  const admin = createAdminClient()
  const [{ data: order }, { data: settings }] = await Promise.all([
    admin
      .from('orders')
      .select(
        'id, status, amount_inr, items, created_at, shipping_status, awb_number, razorpay_order_id, contact_name, contact_phone, contact_email'
      )
      .eq('id', parsed.data.orderId)
      .eq('contact_phone', parsed.data.phone)
      .maybeSingle(),
    admin.from('app_settings').select('razorpay_key_id').eq('id', 1).single(),
  ])

  if (!order) {
    return NextResponse.json({ error: NOT_FOUND_MESSAGE }, { status: 404 })
  }

  return NextResponse.json({ order, razorpayKeyId: settings?.razorpay_key_id ?? null })
}
