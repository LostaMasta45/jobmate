import dynamic from "next/dynamic";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { Metadata } from "next";

// Loading component untuk better UX
function SectionLoader() {
  return (
    <div className="w-full py-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

// Dynamic import - Optimized order for conversion
const PainPointsWithSocial = dynamic(
  () => import("@/components/landing/revisi/PainPointsWithSocial").then(mod => mod.PainPointsWithSocial),
  { loading: () => <SectionLoader />, ssr: true }
);

const WhyUsCompact = dynamic(
  () => import("@/components/landing/revisi/WhyUsCompact").then(mod => mod.WhyUsCompact),
  { loading: () => <SectionLoader />, ssr: true }
);

// PRICING MOVED UP - Main conversion point at position 4
const PricingSection = dynamic(
  () => import("@/components/landing/PricingSection").then(mod => mod.PricingSection),
  { loading: () => <SectionLoader />, ssr: true }
);

const ToolsPreview = dynamic(
  () => import("@/components/landing/revisi/ToolsPreview").then(mod => mod.ToolsPreview),
  { loading: () => <SectionLoader />, ssr: true }
);

const FAQQuick = dynamic(
  () => import("@/components/landing/revisi/FAQQuick").then(mod => mod.FAQQuick),
  { loading: () => <SectionLoader />, ssr: true }
);

const CTASection = dynamic(
  () => import("@/components/landing/CTASection").then(mod => mod.CTASection),
  { loading: () => <SectionLoader />, ssr: true }
);

const SalesPopup = dynamic(
  () => import("@/components/landing/SalesPopup").then(mod => mod.SalesPopup),
  { loading: () => <SectionLoader />, ssr: true }
);

export const metadata: Metadata = {
  title: "Career VIP InfoLokerJombang — Siap Kerja Setiap Hari (Optimized)",
  description: "Gabung grup VIP + akses tools JobMate: CV, Email Lamaran, Interview Guide, dan banyak lagi. 203.000+ follower sudah mempercayai kami.",
  keywords: ["lowongan kerja jombang", "info loker", "career vip", "jobmate", "cv generator", "aplikasi lamaran kerja"],
  openGraph: {
    title: "Career VIP InfoLokerJombang — Siap Kerja Setiap Hari",
    description: "Gabung grup VIP + akses tools JobMate: CV, Email Lamaran, Interview Guide, dan banyak lagi.",
    type: "website",
  },
};

export default function RevisiLandingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Performance Test Banner */}
      <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
        ⚡ Optimized Version
      </div>

      {/* OPTIMIZED HIGH-CONVERTING STRUCTURE (7 Sections) */}
      
      {/* 1. Hero - Load immediately */}
      <LandingNavbar />
      <LandingHero />
      
      {/* 2. Pain Points + Social Proof */}
      <PainPointsWithSocial />
      
      {/* 3. Why Choose Us (Merged: About + Motivation + Why + Comparison) */}
      <WhyUsCompact />
      
      {/* 4. ⚡ PRICING - Main Conversion Point (Moved UP from position 7!) */}
      <PricingSection />
      
      {/* 5. Tools Preview - Visual showcase */}
      <ToolsPreview />
      
      {/* 6. FAQ Quick - Top 5 only */}
      <FAQQuick />
      
      {/* 7. Final CTA */}
      <CTASection />
      
      {/* Sales Popup - Background conversion booster */}
      <SalesPopup />
    </main>
  );
}
