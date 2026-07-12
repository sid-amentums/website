import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  secretName: z.enum([
    'razorpay_key_secret',
    'razorpay_webhook_secret',
    'whatsapp_access_token',
    'mailchimp_api_key',
  ]),
  secretValue: z.string().min(1),
})

// admin_set_vault_secret only grants EXECUTE to service_role (see
// 20260706120008_vault_rpc.sql) — this route is the only path to it, gated
// by requireAdmin(). The response is always {ok:true}; the secret value is
// never read back or echoed anywhere.
export async function POST(request: Request) {
  const adminUser = await requireAdmin()
  if (!adminUser) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin.rpc('admin_set_vault_secret', {
    p_secret_name: parsed.data.secretName,
    p_secret_value: parsed.data.secretValue,
  })

  if (error) {
    return NextResponse.json({ error: 'Could not save secret' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
