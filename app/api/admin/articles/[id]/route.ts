import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { articleSchema } from '@/lib/validation/article'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
  const supabase = createClient()

  // Only stamp published_at automatically the first time an article goes
  // live — re-saving an already-published article shouldn't reset its date.
  let published_at = data.published_at ?? null
  if (data.status === 'published' && !published_at) {
    const { data: existing } = await supabase
      .from('articles')
      .select('published_at')
      .eq('id', params.id)
      .maybeSingle()
    published_at = existing?.published_at ?? new Date().toISOString()
  }

  const { error } = await supabase
    .from('articles')
    .update({ ...data, published_at, updated_at: new Date().toISOString() })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: 'Could not update article' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
