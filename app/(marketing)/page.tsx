import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-var(--nav-h))] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-11 inline-flex items-center gap-2 rounded-pill border border-border-2 px-4 py-1.5 text-[11px] font-medium uppercase tracking-wide text-mid">
        <span className="h-1.5 w-1.5 rounded-full bg-red" />
        Largest javelin store in Asia
      </div>
      <h1 className="mb-8 max-w-4xl font-serif text-[clamp(44px,9vw,110px)] leading-[0.93] tracking-tight text-ink">
        Precision-engineered <em className="text-red not-italic">javelins</em>
      </h1>
      <p className="mb-12 max-w-md text-[16px] font-light leading-relaxed text-mid">
        World-class javelins engineered for India. Zero customs. INR pricing.
      </p>
      <Link
        href="/shop"
        className="rounded-pill bg-ink px-9 py-3.5 text-sm font-medium text-w transition-all duration-300 ease-spring hover:-translate-y-0.5 hover:bg-red hover:shadow-xl"
      >
        Shop Javelins
      </Link>
    </section>
  )
}
