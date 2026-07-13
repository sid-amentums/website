import { createClient } from '@/lib/supabase/server'
import { getAppSettings } from '@/lib/settings/appSettings'
import LoginPrompt from '@/components/account/LoginPrompt'
import OrdersList from '@/components/account/OrdersList'
import type { Order } from '@/lib/types'

export const revalidate = 0

export default async function MyOrdersPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <LoginPrompt />
  }

  const [{ data }, { razorpay_key_id }] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    getAppSettings(),
  ])

  return <OrdersList orders={(data ?? []) as Order[]} razorpayKeyId={razorpay_key_id} />
}
