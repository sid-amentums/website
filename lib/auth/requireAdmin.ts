import { createClient } from '@/lib/supabase/server'

export type AdminUser = { id: string; email: string; role: string }

// Server-only. Checks the caller's session against admin_users (role-gated
// Supabase Auth users, fully independent from customer auth — a customer
// account simply never gets a row here). Returns null if not an active admin.
export async function requireAdmin(): Promise<AdminUser | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: adminRow } = await supabase
    .from('admin_users')
    .select('id, email, role, active')
    .eq('id', user.id)
    .eq('active', true)
    .maybeSingle()

  if (!adminRow) return null

  return { id: adminRow.id, email: adminRow.email, role: adminRow.role }
}
