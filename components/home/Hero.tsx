import Link from 'next/link'
import Reveal from '@/components/home/Reveal'

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center md:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[clamp(140px,24vw,320px)] leading-none tracking-tight text-black/[0.022]"
      >
        AMENTUM
      </div>

      <Reveal variant="up">
        <div className="mb-11 inline-flex items-center gap-2 rounded-pill border border-border-2 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-mid">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red" />
          Mission 2028 — India&apos;s Podium Journey
        </div>
      </Reveal>

      <Reveal variant="up" delayMs={100}>
        <h1 className="mb-8 max-w-4xl font-serif text-[clamp(52px,9vw,118px)] leading-[0.93] tracking-tight text-ink">
          Engineering the <em className="text-red not-italic">Future</em> of Indian Athletics.
        </h1>
      </Reveal>

      <Reveal variant="up" delayMs={200}>
        <p className="mb-[52px] max-w-md text-[clamp(15px,1.6vw,19px)] font-light leading-relaxed text-mid">
          World-class javelins. Professional training systems. Elite athlete management. Making
          javelin a way of life in India.
        </p>
      </Reveal>

      <Reveal variant="up" delayMs={300}>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link
            href="/shop"
            className="rounded-pill bg-ink px-9 py-3.5 text-sm font-medium text-w transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-red hover:shadow-xl"
          >
            Shop Javelins
          </Link>
          <button className="rounded-pill border-[1.5px] border-border-2 px-9 py-3.5 text-sm font-medium text-ink transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:border-ink hover:bg-off">
            Athlete Arena →
          </button>
        </div>
      </Reveal>

      <div className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <div className="relative h-[52px] w-px overflow-hidden bg-gradient-to-b from-transparent to-pale">
          <div className="absolute -top-full h-full w-full animate-fall bg-gradient-to-b from-transparent to-ink" />
        </div>
      </div>
    </section>
  )
}
