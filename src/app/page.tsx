'use client';
import HeroSection from '@/components/HeroSection';
import { SiteExplanation } from '@/components/HeroSection';
import QuizSection from '@/components/QuizSection';
import WardrobeSection from '@/components/WardrobeSection';
import FashionConsultingSection from '@/components/FashionConsultingSection';
import Footer from '@/components/Footer';
import FloatingLisChat from '@/components/FloatingLisChat';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 animate-gradient">
  <HeroSection />
  <SiteExplanation />
      <QuizSection />
      <WardrobeSection />
      <FashionConsultingSection />
      <Footer />
      <FloatingLisChat />
    </div>
  );
}