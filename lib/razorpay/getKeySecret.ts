import { createAdminClient } from '@/lib/supabase/admin'

// Reads a Razorpay secret from Supabase Vault at call time, via the
// service_role-only get_vault_secret RPC. Never cache this value beyond a
// single request's local variables — never log it, never return it in a
// response.
export async function getVaultSecret(
  name: 'razorpay_key_secret' | 'razorpay_webhook_secret'
): Promise<string | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('get_vault_secret', { p_secret_name: name })
  if (error) return null
  return (data as string) ?? null
}
