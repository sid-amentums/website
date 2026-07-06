import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { createClient } from '@/lib/supabase/server'
import AdminNav from '@/components/admin/AdminNav'
import SettingsForm from '@/components/admin/SettingsForm'

export default async function AdminSettingsPage() {
  const admin = await requireAdmin()
  if (!admin) redirect('/admin/login')

  const supabase = createClient()
  const { data: settings } = await supabase
    .from('app_settings')
    .select('razorpay_key_id, ga_measurement_id')
    .eq('id', 1)
    .single()

  return (
    <div>
      <AdminNav />
      <div className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-6 font-serif text-2xl text-ink">Settings</h1>
        <SettingsForm
          initialKeyId={settings?.razorpay_key_id ?? ''}
          initialGaId={settings?.ga_measurement_id ?? ''}
        />
      </div>
    </div>
  )
}
