// Single branded loading motif reused across every loading.tsx boundary — a
// pictogram athlete mid javelin-throw, looping (wind-up → plant → release →
// follow-through → reset). Built as a small rig of SVG <g> groups, each
// rotating around its own shoulder/hip transform-origin via the
// athlete-* keyframes in tailwind.config.ts, all sharing one 2.4s timeline
// so the limbs stay in sync. The javelin is a separate top-level element
// (not nested in the throwing arm) — appearing only for the release/flight
// portion of the cycle keeps the rig simple: no coordinate math is needed
// to track the hand through the wind-up.
export default function JavelinLoader({
  label = 'Loading',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
      <svg viewBox="0 0 220 200" className="h-64 w-72 md:h-80 md:w-[26rem]">
        <line x1="30" y1="165" x2="190" y2="165" stroke="currentColor" strokeWidth="2" className="text-border-2" />

        <g className="origin-[98px_118px] animate-athlete-back-leg">
          <line x1="98" y1="118" x2="112" y2="160" stroke="#0a0a0a" strokeWidth="9" strokeLinecap="round" />
        </g>
        <g className="origin-[98px_118px] animate-athlete-front-leg">
          <line x1="98" y1="118" x2="88" y2="160" stroke="#0a0a0a" strokeWidth="9" strokeLinecap="round" />
        </g>

        <g className="origin-[98px_118px] animate-athlete-torso">
          <line x1="114" y1="60" x2="98" y2="118" stroke="#0a0a0a" strokeWidth="10" strokeLinecap="round" />
          <circle cx="118" cy="45" r="12" fill="#0a0a0a" />

          <g className="origin-[114px_60px] animate-athlete-lead-arm">
            <line x1="114" y1="60" x2="126" y2="90" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
          </g>
          <g className="origin-[114px_60px] animate-athlete-throw-arm">
            <line x1="114" y1="60" x2="104" y2="95" stroke="#0a0a0a" strokeWidth="7" strokeLinecap="round" />
          </g>
        </g>

        <g className="animate-athlete-javelin">
          <line x1="150" y1="40" x2="180" y2="25" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
          <polygon points="180,25 194,19 183,32" fill="#c8171a" />
          <polygon points="150,40 141,36 148,46" fill="#0a0a0a" opacity="0.55" />
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
