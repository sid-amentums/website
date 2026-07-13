'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SEGMENT_LABELS, type Segment } from '@/lib/customers/segments'

export type CustomerRow = {
  id: string
  email: string
  name: string | null
  createdAt: string
  banned: boolean
  paidOrderCount: number
  totalSpentInr: number
  lastPaidOrderAt: string | null
  tags: string[]
  segments: Segment[]
}

type SortKey = 'recent_signup' | 'spend' | 'last_order'

const SEGMENT_PILL_CLASS: Record<Segment, string> = {
  vip: 'bg-[#c8a227] text-w',
  repeat: 'bg-ink text-w',
  at_risk: 'bg-red text-w',
  new: 'border border-border-2 text-mid',
}

function SegmentBadge({ segment }: { segment: Segment }) {
  return (
    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase ${SEGMENT_PILL_CLASS[segment]}`}>
      {SEGMENT_LABELS[segment]}
    </span>
  )
}

export default function CustomerDirectory({ customers }: { customers: CustomerRow[] }) {
  const [search, setSearch] = useState('')
  const [segmentFilter, setSegmentFilter] = useState<Segment | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('recent_signup')

  const allTags = useMemo(
    () => Array.from(new Set(customers.flatMap((c) => c.tags))).sort(),
    [customers]
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let rows = customers
    if (q) {
      rows = rows.filter((c) => c.email.toLowerCase().includes(q) || (c.name ?? '').toLowerCase().includes(q))
    }
    if (segmentFilter) {
      rows = rows.filter((c) => c.segments.includes(segmentFilter))
    }
    if (tagFilter) {
      rows = rows.filter((c) => c.tags.includes(tagFilter))
    }
    const sorted = [...rows]
    if (sortKey === 'spend') {
      sorted.sort((a, b) => b.totalSpentInr - a.totalSpentInr)
    } else if (sortKey === 'last_order') {
      sorted.sort((a, b) => (b.lastPaidOrderAt ?? '').localeCompare(a.lastPaidOrderAt ?? ''))
    } else {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    }
    return sorted
  }, [customers, search, segmentFilter, tagFilter, sortKey])

  if (customers.length === 0) {
    return <p className="text-sm text-mid">No registered customers yet.</p>
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or email…"
          className="w-64 rounded-lg border border-border-2 bg-off px-3 py-2 text-sm outline-none focus:border-ink focus:bg-w"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-lg border border-border-2 bg-off px-3 py-2 text-xs outline-none focus:border-ink focus:bg-w"
        >
          <option value="recent_signup">Sort: Newest signup</option>
          <option value="spend">Sort: Highest spend</option>
          <option value="last_order">Sort: Most recent order</option>
        </select>
        {allTags.length > 0 ? (
          <select
            value={tagFilter ?? ''}
            onChange={(e) => setTagFilter(e.target.value || null)}
            className="rounded-lg border border-border-2 bg-off px-3 py-2 text-xs outline-none focus:border-ink focus:bg-w"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(SEGMENT_LABELS) as Segment[]).map((s) => (
          <button
            key={s}
            onClick={() => setSegmentFilter((prev) => (prev === s ? null : s))}
            className={`rounded-pill border px-3 py-1 text-[11px] font-medium transition-colors ${
              segmentFilter === s ? 'border-ink bg-ink text-w' : 'border-border-2 text-mid hover:border-ink'
            }`}
          >
            {SEGMENT_LABELS[s]}
          </button>
        ))}
      </div>

      <p className="mb-2 text-[11px] text-dim">
        {filtered.length} of {customers.length} customer{customers.length === 1 ? '' : 's'}
      </p>

      {filtered.length === 0 ? (
        <p className="text-sm text-mid">No customers match these filters.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border-2 text-[11px] uppercase tracking-wide text-dim">
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Signed Up</th>
              <th className="px-3 py-2">Orders</th>
              <th className="px-3 py-2">Total Spent</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="px-3 py-3 align-top">
                  <div className="text-sm font-medium text-ink">{c.name ?? c.email}</div>
                  <div className="text-xs text-dim">{c.email}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {c.segments.map((s) => (
                      <SegmentBadge key={s} segment={s} />
                    ))}
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-md border border-border-2 px-1.5 py-0.5 text-[9px] text-mid">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 align-top text-xs text-mid">
                  {new Date(c.createdAt).toLocaleDateString('en-IN')}
                </td>
                <td className="px-3 py-3 align-top text-xs text-mid">{c.paidOrderCount}</td>
                <td className="px-3 py-3 align-top text-xs text-mid">₹{c.totalSpentInr.toLocaleString('en-IN')}</td>
                <td className="px-3 py-3 align-top">
                  <span className={`text-xs font-medium ${c.banned ? 'text-red' : 'text-[#1a6b3a]'}`}>
                    {c.banned ? 'Banned' : 'Active'}
                  </span>
                </td>
                <td className="px-3 py-3 align-top">
                  <Link href={`/admin/customers/${c.id}`} className="text-xs font-medium text-ink hover:text-red">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
