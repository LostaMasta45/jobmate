import Link from 'next/link';
import Navbar from '@/components/komukuna-event/Navbar';
import HeroSection from '@/components/komukuna-event/HeroSection';
import TrustBar from '@/components/komukuna-event/TrustBar';
import ServicesSection from '@/components/komukuna-event/ServicesSection';
import USPSection from '@/components/komukuna-event/USPSection';
import GallerySection from '@/components/komukuna-event/GallerySection';
import PricingSection from '@/components/komukuna-event/PricingSection';
import HowItWorksSection from '@/components/komukuna-event/HowItWorksSection';
import FAQSection from '@/components/komukuna-event/FAQSection';
import Footer from '@/components/komukuna-event/Footer';
import Preloader from '@/components/komukuna-event/Preloader';
import FloatingCTA from '@/components/komukuna-event/FloatingCTA';

export default function KomukunaEventPage() {
    return (
        <main className="relative w-full overflow-hidden">
            <Preloader />
            <Navbar />
            <HeroSection />
            <TrustBar />
            <ServicesSection />
            <USPSection />
            <GallerySection />
            <PricingSection />
            <HowItWorksSection />
            <FAQSection />
            <Footer />
            <FloatingCTA />
        </main>
    );
}
