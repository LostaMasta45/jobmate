"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  MessageSquare,
  Target,
  Palette,
  Mail,
  Send,
  FileEdit,
  FilePlus,
  FileImage,
  Briefcase,
  TrendingUp,
  Zap,
  Award,
  Rocket,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolsPageClientProps {
  userName: string;
}

interface Tool {
  id: string;
  name: string;
  shortName: string;
  href: string;
  icon: any;
  bgColor: string;
  iconColor: string;
  cardBgLight: string;
  cardBgDark: string;
  description: string;
  features: string[];
  category: "cv" | "interview" | "application" | "utility";
  popular?: boolean;
}

const tools: Tool[] = [
  {
    id: "cv-ats",
    name: "CV ATS",
    shortName: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileText,
    bgColor: "bg-blue-500",
    iconColor: "text-blue-600",
    cardBgLight: "bg-gradient-to-br from-blue-50 to-blue-100",
    cardBgDark: "dark:from-blue-950/50 dark:to-blue-900/30",
    description: "Buat CV yang ATS-Friendly untuk lolos sistem screening otomatis perusahaan",
    features: ["Format ATS-optimized", "Template profesional", "Keyword optimization"],
    category: "cv",
    popular: true
  },
  {
    id: "interview",
    name: "Interview Prep",
    shortName: "Interview",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    bgColor: "bg-green-500",
    iconColor: "text-green-600",
    cardBgLight: "bg-gradient-to-br from-green-50 to-green-100",
    cardBgDark: "dark:from-green-950/50 dark:to-green-900/30",
    description: "Persiapan interview dengan pertanyaan AI dan metode STAR untuk jawaban sempurna",
    features: ["Pertanyaan AI-generated", "Metode STAR", "Tips & tricks"],
    category: "interview",
    popular: true
  },
  {
    id: "tracker",
    name: "Job Tracker",
    shortName: "Tracker",
    href: "/tools/tracker",
    icon: Target,
    bgColor: "bg-amber-500",
    iconColor: "text-amber-600",
    cardBgLight: "bg-gradient-to-br from-amber-50 to-amber-100",
    cardBgDark: "dark:from-amber-950/50 dark:to-amber-900/30",
    description: "Kelola semua lamaran kerja dalam satu dashboard Kanban dengan status tracking",
    features: ["Kanban board", "Status tracking", "Follow-up reminder"],
    category: "utility",
    popular: true
  },
  {
    id: "cv-creative",
    name: "CV Creative",
    shortName: "CV Creative",
    href: "/tools/cv-creative",
    icon: Palette,
    bgColor: "bg-pink-500",
    iconColor: "text-pink-600",
    cardBgLight: "bg-gradient-to-br from-pink-50 to-pink-100",
    cardBgDark: "dark:from-pink-950/50 dark:to-pink-900/30",
    description: "Desain CV dengan template kreatif & modern untuk industri kreatif dan startup",
    features: ["Template colorful", "Design modern", "Export HD"],
    category: "cv"
  },
  {
    id: "email",
    name: "Email Generator",
    shortName: "Email",
    href: "/tools/email-generator",
    icon: Mail,
    bgColor: "bg-cyan-500",
    iconColor: "text-cyan-600",
    cardBgLight: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    cardBgDark: "dark:from-cyan-950/50 dark:to-cyan-900/30",
    description: "Generate email lamaran profesional dengan AI untuk melamar kerja via email",
    features: ["AI-powered", "Professional tone", "Copy-ready"],
    category: "interview"
  },
  {
    id: "whatsapp",
    name: "WhatsApp Template",
    shortName: "WhatsApp",
    href: "/tools/wa-generator",
    icon: Send,
    bgColor: "bg-emerald-500",
    iconColor: "text-emerald-600",
    cardBgLight: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    cardBgDark: "dark:from-emerald-950/50 dark:to-emerald-900/30",
    description: "Template pesan WhatsApp untuk follow-up lamaran atau kontak HRD dengan sopan",
    features: ["Template siap pakai", "Professional format", "Quick send"],
    category: "interview"
  },
  {
    id: "surat",
    name: "Surat Lamaran",
    shortName: "Surat",
    href: "/tools/surat-lamaran",
    icon: FileEdit,
    bgColor: "bg-purple-500",
    iconColor: "text-purple-600",
    cardBgLight: "bg-gradient-to-br from-purple-50 to-purple-100",
    cardBgDark: "dark:from-purple-950/50 dark:to-purple-900/30",
    description: "Buat surat lamaran formal Indonesia dengan berbagai template sesuai posisi",
    features: ["Template formal", "Bahasa profesional", "Export PDF/Word"],
    category: "application"
  },
  {
    id: "cover",
    name: "Cover Letter",
    shortName: "Cover",
    href: "/tools/cover-letter",
    icon: FilePlus,
    bgColor: "bg-indigo-500",
    iconColor: "text-indigo-600",
    cardBgLight: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    cardBgDark: "dark:from-indigo-950/50 dark:to-indigo-900/30",
    description: "Cover letter dalam bahasa Inggris untuk melamar ke perusahaan multinasional",
    features: ["English template", "Professional writing", "Customizable"],
    category: "application"
  },
  {
    id: "pdf",
    name: "PDF Tools",
    shortName: "PDF",
    href: "/tools/pdf-tools",
    icon: FileImage,
    bgColor: "bg-red-500",
    iconColor: "text-red-600",
    cardBgLight: "bg-gradient-to-br from-red-50 to-red-100",
    cardBgDark: "dark:from-red-950/50 dark:to-red-900/30",
    description: "Gabung, kompres, dan convert PDF untuk melampirkan dokumen lamaran kerja",
    features: ["Merge PDF", "Compress file", "Convert format"],
    category: "utility"
  }
];

const categories = [
  { id: "all", name: "Semua", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { id: "cv", name: "CV & Resume", icon: FileText, color: "from-blue-500 to-cyan-500" },
  { id: "interview", name: "Interview", icon: MessageSquare, color: "from-green-500 to-emerald-500" },
  { id: "application", name: "Lamaran", icon: FileEdit, color: "from-purple-500 to-indigo-500" },
  { id: "utility", name: "Utilities", icon: Target, color: "from-amber-500 to-orange-500" },
];

export function ToolsPageClient({ userName }: ToolsPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGreeting = () => {
    if (!mounted) return "Hi";
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Filter tools by category
  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter(t => t.category === selectedCategory);

  const popularTools = tools.filter(t => t.popular);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ============================================ */}
      {/* MOBILE VERSION - Native App Style */}
      {/* ============================================ */}
      <div className="lg:hidden space-y-5 pb-24">
        {/* Compact Hero - App Style */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          {/* Greeting */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getGreeting()} 👋
            </h1>
            <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
              {userName || "Job Seeker"}
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 flex-shrink-0">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">9 Tools</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 flex-shrink-0">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-100">95% Success</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-amber-100 dark:bg-amber-900/30 px-4 py-2 flex-shrink-0">
              <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">1K+ Users</span>
            </div>
          </div>
        </motion.div>

        {/* Featured Tool - App Store Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link href={featuredTool.href}>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800 p-6 shadow-lg hover:shadow-xl transition-shadow">
              {/* Decoration */}
              <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
              
              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 mb-3">
                  <Rocket className="h-3.5 w-3.5 text-white" />
                  <span className="text-xs font-bold text-white">FEATURED</span>
                </div>
                
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {featuredTool.name}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
                      {featuredTool.description}
                    </p>
                    
                    {/* Quick Features */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredTool.features.slice(0, 2).map((feature, i) => (
                        <span key={i} className="text-xs bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                    <featuredTool.icon className="h-8 w-8 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* CV & Resume Tools Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-blue-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              📄 CV & Resume
            </h2>
          </div>
          
          <div className="grid gap-3">
            {cvTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="border-0 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0", tool.bgColor)}>
                      <tool.icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tool.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Interview & Communication Tools Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-green-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              💬 Interview & Communication
            </h2>
          </div>
          
          <div className="grid gap-3">
            {interviewTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="border-0 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0", tool.bgColor)}>
                      <tool.icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tool.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Application Tools Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              📝 Application Letters
            </h2>
          </div>
          
          <div className="grid gap-3">
            {applicationTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="border-0 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0", tool.bgColor)}>
                      <tool.icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tool.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Utility Tools Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              🛠️ Utilities
            </h2>
          </div>
          
          <div className="grid gap-3">
            {utilityTools.map((tool) => (
              <Link key={tool.id} href={tool.href}>
                <Card className="border-0 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl flex-shrink-0", tool.bgColor)}>
                      <tool.icon className="h-7 w-7 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tool.features.slice(0, 2).map((feature, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Tips Card - Duolingo Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Card className="border-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 p-5 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-white/30 backdrop-blur-sm">
                <Rocket className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2">
                  💡 Tips Sukses
                </h3>
                <p className="text-sm leading-relaxed text-white/95">
                  Gunakan <span className="font-bold">CV ATS</span> untuk melamar online, <span className="font-bold">CV Creative</span> untuk industri kreatif, dan <span className="font-bold">Interview Prep</span> untuk persiapan wawancara yang lebih baik!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* DESKTOP VERSION - Wide Layout */}
      <div className="hidden lg:block px-8 py-8 pb-12 max-w-7xl mx-auto">
        {/* Desktop Hero - Horizontal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {getGreeting()} 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {userName || "Job Seeker"}
            </p>
          </div>
          
          {/* Quick Stats - Horizontal */}
          <div className="flex gap-3">
            <div className="flex items-center gap-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 px-6 py-3">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">9</p>
                <p className="text-xs text-blue-700 dark:text-blue-300">Tools</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-green-100 dark:bg-green-900/30 px-6 py-3">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">95%</p>
                <p className="text-xs text-green-700 dark:text-green-300">Success</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-amber-100 dark:bg-amber-900/30 px-6 py-3">
              <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">1K+</p>
                <p className="text-xs text-amber-700 dark:text-amber-300">Users</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop Featured Tool - Wide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <Link href={featuredTool.href}>
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-800 p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-white/5" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1 pr-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 mb-4">
                    <Rocket className="h-4 w-4 text-white" />
                    <span className="text-sm font-bold text-white">FEATURED TOOL</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3">
                    {featuredTool.name}
                  </h3>
                  <p className="text-lg text-white/90 leading-relaxed mb-4 max-w-2xl">
                    {featuredTool.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {featuredTool.features.map((feature, i) => (
                      <span key={i} className="text-sm bg-white/15 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm flex-shrink-0">
                  <featuredTool.icon className="h-12 w-12 text-white" strokeWidth={2} />
                </div>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Desktop Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* All Tools as Cards */}
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.05), duration: 0.5 }}
            >
              <Link href={tool.href}>
                <Card className="border-0 bg-white dark:bg-gray-900 p-6 shadow-sm hover:shadow-lg transition-all h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl flex-shrink-0", tool.bgColor)}>
                      <tool.icon className="h-8 w-8 text-white" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 p-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-white/30 backdrop-blur-sm">
                <Rocket className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  💡 Tips Sukses untuk Persiapan Karir
                </h3>
                <p className="text-base leading-relaxed text-white/95">
                  Maksimalkan peluang karirmu! Gunakan <span className="font-bold">CV ATS</span> untuk melamar ke perusahaan besar (lolos screening otomatis), 
                  <span className="font-bold"> CV Creative</span> untuk industri kreatif dan startup, dan <span className="font-bold">Interview Prep</span> untuk 
                  persiapan wawancara yang lebih matang dan percaya diri!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
