import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  code: z.string().min(1).max(40),
  type: z.enum(['percent', 'flat']),
  value: z.number().positive(),
  active: z.boolean().default(true),
  max_uses: z.number().int().positive().nullable().optional(),
  min_order_amount: z.number().nonnegative().optional(),
})

// RLS's coupons_admin_write policy permits this via the caller's own session
// (is_admin() check) — no service_role needed.
export async function POST(request: Request) {
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
    .from('coupons')
    .upsert({ ...parsed.data, code: parsed.data.code.toUpperCase() })

  if (error) {
    return NextResponse.json({ error: 'Could not save coupon' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
