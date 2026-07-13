'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export type ActivityRow = {
  id: string
  admin_email: string
  type: 'note' | 'email_sent'
  subject: string | null
  body: string
  created_at: string
}

export default function ActivityTimeline({ userId, activity }: { userId: string; activity: ActivityRow[] }) {
  const router = useRouter()
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch(`/api/admin/customers/${userId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: note }),
    })

    setSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setError(data?.error ?? 'Could not save this note.')
      return
    }
    setNote('')
    router.refresh()
  }

  return (
    <div>
      <form onSubmit={handleAddNote} className="mb-4 space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add an internal note about this customer…"
          required
          rows={2}
          className="w-full rounded-lg border border-border-2 bg-off px-3 py-2 text-sm outline-none focus:border-ink focus:bg-w"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-pill border border-border-2 px-4 py-1.5 text-xs font-medium text-ink hover:border-ink disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Add Note'}
          </button>
          {error ? <span className="text-xs text-red">{error}</span> : null}
        </div>
      </form>

      {activity.length === 0 ? (
        <p className="text-sm text-mid">No notes or emails yet — this is where the relationship history builds up.</p>
      ) : (
        <div className="space-y-3">
          {activity.map((a) => (
            <div key={a.id} className="rounded-lg border border-border-2 p-3">
              <div className="mb-1 flex items-center justify-between text-[11px] text-dim">
                <span className="font-medium uppercase tracking-wide">
                  {a.type === 'email_sent' ? '✉ Email Sent' : '📝 Note'}
                </span>
                <span>
                  {a.admin_email} · {new Date(a.created_at).toLocaleString('en-IN')}
                </span>
              </div>
              {a.subject ? <p className="mb-1 text-sm font-medium text-ink">{a.subject}</p> : null}
              <p className="whitespace-pre-wrap text-sm text-mid">{a.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
