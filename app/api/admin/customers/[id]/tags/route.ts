import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { tagsSchema } from '@/lib/validation/customer'

// RLS's customer_profiles_admin_only policy permits this via the caller's
// own session (is_admin() check) — no service_role needed, same as every
// other admin write route in this project.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = tagsSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('customer_profiles')
    .upsert({ user_id: params.id, tags: parsed.data.tags, updated_at: new Date().toISOString() })

  if (error) {
    return NextResponse.json({ error: 'Could not save tags' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
