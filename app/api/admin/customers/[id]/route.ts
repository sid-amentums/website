import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'

const banSchema = z.object({
  action: z.enum(['ban', 'unban']),
})

// Reversible account suspension via Supabase's built-in ban_duration — no
// data loss, matches this project's deactivate-don't-delete precedent
// already used for products and coupons. '876000h' (~100 years) is
// Supabase's own convention for "banned until explicitly unbanned".
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = banSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const supabaseAdmin = createAdminClient()

  // Defense in depth: never allow banning an admin account, even if this
  // route is reached directly rather than through the customers list
  // (which already excludes admins) — banning the only admin would lock
  // everyone out of the panel.
  const { data: adminRow } = await supabaseAdmin.from('admin_users').select('id').eq('id', params.id).maybeSingle()
  if (adminRow) {
    return NextResponse.json({ error: 'Cannot ban an admin account' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(params.id, {
    ban_duration: parsed.data.action === 'ban' ? '876000h' : 'none',
  })

  if (error) {
    return NextResponse.json({ error: 'Could not update customer' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
