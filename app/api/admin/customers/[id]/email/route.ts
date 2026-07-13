import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendCustomerEmail } from '@/lib/resend/sendCustomerEmail'
import { emailSchema } from '@/lib/validation/customer'

// Recipient is always resolved server-side from the path id via the Admin
// Auth API — never trusts a client-supplied address, same discipline as
// every payment/pricing route in this project.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const parsed = emailSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 })
  }

  const supabaseAdmin = createAdminClient()
  const { data: userRes, error: userError } = await supabaseAdmin.auth.admin.getUserById(params.id)
  if (userError || !userRes.user?.email) {
    return NextResponse.json({ error: 'Could not find this customer’s email address' }, { status: 404 })
  }

  const result = await sendCustomerEmail(userRes.user.email, parsed.data.subject, parsed.data.body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 })
  }

  const supabase = createClient()
  const { data: inserted, error } = await supabase
    .from('customer_activity')
    .insert({
      user_id: params.id,
      admin_email: admin.email,
      type: 'email_sent',
      subject: parsed.data.subject,
      body: parsed.data.body,
    })
    .select('id, user_id, admin_email, type, subject, body, created_at')
    .single()

  if (error || !inserted) {
    // The email genuinely sent — don't report failure, just skip the log entry.
    return NextResponse.json({ ok: true, activity: null })
  }
  return NextResponse.json({ ok: true, activity: inserted })
}
