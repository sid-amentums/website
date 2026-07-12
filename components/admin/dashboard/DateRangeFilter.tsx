import Link from 'next/link'

const RANGES = [
  { days: 7, label: '7 Days' },
  { days: 30, label: '30 Days' },
  { days: 90, label: '90 Days' },
  { days: 365, label: '1 Year' },
]

// Plain links, not a client component — switching range is a normal
// navigation (Next.js re-renders the Server Component page with the new
// searchParams), matching the interaction-guidance rule that a date-range
// filter is standard UI, not a chart mark, and scopes everything below it.
export default function DateRangeFilter({ activeDays }: { activeDays: number }) {
  return (
    <div className="mb-6 flex items-center gap-1.5">
      {RANGES.map((r) => (
        <Link
          key={r.days}
          href={`/admin?days=${r.days}`}
          className={`rounded-pill px-4 py-1.5 text-xs font-medium transition-colors ${
            activeDays === r.days ? 'bg-ink text-w' : 'text-mid hover:bg-off'
          }`}
        >
          {r.label}
        </Link>
      ))}
    </div>
  )
}
