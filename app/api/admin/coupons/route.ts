import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { couponAdminSchema } from '@/lib/validation/coupon'

// RLS's coupons_admin_write policy permits this via the caller's own session
// (is_admin() check) — no service_role needed.
export async function GET() {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const supabase = createClient()
  const { data, error } = await supabase.from('coupons').select('*').order('code', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Could not load coupons' }, { status: 500 })
  }
  return NextResponse.json({ coupons: data })
}

// Upserts by `code` (the primary key) — sufficient for both create and edit
// since CouponForm always sends every column. Edits render `code` read-only
// client-side: changing it here would upsert a *new* row and orphan the
// original rather than renaming it.
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = couponAdminSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
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
