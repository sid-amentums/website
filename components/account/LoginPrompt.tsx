'use client'

import { useAuthModalStore } from '@/lib/auth/authModalStore'

export default function LoginPrompt() {
  const open = useAuthModalStore((s) => s.open)

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-sm text-mid">Log in to view your order history.</p>
      <button
        onClick={() => open('manual')}
        className="rounded-pill bg-ink px-7 py-3 text-sm font-medium text-w transition-colors hover:bg-red"
      >
        Log In
      </button>
    </div>
  )
}
