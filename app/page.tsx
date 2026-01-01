import { Metadata } from "next";

import { LandingHeroCosmic } from "@/components/landing-v2/LandingHeroCosmic";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { StickyNotification } from "@/components/landing-v2/StickyNotification";

import LandingBelowFoldWrapper from "@/components/landing-v2/LandingBelowFoldWrapper";


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

      {/* Critical above-fold content - Rendered Immediately (SSR Friendly) */}
      <LandingHeroCosmic />

      {/* Below-fold content - Lazy loaded on client */}
      <LandingBelowFoldWrapper />
    </main>
  );
}
