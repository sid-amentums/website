import Image from 'next/image'
import Reveal from '@/components/home/Reveal'

const ACHIEVEMENTS = [
  'First Indian to qualify for World Athletics Championships Javelin Final (London 2017)',
  'Bronze Medal — Asian Athletics Championships 2017 · 83.29m',
  'Personal Best: 84.57m · National Javelin Champion',
  'Mentor, workshop coach, and ambassador for grassroots javelin in India',
]

export default function BrandAmbassador() {
  return (
    <section className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Reveal variant="up" className="flex flex-col justify-center px-6 py-16 md:px-16 md:py-24">
          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
              Brand Ambassador
            </div>
            <h2 className="mb-5 font-serif text-3xl leading-tight text-ink md:text-5xl">
              Davinder Singh
              <br />
              <em className="not-italic text-red">Kang.</em>
            </h2>
            <p className="mb-6 max-w-md text-[clamp(15px,1.5vw,17px)] font-light leading-relaxed text-mid">
              India&apos;s first javelin thrower to qualify for the World Athletics Championship
              final. A legend who represents the fighting spirit of Indian javelin — on and off
              the field.
            </p>
            <div className="mb-8 flex flex-col gap-3">
              {ACHIEVEMENTS.map((a) => (
                <div key={a} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red" />
                  <span className="text-[13px] text-mid">{a}</span>
                </div>
              ))}
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-[10px] border border-red-bdr bg-red-bg px-[18px] py-3">
              <div className="h-2 w-2 rounded-full bg-red" />
              <span className="text-xs font-medium text-red">
                Official Amentum Sports Brand Ambassador
              </span>
            </div>
          </div>
        </Reveal>

        <div className="relative flex min-h-[420px] items-end justify-center overflow-hidden bg-ink md:min-h-[580px]">
          <div className="absolute inset-0 bg-gradient-to-br from-ink to-[#1a0000]" />
          <div className="absolute right-5 top-5 z-10">
            <Image
              src="/images/brand/amentum_logo.png"
              alt="Amentum"
              width={48}
              height={48}
              className="object-contain invert"
            />
          </div>
          <Image
            src="/images/brand/davinder_kang.png"
            alt="Davinder Singh Kang"
            width={480}
            height={580}
            className="relative z-[1] w-full max-w-[480px] object-contain"
          />
          <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/80 to-transparent p-7">
            <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-red">
              Brand Ambassador
            </div>
            <div className="font-serif text-2xl leading-tight tracking-tight text-w">
              Davinder Singh Kang
            </div>
            <div className="mt-0.5 text-xs text-white/45">
              World Athletics 2017 Finalist · PB 84.57m
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
