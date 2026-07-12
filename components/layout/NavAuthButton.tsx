'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthModalStore } from '@/lib/auth/authModalStore'

export default function NavAuthButton({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const open = useAuthModalStore((s) => s.open)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  if (isLoggedIn) {
    return (
      <button onClick={handleLogout} className="text-xs text-mid transition-colors hover:text-ink">
        Log Out
      </button>
    )
  }

  return (
    <button onClick={() => open('manual')} className="text-xs text-mid transition-colors hover:text-ink">
      Log In
    </button>
  )
}
