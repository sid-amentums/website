import { createClient } from '@/lib/supabase/server'

export type AppSettings = {
  razorpay_key_id: string | null
  ga_measurement_id: string | null
  meta_pixel_id: string | null
}

// Public-safe settings only (razorpay key_id, GA id, pixel id) — reads
// through the anon-key RLS policy (app_settings_select_all), no
// service_role needed.
export async function getAppSettings(): Promise<AppSettings> {
  const supabase = createClient()
  const { data } = await supabase
    .from('app_settings')
    .select('razorpay_key_id, ga_measurement_id, meta_pixel_id')
    .eq('id', 1)
    .single()

  return data ?? { razorpay_key_id: null, ga_measurement_id: null, meta_pixel_id: null }
}
