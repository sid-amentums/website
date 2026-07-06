import Image from 'next/image'
import Reveal from '@/components/home/Reveal'

const TESTIMONIALS = [
  {
    name: 'Rohit Yadav',
    sub: 'National Youth Record 2019 · World No.1 U19',
    quote:
      '"Amentum\'s training system and javelin quality helped me become Youth National Champion and reach World No. 1 in the U19 category."',
    img: 'https://static.wixstatic.com/media/a4300d_7e4b61e771504897a333a95266d5d1d4~mv2.jpg/v1/crop/x_20,y_0,w_711,h_711/fill/w_200,h_200,al_c,q_80/39741001_1752106481553247_69528119907041.jpg',
  },
  {
    name: 'Anand Singh',
    sub: 'Bronze Medalist, Youth Nationals 2017',
    quote:
      '"The online training plan and video analysis from Amentum improved my technique and helped me win Bronze at the Youth Nationals."',
    img: 'https://static.wixstatic.com/media/a4300d_e4537d4fd9a14dc38846e0931cec743d~mv2_d_6000_4000_s_4_2.jpg/v1/crop/x_233,y_0,w_4603,h_3892/fill/w_200,h_200,al_c,q_80/Anand%201.jpg',
  },
  {
    name: 'Vishwesh Bhatt',
    sub: 'Participant, Turbojav Workshop · Goa',
    quote: '"The Turbojav workshop in Goa was incredible. Technique improvements were immediate and world-class."',
    img: 'https://static.wixstatic.com/media/a4300d_44659f7ba75949fcb7f74db244114889~mv2.jpg/v1/crop/x_0,y_187,w_720,h_719/fill/w_200,h_200,al_c,q_80/vishwesh.jpg',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-off px-6 pb-0 pt-[72px] md:px-12">
      <Reveal variant="up" className="mb-12">
        <div className="mb-3.5 text-[11px] font-medium uppercase tracking-wide text-red">
          Testimonials
        </div>
        <h2 className="font-serif text-3xl text-ink md:text-5xl">Heard from the field.</h2>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-off2 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-w p-11 transition-colors hover:bg-off">
              <div className="mb-5 h-16 w-16 overflow-hidden rounded-full border-2 border-off3 bg-off">
                <Image src={t.img} alt={t.name} width={64} height={64} className="h-full w-full object-cover" />
              </div>
              <div className="mb-5 font-serif text-lg italic leading-relaxed tracking-tight text-ink">
                {t.quote}
              </div>
              <div className="text-[13px] font-semibold text-ink">{t.name}</div>
              <div className="mt-0.5 text-xs text-mid">{t.sub}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
