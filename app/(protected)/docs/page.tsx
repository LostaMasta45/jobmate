"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Rocket,
  Briefcase,
  Wrench,
  HelpCircle,
  ChevronRight,
  Target,
  FileBadge2,
  FileSignature,
  MailPlus,
  KanbanSquare,
  FileCog,
  MessageSquareText,
  Building2,
  Bell,
  BookMarked,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const docsSections = [
  {
    id: "quick-start",
    title: "🚀 Quick Start",
    description: "Mulai cepat dalam 5 menit",
    icon: Rocket,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    items: [
      { title: "Panduan Pemula", href: "/docs/quick-start", description: "Cara menggunakan JobMate untuk pertama kali", badge: "Wajib Baca" },
      { title: "Setup Profil", href: "/docs/quick-start#profile", description: "Lengkapi profil untuk hasil maksimal" },
      { title: "Navigasi Dashboard", href: "/docs/quick-start#dashboard", description: "Mengenal dashboard JobMate" },
    ]
  },
  {
    id: "career-vip",
    title: "💼 Career VIP",
    description: "Panduan lowongan kerja dan karir",
    icon: Briefcase,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    items: [
      { title: "Panduan Lowongan Kerja", href: "/docs/career-vip/lowongan", description: "Cara mencari dan bookmark lowongan" },
      { title: "Cara Melamar Kerja", href: "/docs/career-vip/melamar", description: "Langkah-langkah melamar pekerjaan" },
      { title: "Info Perusahaan", href: "/docs/career-vip/perusahaan", description: "Riset perusahaan sebelum melamar" },
      { title: "Job Alerts", href: "/docs/career-vip/alerts", description: "Setting notifikasi lowongan baru" },
      { title: "Tips Sukses Interview", href: "/docs/career-vip/interview-tips", description: "Rahasia lolos interview" },
    ]
  },
  {
    id: "tools",
    title: "🛠️ JobMate Tools",
    description: "Tutorial lengkap semua tools premium",
    icon: Wrench,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    items: [
      {
        title: "CV ATS Generator",
        href: "/docs/tools/cv-ats",
        description: "Buat CV yang lolos ATS",
        icon: FileBadge2,
        badge: "Premium"
      },
      {
        title: "Surat Lamaran AI",
        href: "/docs/tools/surat-lamaran",
        description: "Generate surat lamaran otomatis",
        icon: FileSignature,
        badge: "Premium"
      },
      {
        title: "Email Generator",
        href: "/docs/tools/email-generator",
        description: "Buat email follow-up profesional",
        icon: MailPlus,
        badge: "Premium"
      },
      {
        title: "Job Application Tracker",
        href: "/docs/tools/tracker",
        description: "Track semua aplikasi kerja Anda",
        icon: KanbanSquare,
        badge: "Premium"
      },
      {
        title: "Interview Prep",
        href: "/docs/tools/interview-prep",
        description: "Persiapan interview dengan AI",
        icon: Target,
        badge: "Premium"
      },
      {
        title: "PDF Tools",
        href: "/docs/tools/pdf-tools",
        description: "Merge, convert, dan edit PDF",
        icon: FileCog,
        badge: "Premium"
      },
      {
        title: "WA Message Generator",
        href: "/docs/tools/wa-generator",
        description: "Generate pesan WhatsApp profesional",
        icon: MessageSquareText,
        badge: "Premium"
      },
    ]
  },
  {
    id: "faq",
    title: "❓ FAQ & Troubleshooting",
    description: "Pertanyaan umum dan solusi masalah",
    icon: HelpCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    items: [
      { title: "Pertanyaan Umum", href: "/docs/faq", description: "Jawaban untuk pertanyaan yang sering ditanyakan" },
      { title: "Troubleshooting", href: "/docs/faq#troubleshooting", description: "Solusi masalah teknis" },
      { title: "Tips & Trik", href: "/docs/faq#tips", description: "Pro tips untuk hasil maksimal" },
      { title: "Kontak Support", href: "/docs/faq#support", description: "Cara menghubungi tim support" },
    ]
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-primary/10 dark:bg-primary/20 ring-1 ring-primary/20">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Panduan & Tutorial
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Pelajari cara memaksimalkan JobMate untuk sukses dalam pencarian kerja Anda
        </p>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Mulai Cepat", href: "/docs/quick-start", icon: Rocket, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Career VIP", href: "/docs/career-vip/lowongan", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Tools Premium", href: "/docs/tools/cv-ats", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "FAQ", href: "/docs/faq", icon: HelpCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="group p-4 rounded-xl border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {docsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;

          return (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (sectionIndex * 0.1) }}
            >
              <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 overflow-hidden">
                <CardHeader className="border-b border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-white dark:bg-white/5 shadow-sm ring-1 ring-black/5 dark:ring-white/10`}>
                      <SectionIcon className={`w-6 h-6 ${section.color.replace('600', '500')}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">{section.title}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.items.map((item: any, itemIndex: number) => {
                      const ItemIcon = item.icon;

                      return (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          className="group p-4 rounded-xl border border-transparent hover:border-primary/20 bg-white/50 dark:bg-white/5 hover:bg-primary/5 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3">
                            {ItemIcon && (
                              <div className="p-2 rounded-lg bg-background dark:bg-black/20 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                                <ItemIcon className="w-4 h-4" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0 pt-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors truncate">
                                  {item.title}
                                </h4>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 mt-2" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          );
        })}
      </div>

      {/* Help CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-12 text-center"
      >
        <Card className="border-0 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 ring-1 ring-primary/20">
          <CardContent className="p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />

            <h3 className="text-2xl sm:text-3xl font-bold mb-3">Masih Butuh Bantuan?</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Tim support kami siap membantu Anda 24/7 untuk memastikan pengalaman terbaik Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all hover:scale-105 font-bold shadow-lg shadow-primary/25"
              >
                <MessageSquareText className="w-5 h-5" />
                Chat dengan Admin
              </Link>
              <Link
                href="/docs/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background/50 dark:bg-white/5 border border-primary/20 rounded-xl hover:bg-primary/5 transition-all hover:scale-105 font-bold backdrop-blur-sm"
              >
                <BookMarked className="w-5 h-5" />
                Lihat FAQ
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
