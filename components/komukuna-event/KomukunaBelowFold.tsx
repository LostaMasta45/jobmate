"use client";

import dynamic from 'next/dynamic';

// Lazy load below-fold sections to prioritize LCP
const TrustBar = dynamic(() => import('@/components/komukuna-event/TrustBar'), { ssr: false });
const ServicesSection = dynamic(() => import('@/components/komukuna-event/ServicesSection'), { ssr: false });
const USPSection = dynamic(() => import('@/components/komukuna-event/USPSection'), { ssr: false });
const GallerySection = dynamic(() => import('@/components/komukuna-event/GallerySection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/komukuna-event/PricingSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/komukuna-event/HowItWorksSection'), { ssr: false });
const FAQSection = dynamic(() => import('@/components/komukuna-event/FAQSection'), { ssr: false });
const Footer = dynamic(() => import('@/components/komukuna-event/Footer'), { ssr: false });
const FloatingCTA = dynamic(() => import('@/components/komukuna-event/FloatingCTA'), { ssr: false });

export function KomukunaBelowFold() {
    return (
        <>
            <TrustBar />
            <ServicesSection />
            <USPSection />
            <GallerySection />
            <PricingSection />
            <HowItWorksSection />
            <FAQSection />
            <Footer />
            <FloatingCTA />
        </>
    );
}
