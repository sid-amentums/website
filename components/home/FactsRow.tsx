import Reveal from '@/components/home/Reveal'

const FACTS = [
  {
    n: '₹1,180',
    l: 'Lowest-priced competition javelin in Asia. No customs. Door delivery anywhere in India.',
  },
  {
    n: '0%',
    l: 'Customs duties on all Amentum products. Order from anywhere in India, no hidden costs.',
  },
  {
    n: '#1',
    l: 'World ranking (U18) achieved by Rohit Yadav, trained by the Amentum coaching system.',
  },
]

export default function FactsRow() {
  return (
    <Reveal variant="up">
      <div className="grid grid-cols-1 gap-px bg-pale md:grid-cols-3">
        {FACTS.map((f) => (
          <div key={f.l} className="bg-w px-11 py-[52px]">
            <div className="font-serif text-[clamp(40px,5.5vw,64px)] leading-none tracking-tight">
              <em className="text-red not-italic">{f.n}</em>
            </div>
            <div className="mt-2.5 max-w-[220px] text-[13px] leading-relaxed text-mid">{f.l}</div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}
