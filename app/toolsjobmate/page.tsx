import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ToolsHero } from "@/components/landing/tools/ToolsHero";
import { ProblemSection } from "@/components/landing/tools/ProblemSection";
import { AvailableTools } from "@/components/landing/tools/AvailableTools";
import { ComingSoonTools } from "@/components/landing/tools/ComingSoonTools";
import { ToolsComparison } from "@/components/landing/tools/ToolsComparison";
import { ToolsPricingCTA } from "@/components/landing/tools/ToolsPricingCTA";

export const metadata: Metadata = {
  title: "6 Tools JobMate Premium — Autopilot Mode Cari Kerja",
  description: "Hemat 10-15 jam setiap minggu dengan 6 tools essential: CV Generator, Email Lamaran, Job Tracker, Surat Lamaran, WhatsApp Generator, dan PDF Tools.",
  keywords: ["tools jobmate", "cv generator", "job tracker", "email lamaran", "surat lamaran generator", "whatsapp generator", "pdf tools"],
  openGraph: {
    title: "6 Tools JobMate Premium — Autopilot Mode Cari Kerja",
    description: "Hemat 10-15 jam setiap minggu dengan 6 tools essential untuk cari kerja lebih cepat dan profesional.",
    type: "website",
  },
};

export default function ToolsJobMatePage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <ToolsHero />
      <ProblemSection />
      <AvailableTools />
      <ComingSoonTools />
      <ToolsComparison />
      <ToolsPricingCTA />
    </main>
  );
}
