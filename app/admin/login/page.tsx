'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setLoading(false)
      setError(authError?.message ?? 'Login failed')
      return
    }

    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', data.user.id)
      .eq('active', true)
      .maybeSingle()

    if (!adminRow) {
      await supabase.auth.signOut()
      setLoading(false)
      setError('This account is not an admin.')
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-w p-8">
        <h1 className="mb-1 font-serif text-2xl text-ink">Admin Login</h1>
        <p className="mb-6 text-xs text-mid">Amentum Sports administration</p>

        <div className="mb-3">
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
        <div className="mb-4">
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
        {error ? <p className="mb-3 text-xs text-red">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-pill bg-ink py-3 text-sm font-medium text-w transition-colors hover:bg-red disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Log In'}
        </button>
      </form>
    </div>
  )
}
