import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  razorpay_key_id: z.string().min(1).optional(),
  ga_measurement_id: z.string().optional(),
  meta_pixel_id: z.string().optional(),
  whatsapp_phone_number_id: z.string().optional(),
  whatsapp_business_account_id: z.string().optional(),
  whatsapp_template_name: z.string().optional(),
  mailchimp_audience_id: z.string().optional(),
})

// RLS's app_settings_update_admin_only policy already permits this via the
// caller's own session (is_admin() check) — no service_role needed here.
export async function POST(request: Request) {
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
    .from('app_settings')
    .update({ ...parsed.data, updated_at: new Date().toISOString(), updated_by: admin.id })
    .eq('id', 1)

  if (error) {
    return NextResponse.json({ error: 'Could not save settings' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
