import { createAdminClient } from '@/lib/supabase/admin'

// Generic Vault reader for integration secrets outside the Razorpay
// critical path (see lib/razorpay/getKeySecret.ts, kept separate on
// purpose so this file's edits can never touch that one). Same contract:
// reads at call time via the service_role-only get_vault_secret RPC, never
// cached, never logged, never returned in a response.
export async function getVaultSecret(
  name: 'whatsapp_access_token' | 'mailchimp_api_key'
): Promise<string | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('get_vault_secret', { p_secret_name: name })
  if (error) return null
  return (data as string) ?? null
}
