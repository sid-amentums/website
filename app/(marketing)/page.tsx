import Hero from '@/components/home/Hero'
import StatsBar from '@/components/home/StatsBar'
import Ticker from '@/components/home/Ticker'
import FlagshipProducts from '@/components/home/FlagshipProducts'
import AjcSection from '@/components/home/AjcSection'
import BrandAmbassador from '@/components/home/BrandAmbassador'
import MissionSection from '@/components/home/MissionSection'
import Pillars from '@/components/home/Pillars'
import Team from '@/components/home/Team'
import Athletes from '@/components/home/Athletes'
import Testimonials from '@/components/home/Testimonials'
import Partners from '@/components/home/Partners'
import InsightsPreview from '@/components/home/InsightsPreview'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Ticker />
      <FlagshipProducts />
      <AjcSection />
      <BrandAmbassador />
      <MissionSection />
      <Pillars />
      <Team />
      <Athletes />
      <Testimonials />
      <Partners />
      <InsightsPreview />
    </>
  )
}
