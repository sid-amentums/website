// Single branded loading motif reused across every loading.tsx boundary —
// a waving Indian tricolor. Deliberately simple: one continuous 3D
// perspective rotate+skew loop (flag-wave, tailwind.config.ts) on the whole
// flag, pivoting from the pole (origin-left) — the standard, reliable CSS
// "flag flutter" technique. No multi-part rigging, so there's nothing that
// can drift out of sync or look "off" the way a hand-animated figure can.
const SPOKE_ANGLES = Array.from({ length: 24 }, (_, i) => (i * 360) / 24)
const CHAKRA_CENTER = { x: 160, y: 100 }
const CHAKRA_OUTER_R = 22
const CHAKRA_INNER_R = 5

function polarPoint(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export default function LoadingFlag({
  label = 'Loading',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <svg viewBox="0 0 320 220" className="h-16 w-24">
        <rect x="14" y="4" width="6" height="212" rx="3" fill="#0a0a0a" />

        <g className="origin-left animate-flag-wave">
          <rect x="20" y="10" width="280" height="60" fill="#FF9933" />
          <rect x="20" y="70" width="280" height="60" fill="#FFFFFF" />
          <rect x="20" y="130" width="280" height="60" fill="#138808" />
          <rect x="20" y="10" width="280" height="180" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

          <g stroke="#000080" fill="none">
            <circle cx={CHAKRA_CENTER.x} cy={CHAKRA_CENTER.y} r={CHAKRA_OUTER_R} strokeWidth="2" />
            {SPOKE_ANGLES.map((deg) => {
              const inner = polarPoint(CHAKRA_CENTER.x, CHAKRA_CENTER.y, CHAKRA_INNER_R, deg)
              const outer = polarPoint(CHAKRA_CENTER.x, CHAKRA_CENTER.y, CHAKRA_OUTER_R, deg)
              return <line key={deg} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} strokeWidth="1.5" />
            })}
          </g>
          <circle cx={CHAKRA_CENTER.x} cy={CHAKRA_CENTER.y} r={CHAKRA_INNER_R} fill="#000080" />
        </g>
      </svg>
      <p className="text-xs font-medium uppercase tracking-wide text-dim">
        {label}
        <span aria-hidden className="animate-pulse">
          …
        </span>
        <span className="sr-only">Loading, please wait.</span>
      </p>
    </div>
  )
}
