import { LandingHero } from "@/components/landing/LandingHero";
import { PainPoints } from "@/components/landing/PainPoints";
import { AboutSection } from "@/components/landing/AboutSection";
import { WhyInfoLokerSection } from "@/components/landing/WhyInfoLokerSection";
import { MotivationSection } from "@/components/landing/MotivationSection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { ToolsSection } from "@/components/landing/ToolsSection";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { SalesPopup } from "@/components/landing/SalesPopup";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career VIP InfoLokerJombang — Siap Kerja Setiap Hari",
  description: "Gabung grup VIP + akses tools JobMate: CV, Email Lamaran, Interview Guide, dan banyak lagi. 203.000+ follower sudah mempercayai kami.",
  keywords: ["lowongan kerja jombang", "info loker", "career vip", "jobmate", "cv generator", "aplikasi lamaran kerja"],
  openGraph: {
    title: "Career VIP InfoLokerJombang — Siap Kerja Setiap Hari",
    description: "Gabung grup VIP + akses tools JobMate: CV, Email Lamaran, Interview Guide, dan banyak lagi.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <LandingHero />
      <PainPoints />
      <AboutSection />
      <WhyInfoLokerSection />
      <MotivationSection />
      <ComparisonSection />
      <PricingSection />
      <ToolsSection />
      <TestimonialSection />
      <FAQSection />
      <CTASection />
      <SalesPopup />
    </main>
  );
}
