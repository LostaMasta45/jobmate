import { Metadata } from "next";
import { NavbarDynamic } from "@/components/landing-v2/NavbarDynamic";
import { SimpleFooter } from "@/components/landing-v2/SimpleFooter";
import { ToolsHeroCosmic } from "@/components/landing-v2/tools/ToolsHeroCosmic";
import { ProblemSectionCosmic } from "@/components/landing-v2/tools/ProblemSectionCosmic";
import { AvailableToolsCosmic } from "@/components/landing-v2/tools/AvailableToolsCosmic";
import { ComingSoonToolsCosmic } from "@/components/landing-v2/tools/ComingSoonToolsCosmic";
import { ToolsComparisonCosmic } from "@/components/landing-v2/tools/ToolsComparisonCosmic";
import { ToolsPricingCTACosmic } from "@/components/landing-v2/tools/ToolsPricingCTACosmic";

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
    <main className="min-h-screen bg-black text-white font-sans selection:bg-brand selection:text-white overflow-x-hidden">
      <NavbarDynamic />
      <ToolsHeroCosmic />
      <ProblemSectionCosmic />
      <AvailableToolsCosmic />
      <ComingSoonToolsCosmic />
      <ToolsComparisonCosmic />
      <ToolsPricingCTACosmic />
      <SimpleFooter />
    </main>
  );
}

