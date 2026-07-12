import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { productSchema } from '@/lib/validation/product'

// RLS's products_admin_write policy permits this via the caller's own
// session (is_admin() check) — no service_role needed, same as every other
// admin write route in this project.
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = productSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: inserted, error } = await supabase
    .from('products')
    .insert(parsed.data)
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Could not create product — slug/sku may already be in use' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, id: inserted.id })
}
