'use client';

import Header from '@/components/layout/Header';
import { HeroSection } from './_components/HeroSection';
import { FeaturesSection } from './_components/FeatureSection';
import { QuoteSection } from './_components/QuoteSection';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <HeroSection />
        <FeaturesSection />
        <QuoteSection />
      </main>

      <Footer />
    </div>
  );
}
