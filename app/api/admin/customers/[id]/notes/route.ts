import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { noteSchema } from '@/lib/validation/customer'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = noteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: inserted, error } = await supabase
    .from('customer_activity')
    .insert({ user_id: params.id, admin_email: admin.email, type: 'note', body: parsed.data.body })
    .select('id, user_id, admin_email, type, subject, body, created_at')
    .single()

  if (error || !inserted) {
    return NextResponse.json({ error: 'Could not save note' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, activity: inserted })
}
