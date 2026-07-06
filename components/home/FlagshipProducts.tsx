import Image from 'next/image'
import Link from 'next/link'
import Reveal from '@/components/home/Reveal'

const FLAGSHIP = [
  {
    name: 'The Nalwa (Blue Green)',
    series: 'AM-BLGR · Competition · Low Flex',
    waCert: true,
    desc: 'Blue-Green · World Athletics Certified. Named after legendary warrior Haqiqat Rai Nalwa. Maximum hang time, precision steel tip.',
    price: '₹26,000',
    img: 'https://static.wixstatic.com/media/a4300d_584ea8d99d8b4d4191e793388e4c82ba~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80/a4300d_584ea8d99d8b4d4191e793388e4c82ba~mv2.jpg',
    bg: '#dff4f6',
  },
  {
    name: 'The Chhatrapati (Purple)',
    series: 'AM-PUO · Competition · Low Flex',
    waCert: false,
    desc: 'Purple · Named after Chhatrapati Shivaji Maharaj. Low flex elite competition javelin for throwers targeting the 60–80m range.',
    price: 'from ₹16,250',
    img: '/images/products/Purple_White.png',
    bg: '#f0edff',
  },
  {
    name: 'Black Panther',
    series: 'AM-BLA · Training / Competition · Medium Flex',
    waCert: false,
    desc: 'High-impact alloy for daily training in all conditions. Dual-use training and competition. Ideal for Tier-2 city academies and high-volume sessions.',
    price: 'from ₹8,000',
    img: '/images/products/Black_Panther.jpg',
    bg: '#f0f0f0',
  },
]

export default function FlagshipProducts() {
  return (
    <div className="px-6 pb-24 md:px-12">
      <Reveal variant="up">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-border py-11">
          <div>
            <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
              The Arsenal
            </div>
            <h2 className="font-serif text-3xl text-ink md:text-5xl">Flagship Javelins</h2>
          </div>
          <Link
            href="/shop"
            className="rounded-pill border border-border-2 px-5 py-2 text-xs font-medium text-ink transition-colors hover:border-ink"
          >
            View all models →
          </Link>
        </div>
      </Reveal>

      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-off3 sm:grid-cols-2 lg:grid-cols-3">
          {FLAGSHIP.map((p) => (
            <Link key={p.name} href="/shop" className="flex flex-col bg-w transition-colors hover:bg-off">
              <div
                className="flex aspect-[4/3] items-center justify-center p-6"
                style={{ background: p.bg }}
              >
                <Image
                  src={p.img}
                  alt={p.name}
                  width={320}
                  height={240}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-border p-5">
                <div className="mb-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-dim">
                  {p.series}
                  {p.waCert ? (
                    <span className="rounded-md bg-[#25D366] px-1.5 py-0.5 text-[9px] font-semibold uppercase text-w">
                      WA Cert
                    </span>
                  ) : null}
                </div>
                <div className="mb-1.5 font-serif text-xl leading-tight text-ink">{p.name}</div>
                <p className="mb-3.5 flex-1 text-xs leading-relaxed text-mid">{p.desc}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-medium text-ink">{p.price}</span>
                  <span className="rounded-pill bg-ink px-4 py-2 text-[11px] font-medium text-w">
                    View in Shop →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  )
}
