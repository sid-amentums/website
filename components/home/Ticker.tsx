const ITEMS = [
  'Structured',
  'Affordable',
  'Elite',
  'Largest Javelin Store in Asia',
  'Amentum Javelin Championship',
  '7 International Brands',
  'Special Olympics Bharat Partner',
  'World No.1 U18 Athlete Trained',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden bg-ink py-[18px]">
      <div className="inline-flex animate-roll whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-11 font-serif text-[clamp(18px,2.5vw,24px)] tracking-tight text-white/[0.88]">
              {item}
            </span>
            <span className="text-base text-red">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
