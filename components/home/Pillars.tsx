import Reveal from '@/components/home/Reveal'

const PILLARS = [
  {
    title: 'Athlete Management',
    body: 'Managing top Indian athletes across Youth, Junior and Senior levels. End-to-end sponsorship, world-class training systems. Brand ambassador Davinder Singh Kang leads our outreach and athlete development.',
    link: 'Elite Icons →',
    icon: (
      <>
        <circle cx="22" cy="15" r="8" stroke="#0a0a0a" strokeWidth="1.5" />
        <path d="M8 38c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#0a0a0a" strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: 'Infrastructure',
    body: 'Mini-Javelin curriculum kits, javelin workshops across India, coach certification, and our flagship Amentum Javelin Championship annually. Official Mini-Javelin partner of Special Olympics Bharat.',
    link: 'Schools & Academies →',
    icon: (
      <>
        <rect x="6" y="16" width="32" height="22" rx="2" stroke="#0a0a0a" strokeWidth="1.5" />
        <path d="M16 16V11a6 6 0 0 1 12 0v5" stroke="#0a0a0a" strokeWidth="1.5" />
      </>
    ),
  },
  {
    title: 'The Shop',
    body: 'Zero customs. INR pricing. ₹1,180 to ₹26,000. Nine Amentum models plus 7 international brands — Nemeth, Polanik, Nordic Sport, Gill Athletics, Nishi, Denfi Sport, and Turbojav.',
    link: 'Shop Now →',
    icon: (
      <>
        <path
          d="M8 8h5l4 22h16l4-13H16"
          stroke="#0a0a0a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="36" r="2.5" stroke="#0a0a0a" strokeWidth="1.5" />
        <circle cx="31" cy="36" r="2.5" stroke="#0a0a0a" strokeWidth="1.5" />
      </>
    ),
  },
]

export default function Pillars() {
  return (
    <section className="px-6 py-[72px] md:px-12">
      <Reveal variant="up" className="mb-12">
        <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
          How We Operate
        </div>
        <h2 className="font-serif text-3xl text-ink md:text-5xl">Three pillars.</h2>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-off2 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="bg-w p-11 transition-colors hover:bg-off">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="mb-7">
                {p.icon}
              </svg>
              <div className="mb-3.5 font-serif text-2xl leading-tight tracking-tight text-ink">
                {p.title}
              </div>
              <div className="text-sm leading-relaxed text-mid">{p.body}</div>
              <span className="mt-5 inline-block text-[11px] font-medium uppercase tracking-wide text-red">
                {p.link}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
