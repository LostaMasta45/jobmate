import { Metadata } from "next";
import { LandingHeroCosmic } from "@/components/landing-v2/LandingHeroCosmic";
import { PainPointsMeteor } from "@/components/landing-v2/PainPointsMeteor";
import { BentoGridPro } from "@/components/landing-v2/BentoGridPro";
import { AboutSectionV2 } from "@/components/landing-v2/AboutSectionV2";
import { WhyInfoLokerSectionV2 } from "@/components/landing-v2/WhyInfoLokerSectionV2";
import { WhyInfoLokerOriginal } from "@/components/landing-v2/WhyInfoLokerOriginal";
import { MotivationCosmic } from "@/components/landing-v2/MotivationCosmic";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { CompanyLogoMarquee } from "@/components/landing-v2/CompanyLogoMarquee";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";
import { ComparisonSticky } from "@/components/landing-v2/ComparisonSticky";
import { PricingBeams } from "@/components/landing-v2/PricingBeams";
import { TestimonialMarquee } from "@/components/landing-v2/TestimonialMarquee";
import { FAQGlass } from "@/components/landing-v2/FAQGlass";
import { CTAExplosion } from "@/components/landing-v2/CTAExplosion";

import { StickyNotification } from "@/components/landing-v2/StickyNotification";
import { UserSegmentation } from "@/components/landing-v2/UserSegmentation";
import { WallOfLove } from "@/components/landing-v2/WallOfLove";
import { StickyBottomCTA } from "@/components/landing-v2/StickyBottomCTA";

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
    <main className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-brand selection:text-white font-sans">
       <StickyNotification />
       <NavbarDynamic />
       
       {/* Background Global Effects */}
       <div className="fixed inset-0 z-[-1] bg-black pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
       </div>

       <LandingHeroCosmic />
       <CompanyLogoMarquee />
       <UserSegmentation />
       <PainPointsMeteor />
       <AboutSectionV2 />
       <WhyInfoLokerOriginal />
       <WhyInfoLokerSectionV2 />
       <MotivationCosmic />
       <WallOfLove />
       <ComparisonSticky />
       <PricingBeams />
       <BentoGridPro />
       <TestimonialMarquee />
       <FAQGlass />
       <CTAExplosion />

       <SimpleFooter />
       <StickyBottomCTA />
    </main>
  );
}
