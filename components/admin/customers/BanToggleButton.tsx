'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BanToggleButton({ userId, initialBanned }: { userId: string; initialBanned: boolean }) {
  const router = useRouter()
  const [banned, setBanned] = useState(initialBanned)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    const next = !banned
    setSaving(true)
    const res = await fetch(`/api/admin/customers/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: next ? 'ban' : 'unban' }),
    })
    setSaving(false)
    if (res.ok) {
      setBanned(next)
      router.refresh()
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      className={`rounded-pill border px-4 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        banned ? 'border-border-2 text-ink hover:border-ink' : 'border-red-bdr text-red hover:border-red'
      }`}
    >
      {saving ? '…' : banned ? 'Unban Customer' : 'Ban Customer'}
    </button>
  )
}
