'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TagEditor({ userId, initialTags }: { userId: string; initialTags: string[] }) {
  const router = useRouter()
  const [tags, setTags] = useState(initialTags)
  const [input, setInput] = useState('')
  const [saving, setSaving] = useState(false)

  async function save(next: string[]) {
    setTags(next)
    setSaving(true)
    await fetch(`/api/admin/customers/${userId}/tags`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: next }),
    })
    setSaving(false)
    router.refresh()
  }

  function addTag(e: React.FormEvent) {
    e.preventDefault()
    const value = input.trim()
    if (!value || tags.includes(value) || tags.length >= 10) {
      setInput('')
      return
    }
    setInput('')
    save([...tags, value])
  }

  function removeTag(tag: string) {
    save(tags.filter((t) => t !== tag))
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className="flex items-center gap-1 rounded-md border border-border-2 bg-off px-2 py-1 text-[11px] text-ink"
          >
            {t}
            <button onClick={() => removeTag(t)} className="text-dim hover:text-red" aria-label={`Remove ${t}`}>
              ✕
            </button>
          </span>
        ))}
        {tags.length === 0 ? <span className="text-xs text-dim">No tags yet.</span> : null}
      </div>
      <form onSubmit={addTag} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a tag (e.g. VIP, Wholesale)…"
          disabled={tags.length >= 10}
          className="w-48 rounded-lg border border-border-2 bg-off px-3 py-1.5 text-xs outline-none focus:border-ink focus:bg-w disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={saving || tags.length >= 10}
          className="rounded-pill border border-border-2 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  )
}
