'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthModalStore } from '@/lib/auth/authModalStore'

export default function SignupForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const markAttempted = useAuthModalStore((s) => s.markAttempted)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)
    markAttempted()

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data.user && !data.session) {
      // Email confirmation is required by this project's Supabase Auth
      // settings — no session yet, so AuthListener won't fire.
      setInfo('Check your email to confirm your account, then log in.')
      return
    }
    // Session created immediately: AuthListener's onAuthStateChange picks up
    // SIGNED_IN, merges the guest cart, and closes the modal.
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-dim">
          Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2.5 text-sm outline-none focus:border-ink focus:bg-w"
        />
      </div>
      {error ? <p className="text-xs text-red">{error}</p> : null}
      {info ? <p className="text-xs text-mid">{info}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-pill bg-ink py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Sign Up'}
      </button>
    </form>
  )
}
