'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import PredictSection from '@/components/PredictSection';
import ResultsSection from '@/components/ResultsSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PredictSection />
      <ResultsSection />
      <Footer />
    </main>
  );
}
