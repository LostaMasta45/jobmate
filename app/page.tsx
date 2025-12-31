import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Critical above-fold components - load immediately
import { LandingHeroCosmic } from "@/components/landing-v2/LandingHeroCosmic";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";

// Below-fold components - lazy load for better LCP & TBT
const CompanyLogoMarquee = dynamic(
  () => import("@/components/landing-v2/CompanyLogoMarquee").then(mod => ({ default: mod.CompanyLogoMarquee })),
  { ssr: false }
);

const UserSegmentation = dynamic(
  () => import("@/components/landing-v2/UserSegmentation").then(mod => ({ default: mod.UserSegmentation })),
  { ssr: false }
);

const PainPointsMeteor = dynamic(
  () => import("@/components/landing-v2/PainPointsMeteor").then(mod => ({ default: mod.PainPointsMeteor })),
  { ssr: false }
);

const AboutSectionV2 = dynamic(
  () => import("@/components/landing-v2/AboutSectionV2").then(mod => ({ default: mod.AboutSectionV2 })),
  { ssr: false }
);

const WhyInfoLokerOriginal = dynamic(
  () => import("@/components/landing-v2/WhyInfoLokerOriginal").then(mod => ({ default: mod.WhyInfoLokerOriginal })),
  { ssr: false }
);

const WhyInfoLokerSectionV2 = dynamic(
  () => import("@/components/landing-v2/WhyInfoLokerSectionV2").then(mod => ({ default: mod.WhyInfoLokerSectionV2 })),
  { ssr: false }
);

const MotivationCosmic = dynamic(
  () => import("@/components/landing-v2/MotivationCosmic").then(mod => ({ default: mod.MotivationCosmic })),
  { ssr: false }
);

const WallOfLove = dynamic(
  () => import("@/components/landing-v2/WallOfLove").then(mod => ({ default: mod.WallOfLove })),
  { ssr: false }
);

const ComparisonSticky = dynamic(
  () => import("@/components/landing-v2/ComparisonSticky").then(mod => ({ default: mod.ComparisonSticky })),
  { ssr: false }
);

const PricingBeams = dynamic(
  () => import("@/components/landing-v2/PricingBeams").then(mod => ({ default: mod.PricingBeams })),
  { ssr: false }
);

const BentoGridPro = dynamic(
  () => import("@/components/landing-v2/BentoGridPro").then(mod => ({ default: mod.BentoGridPro })),
  { ssr: false }
);

const TestimonialMarquee = dynamic(
  () => import("@/components/landing-v2/TestimonialMarquee").then(mod => ({ default: mod.TestimonialMarquee })),
  { ssr: false }
);

const FAQGlass = dynamic(
  () => import("@/components/landing-v2/FAQGlass").then(mod => ({ default: mod.FAQGlass })),
  { ssr: false }
);

const CTAExplosion = dynamic(
  () => import("@/components/landing-v2/CTAExplosion").then(mod => ({ default: mod.CTAExplosion })),
  { ssr: false }
);

const SimpleFooter = dynamic(
  () => import("@/components/landing-v2/SimpleFooter").then(mod => ({ default: mod.SimpleFooter })),
  { ssr: false }
);

const StickyNotification = dynamic(
  () => import("@/components/landing-v2/StickyNotification").then(mod => ({ default: mod.StickyNotification })),
  { ssr: false }
);

const StickyBottomCTA = dynamic(
  () => import("@/components/landing-v2/StickyBottomCTA").then(mod => ({ default: mod.StickyBottomCTA })),
  { ssr: false }
);

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

      {/* Critical above-fold content */}
      <LandingHeroCosmic />

      {/* Below-fold content - lazy loaded */}
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
