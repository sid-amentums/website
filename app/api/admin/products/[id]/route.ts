import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const variantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  weight_grams: z.number().nullable(),
  range_meters: z.number().nullable(),
  price_inr: z.number().positive(),
  active: z.boolean(),
})

const schema = z.object({
  active: z.boolean().optional(),
  variants: z.array(variantSchema).optional(),
})

// RLS's products_admin_write policy permits this via the caller's own
// session (is_admin() check) — no service_role needed.
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
    .from('products')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Could not update product' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
