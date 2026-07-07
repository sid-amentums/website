import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  awb_number: z.string().trim().max(60).nullable().optional(),
  shipping_status: z.enum(['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered']).optional(),
})

// Deliberately accepts ONLY awb_number/shipping_status — never status,
// razorpay_*, or amount fields, even though the schema below would reject
// them anyway. Defense in depth: RLS's orders_update_shipping_admin_only
// policy plus a column-level GRANT on just these two columns
// (20260706130001) means Postgres itself would reject an attempt to touch
// payment-critical columns via this session, independent of this route.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('orders')
    .update(parsed.data)
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Could not update order' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
