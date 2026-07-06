import Image from 'next/image'
import Reveal from '@/components/home/Reveal'

const TEAM = [
  {
    name: 'Aditya Bhargava',
    role: 'Co-Founder',
    bio: 'Masters in Biomedical Engineering, University of Connecticut, USA. Quality Engineer by profession. Played tennis and cricket at university level. Passionate about bringing grassroots change to Indian sports — delivering solutions inspired by sporting nations, tailored to Indian athlete requirements.',
    img: 'https://static.wixstatic.com/media/a4300d_34a07201469845cd9011dff9c5c64064~mv2.png/v1/crop/x_2,y_0,w_173,h_173/fill/w_200,h_200,al_c,q_85/adi.png',
  },
  {
    name: 'Siddharth Patil',
    role: 'Co-Founder',
    bio: "Represented India at Asia-Pacific Tchoukball Championship 2010. Co-founded CoachKhoj. Headed IT & Strategy for Tensports parent company Zee TAJ TV. Brings technology, operations, customer service and strategy to Amentum's day-to-day operations and growth.",
    img: 'https://static.wixstatic.com/media/a4300d_26207ed97efa4784aaf02a43c30b12f8~mv2.png/v1/fill/w_200,h_200,al_c,q_85/Siddharth%20Patl%20-%20Founder%20-%20Partner%20-%20CoachKhoj%20-%20Amentum%20Sports.png',
  },
]

export default function Team() {
  return (
    <section className="bg-off px-6 py-[72px] md:px-12">
      <Reveal variant="up">
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-red">
          The People Behind It
        </div>
        <h2 className="mb-3 font-serif text-3xl text-ink md:text-5xl">Meet the team.</h2>
      </Reveal>
      <Reveal variant="up" delayMs={60} className="mb-[52px]">
        <p className="max-w-lg text-[clamp(15px,1.5vw,17px)] font-light leading-relaxed text-mid">
          Two sports enthusiasts who saw a broken system and decided to fix it.
        </p>
      </Reveal>
      <Reveal variant="scale">
        <div className="grid grid-cols-1 gap-px bg-off2 md:grid-cols-2">
          {TEAM.map((member) => (
            <div key={member.name} className="bg-w p-11 transition-colors hover:bg-off">
              <Image
                src={member.img}
                alt={member.name}
                width={96}
                height={96}
                className="mb-6 h-24 w-24 rounded-full border-[3px] border-off2 bg-off object-cover"
              />
              <div className="mb-1 font-serif text-2xl leading-tight tracking-tight text-ink">
                {member.name}
              </div>
              <div className="mb-[18px] text-[11px] font-medium uppercase tracking-wide text-red">
                {member.role}
              </div>
              <div className="text-sm leading-relaxed text-mid">{member.bio}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
