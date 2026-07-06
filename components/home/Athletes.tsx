import Reveal from '@/components/home/Reveal'

const ATHLETES = [
  {
    initials: 'RY',
    name: 'Rohit Yadav',
    role: 'National Youth Record Holder 2019 · World No.1 U18',
    loc: 'Senior Level · India',
    highlight: true,
    stats: [
      { v: 'Nr.1', l: 'World U19', red: true },
      { v: '2019', l: 'Nat. Record', red: false },
    ],
  },
  {
    initials: 'SY',
    name: 'Sudama Yadav',
    role: 'Top U18 Thrower · National Rankings',
    loc: 'Junior Level · India',
    highlight: false,
    stats: [{ v: 'Top 5', l: 'U18 India', red: false }],
  },
  {
    initials: 'SM',
    name: 'Samarjeet Singh Malhi',
    role: 'Senior Athlete · Workshop Coach',
    loc: 'Goa Workshop Lead',
    highlight: false,
    stats: [{ v: 'Goa', l: 'Workshop', red: false }],
  },
]

export default function Athletes() {
  return (
    <section className="px-6 pt-0 md:px-12">
      <Reveal variant="up" className="mb-12">
        <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
          Managed &amp; Trained Athletes
        </div>
        <h2 className="font-serif text-3xl text-ink md:text-5xl">Champions we back.</h2>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-off2 md:grid-cols-3">
          {ATHLETES.map((a) => (
            <div key={a.name} className="cursor-pointer bg-w p-9 transition-colors hover:bg-off">
              <div
                className={`mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-border text-[17px] font-medium ${
                  a.highlight ? 'bg-red-bg text-red' : 'bg-off2 text-ink'
                }`}
              >
                {a.initials}
              </div>
              <div className="mb-0.5 font-serif text-xl leading-tight tracking-tight text-ink">
                {a.name}
              </div>
              <div className="mb-1 text-[11px] font-medium text-red">{a.role}</div>
              <div className="mb-3.5 text-[11px] text-dim">{a.loc}</div>
              <div className="flex gap-[18px] border-t border-border pt-3">
                {a.stats.map((s) => (
                  <div key={s.l}>
                    <div
                      className={`font-serif text-[22px] tracking-tight ${s.red ? 'text-red' : 'text-ink'}`}
                    >
                      {s.v}
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wide text-dim">
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
      <div className="border-t-2 border-off3 bg-off px-6 py-5 text-[13px] text-mid md:px-11">
        <strong className="text-ink">Also supported:</strong> Shivpal Singh · Vikas Yadav · Sahil
        Silwal · Runjun Pegu · Anand Singh
      </div>
    </section>
  )
}
