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

  // New products default to the end of the manual sort order (set via
  // drag-and-drop on the admin product list) rather than jumping to the
  // front, which sort_order's table-wide default of 0 would otherwise do.
  const { data: maxRow } = await supabase
    .from('products')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: inserted, error } = await supabase
    .from('products')
    .insert({ ...parsed.data, sort_order: (maxRow?.sort_order ?? 0) + 1 })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Could not create product — slug/sku may already be in use' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, id: inserted.id })
}
