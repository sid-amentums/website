'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EmailComposer({ userId, customerEmail }: { userId: string; customerEmail: string }) {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError(null)
    setSent(false)

    const res = await fetch(`/api/admin/customers/${userId}/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, body }),
    })

    setSending(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not send this email.')
      return
    }
    setSubject('')
    setBody('')
    setSent(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSend} className="space-y-2">
      <p className="text-[11px] text-dim">To: {customerEmail}</p>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
        required
        className="w-full rounded-lg border border-border-2 bg-off px-3 py-2 text-sm outline-none focus:border-ink focus:bg-w"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a message…"
        required
        rows={4}
        className="w-full rounded-lg border border-border-2 bg-off px-3 py-2 text-sm outline-none focus:border-ink focus:bg-w"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-pill bg-ink px-5 py-2 text-xs font-medium text-w transition-colors hover:bg-red disabled:opacity-50"
        >
          {sending ? 'Sending…' : 'Send Email'}
        </button>
        {sent ? <span className="text-xs text-[#1a6b3a]">Sent.</span> : null}
        {error ? <span className="text-xs text-red">{error}</span> : null}
      </div>
    </form>
  )
}
