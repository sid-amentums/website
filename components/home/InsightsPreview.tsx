import Reveal from '@/components/home/Reveal'

const ARTICLES = [
  {
    cat: 'India News · May 2025',
    title: "Neeraj Chopra Breaks 90m — India's Greatest Athletic Milestone",
    body: 'On May 16, 2025, Neeraj Chopra became the first Indian athlete to throw beyond 90 metres — 90.23m at the Doha Diamond League.',
    read: '8 min read',
  },
  {
    cat: 'India News · July 2025',
    title: 'NC Classic 2025: India Hosts Its First World Athletics Gold Level Event',
    body: "Neeraj Chopra won the inaugural NC Classic in Bengaluru with 86.18m — India's first-ever World Athletics Continental Tour Gold event.",
    read: '7 min read',
  },
  {
    cat: 'World Athletics · August 2024',
    title: "Arshad Nadeem's 92.97m Olympic Record — A New Era for South Asian Javelin",
    body: "At Paris 2024, Pakistan's Arshad Nadeem threw 92.97m to win Olympic gold — an Olympic and Asian record — while Neeraj Chopra took silver with 89.45m.",
    read: '7 min read',
  },
]

// Static preview only — Insights/Blog CMS (Module 3) isn't built yet, so
// these cards aren't wired to real article pages/modals. Content is ported
// verbatim from the legacy prototype's DEFAULT_ARTICLES.
export default function InsightsPreview() {
  return (
    <section className="bg-off px-6 pb-0 pt-[72px] md:px-12">
      <Reveal variant="up" className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
            Amentum Insights
          </div>
          <h2 className="font-serif text-3xl text-ink md:text-5xl">From the field.</h2>
        </div>
        <span className="rounded-pill border border-border-2 px-5 py-2 text-xs font-medium text-dim">
          All articles →
        </span>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-pale md:grid-cols-3">
          {ARTICLES.map((a) => (
            <div key={a.title} className="bg-w p-9 transition-colors hover:bg-off">
              <div className="mb-3 text-[10px] font-medium uppercase tracking-wide text-red">
                {a.cat}
              </div>
              <div className="mb-2.5 font-serif text-xl leading-snug tracking-tight text-ink">
                {a.title}
              </div>
              <div className="mt-2 text-[13px] leading-relaxed text-mid">{a.body}</div>
              <div className="mt-2 text-xs text-dim">{a.read}</div>
              <span className="mt-4 inline-block text-xs font-medium text-ink">
                Read Full Article →
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
