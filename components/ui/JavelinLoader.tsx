// Single branded loading motif reused across every loading.tsx boundary —
// a javelin mid-throw, looping. Two separate elements carry the transform:
// the outer wrapper centers the icon (translate -50%/-50%), the inner <svg>
// carries the animate-javelin-fly keyframe — both set `transform`, so they
// must live on different elements or the animation would clobber the static
// centering offset.
export default function JavelinLoader({
  label = 'Loading',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-5 ${className}`}>
      <div className="relative h-20 w-40 overflow-hidden">
        <div className="absolute bottom-6 left-1/2 h-px w-24 -translate-x-1/2 bg-border-2" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 100 40" className="h-10 w-24 animate-javelin-fly">
            <line x1="10" y1="30" x2="82" y2="10" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" />
            <polygon points="82,10 96,4 85,17" fill="#c8171a" />
            <polygon points="10,30 1,26 8,36" fill="#0a0a0a" opacity="0.55" />
          </svg>
        </div>
      </div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-dim">
        {label}
        <span aria-hidden className="animate-pulse">
          …
        </span>
        <span className="sr-only">Loading, please wait.</span>
      </p>
    </div>
  )
}
