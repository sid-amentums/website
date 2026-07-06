import Image from 'next/image'
import Reveal from '@/components/home/Reveal'

const PARTNERS = [
  { src: '/images/brand/nemeth_logo.png', alt: 'Nemeth Javelins' },
  { src: '/images/brand/polanik_logo.png', alt: 'Polanik' },
  { src: '/images/brand/nordic_logo.png', alt: 'Nordic Sport' },
  { src: '/images/brand/gill_logo.png', alt: 'Gill Athletics' },
  { src: '/images/brand/nishi_logo.png', alt: 'Nishi Athletics' },
  { src: '/images/brand/denfi_logo.png', alt: 'Denfi Sport Denmark' },
  { src: '/images/brand/turbojav_logo.png', alt: 'Turbojav' },
]

const SPECIAL_OLYMPICS = {
  href: 'https://www.specialolympicsbharat.org',
  src: 'https://static.wixstatic.com/media/a4300d_340d8d1446cd4bb0b25d8d26c6b33a4f~mv2.jpeg/v1/crop/x_0,y_1,w_151,h_57/fill/w_211,h_80,al_c,q_80/Unknown-1.jpeg',
  alt: 'Special Olympics Bharat',
}

export default function Partners() {
  return (
    <Reveal variant="up">
      <div className="flex flex-wrap items-center justify-center gap-10 border-y border-border bg-off px-6 py-14 md:px-12">
        {PARTNERS.map((p) => (
          <div key={p.alt} className="opacity-50 grayscale transition-all duration-300 hover:opacity-95 hover:grayscale-0">
            <Image src={p.src} alt={p.alt} width={140} height={40} className="h-10 max-w-[140px] object-contain" />
          </div>
        ))}
        <a
          href={SPECIAL_OLYMPICS.href}
          target="_blank"
          rel="noopener"
          className="opacity-50 grayscale transition-all duration-300 hover:opacity-95 hover:grayscale-0"
        >
          <Image
            src={SPECIAL_OLYMPICS.src}
            alt={SPECIAL_OLYMPICS.alt}
            width={211}
            height={80}
            className="h-10 max-w-[140px] object-contain"
          />
        </a>
      </div>
    </Reveal>
  )
}
