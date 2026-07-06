'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthModalStore } from '@/lib/auth/authModalStore'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const markAttempted = useAuthModalStore((s) => s.markAttempted)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    markAttempted()

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // Success: AuthListener's onAuthStateChange picks up SIGNED_IN, merges
    // the guest cart, and closes the modal.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      {error ? <p className="text-xs text-red">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-ink py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Log In'}
      </button>
    </form>
  )
}
