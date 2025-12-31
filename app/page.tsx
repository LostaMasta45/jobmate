import { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

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
  return <LandingPageClient />;
}
