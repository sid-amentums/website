import { createClient } from '@/lib/supabase/server'
import CheckoutGuard from '@/components/checkout/CheckoutGuard'

export default async function CheckoutPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <CheckoutGuard isAuthenticated={!!user} />
}
