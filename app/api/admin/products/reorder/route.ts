import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const reorderSchema = z.object({
  orderedIds: z.array(z.string().uuid()).min(1),
})

// RLS's products_admin_write policy permits this via the caller's own
// session (is_admin() check) — no service_role needed, same as every other
// admin write route for products. Assigns sort_order = array index for
// every id in the submitted order; drag-and-drop in ProductTable.tsx
// resubmits the FULL current list on every drop, so this always sets a
// complete, gap-free order rather than patching a range.
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = reorderSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const results = await Promise.all(
    parsed.data.orderedIds.map((id, index) =>
      supabase.from('products').update({ sort_order: index }).eq('id', id)
    )
  )

  if (results.some((r) => r.error)) {
    return NextResponse.json({ error: 'Could not save the new order' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
