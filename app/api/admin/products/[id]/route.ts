import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { productPatchSchema } from '@/lib/validation/product'

// RLS's products_admin_write policy permits this via the caller's own
// session (is_admin() check) — no service_role needed. productPatchSchema
// makes every field optional, so existing {active}-only or {variants}-only
// callers (the simplified admin product list) keep working unchanged
// alongside full-field edits from the product edit form.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = productPatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Could not update product — slug/sku may already be in use' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
