import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { articleSchema } from '@/lib/validation/article'

// RLS's articles_admin_write policy permits this via the caller's own
// session (is_admin() check) — no service_role needed.
export async function POST(request: Request) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = articleSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const data = parsed.data
  const published_at = data.status === 'published' ? (data.published_at ?? new Date().toISOString()) : data.published_at ?? null

  const supabase = createClient()
  const { data: inserted, error } = await supabase
    .from('articles')
    .insert({ ...data, published_at })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Could not create article — slug may already be in use' }, { status: 500 })
  }
  return NextResponse.json({ ok: true, id: inserted.id })
}
