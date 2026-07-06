import Reveal from '@/components/home/Reveal'

const STATS = [
  { pre: '', n: 'Asia', post: '', l: 'Largest Javelin Store' },
  { pre: '₹', n: '1,180', post: '', l: 'Starting Price' },
  { pre: '', n: '9', post: '+', l: 'Javelin Models' },
  { pre: '', n: '0', post: '%', l: 'Customs Duties' },
  { pre: '', n: '7', post: '', l: 'International Brands' },
]

export default function StatsBar() {
  return (
    <Reveal variant="up">
      <div className="flex flex-col flex-wrap justify-center border-t border-border md:flex-row">
        {STATS.map((stat, i) => (
          <div
            key={stat.l}
            className={`flex-1 border-b border-border px-10 py-8 text-center last:border-b-0 md:min-w-[150px] md:border-b-0 md:border-r ${
              i === STATS.length - 1 ? 'md:border-r-0' : ''
            }`}
          >
            <div className="font-serif text-[clamp(26px,3.5vw,40px)] leading-none tracking-tight text-ink">
              {stat.pre}
              <em className="text-red not-italic">{stat.n}</em>
              {stat.post}
            </div>
            <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-dim">
              {stat.l}
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
