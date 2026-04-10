import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import PredictSection from '@/components/PredictSection'
import ResultsSection from '@/components/ResultsSection'
import Footer from '@/components/Footer'

export default function DashboardHome() {
  return (
    <main className="min-h-screen bg-bg-main">
      <HeroSection />
      <AboutSection />
      <PredictSection />
      <ResultsSection />
      <Footer />
    </main>
  )
}
