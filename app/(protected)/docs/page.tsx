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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Mulai Cepat", href: "/docs/quick-start", icon: Rocket, color: "emerald" },
            { label: "Career VIP", href: "/docs/career-vip/lowongan", icon: Briefcase, color: "blue" },
            { label: "Tools Premium", href: "/docs/tools/cv-ats", icon: Sparkles, color: "purple" },
            { label: "FAQ", href: "/docs/faq", icon: HelpCircle, color: "orange" },
          ].map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`group p-4 rounded-xl border-2 border-${item.color}-200 dark:border-${item.color}-800 bg-${item.color}-50 dark:bg-${item.color}-950/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                <span className="font-semibold group-hover:text-primary transition-colors">
                  {item.label}
                </span>
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <Card className="border-2 hover:shadow-xl transition-all duration-300">
                  <CardHeader className={section.bgColor}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm`}>
                        <SectionIcon className={`w-6 h-6 ${section.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{section.title}</CardTitle>
                        <CardDescription className="text-base">
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
                            className="group p-4 rounded-lg border hover:border-primary hover:bg-accent transition-all duration-200 hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              {ItemIcon && (
                                <ItemIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold group-hover:text-primary transition-colors truncate">
                                    {item.title}
                                  </h4>
                                  {item.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {item.description}
                                </p>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
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
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-2">Masih Butuh Bantuan?</h3>
              <p className="text-muted-foreground mb-6">
                Tim support kami siap membantu Anda 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="https://t.me/jobmate_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
                >
                  💬 Chat dengan Admin
                </Link>
                <Link
                  href="/docs/faq"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
                >
                  📚 Lihat FAQ
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
