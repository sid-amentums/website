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

  // Sale fields must be set or cleared together — a percent with no date
  // range (or vice versa) would make isSaleActive()'s active/inactive
  // reading ambiguous everywhere it's checked (checkout, shop, admin table).
  const { sale_percent, sale_starts_at, sale_ends_at } = parsed.data
  const saleFieldsTouched = [sale_percent, sale_starts_at, sale_ends_at].some((f) => f !== undefined)
  if (saleFieldsTouched) {
    const allPresent = sale_percent != null && sale_starts_at != null && sale_ends_at != null
    const allAbsent = sale_percent == null && sale_starts_at == null && sale_ends_at == null
    if (!allPresent && !allAbsent) {
      return NextResponse.json(
        { error: 'Set a discount % and both dates to start a sale, or clear all three to end it.' },
        { status: 400 }
      )
    }
    if (allPresent && new Date(sale_ends_at as string) <= new Date(sale_starts_at as string)) {
      return NextResponse.json({ error: 'Sale end date must be after the start date.' }, { status: 400 })
    }
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
