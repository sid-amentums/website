import Reveal from '@/components/home/Reveal'

const CHIPS = [
  'Zero Customs',
  'INR Pricing',
  'Pan-India Shipping',
  'Special Olympics Bharat',
  '7 International Brands',
]

export default function MissionSection() {
  return (
    <section className="bg-ink px-6 py-24 md:px-12">
      <div className="max-w-3xl">
        <Reveal variant="up">
          <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
            Our Mission
          </div>
        </Reveal>
        <Reveal variant="up" delayMs={60}>
          <h2 className="mb-5 font-serif text-3xl leading-tight text-w md:text-5xl">
            Structuring
            <br />
            the <em className="not-italic text-red">unstructured.</em>
          </h2>
        </Reveal>
        <Reveal variant="up" delayMs={100}>
          <p className="mb-[22px] max-w-xl text-[clamp(15px,1.5vw,17px)] font-light leading-relaxed text-white/50">
            India has many natural talents in javelin but no formalised training systems. No
            school-level curricula. PT coaches ill-equipped to train athletes. Most talent comes
            from Tier-2 cities, towns and villages with no local manufacturers and expensive
            imported gear.
          </p>
        </Reveal>
        <Reveal variant="up" delayMs={140}>
          <p className="mb-9 max-w-xl text-[clamp(15px,1.5vw,17px)] font-light leading-relaxed text-white/50">
            Amentum Sports was built to fix exactly that. We engineer javelins in India, for
            Indian conditions. Starting at ₹1,180 — zero customs, pan-India delivery, professional
            training support.
          </p>
        </Reveal>
        <Reveal variant="up" delayMs={180}>
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-block rounded-pill border border-white/[0.12] px-4 py-1.5 text-xs text-white/45"
              >
                {chip}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
