import Reveal from '@/components/home/Reveal'

const AJC_STATS = [
  { v: '2022', l: 'Inaugural Year', color: 'text-red' },
  { v: '18+', l: 'States', color: 'text-w' },
  { v: '6', l: 'Age Categories', color: 'text-w' },
  { v: '🏆', l: 'Javelins as Prizes', color: 'text-w' },
]

export default function AjcSection() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-10 z-0 select-none font-serif text-[280px] leading-none tracking-tight text-white/[0.025]"
      >
        AJC
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
        <Reveal variant="up" className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24">
          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
              Flagship Event
            </div>
            <h2 className="mb-5 font-serif text-3xl leading-tight text-w md:text-5xl">
              Amentum Javelin
              <br />
              <em className="not-italic text-red">Championship.</em>
            </h2>
            <p className="mb-8 max-w-md text-[clamp(15px,1.5vw,17px)] font-light leading-relaxed text-white/50">
              India&apos;s dedicated grassroots javelin competition — launched in 2022. Our
              flagship annual event attracts athletes from across the country at every age group,
              from U-14 to Open. We identify talents who go on to become national and
              international medalists. Every winner receives an Amentum javelin suited to their
              category.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <button className="rounded-pill bg-red px-7 py-3.5 text-sm font-medium text-w transition-transform hover:-translate-y-0.5">
                Register for AJC 2026 →
              </button>
              <button className="rounded-pill border-[1.5px] border-white/20 px-7 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40">
                Learn More
              </button>
            </div>
          </div>
        </Reveal>

        <div className="flex items-center px-6 pb-16 md:px-16 md:py-24">
          <Reveal variant="scale" className="w-full">
            <div className="grid grid-cols-2 gap-px bg-white/[0.07]">
              {AJC_STATS.map((s) => (
                <div key={s.l} className="bg-white/[0.04] px-6 py-7">
                  <div className={`font-serif text-4xl leading-none tracking-tight ${s.color}`}>
                    {s.v}
                  </div>
                  <div className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-white/30">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
