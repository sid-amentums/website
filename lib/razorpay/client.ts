import Razorpay from 'razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
import { getVaultSecret } from '@/lib/razorpay/getKeySecret'

export class RazorpayNotConfiguredError extends Error {
  constructor() {
    super('Razorpay is not configured yet — set the key ID and secret in Admin → Settings.')
    this.name = 'RazorpayNotConfiguredError'
  }
}

// Instantiated per-request: key_id comes from the public app_settings table,
// key_secret is read from Vault at call time (never cached, never returned
// to any caller).
export async function getRazorpayClient(): Promise<{ client: Razorpay; keyId: string }> {
  const admin = createAdminClient()
  const { data: settings } = await admin
    .from('app_settings')
    .select('razorpay_key_id')
    .eq('id', 1)
    .single()

  const keySecret = await getVaultSecret('razorpay_key_secret')

  if (!settings?.razorpay_key_id || !keySecret) {
    throw new RazorpayNotConfiguredError()
  }

  return {
    client: new Razorpay({ key_id: settings.razorpay_key_id, key_secret: keySecret }),
    keyId: settings.razorpay_key_id,
  }
}
