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
  TrendingUp,
  Zap,
  Award,
  Rocket,
  ChevronRight,
  Sparkles,
  Clock,
  Star
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
      <div className="lg:hidden space-y-4 sm:space-y-5 pb-24">
        {/* Hero Section - Gradient Purple/Cyan - Fully Responsive */}
        <div className="bg-gradient-to-br from-[#8e68fd] via-[#5547d0] to-[#3977d3] dark:from-[#5547d0] dark:via-[#3977d3] dark:to-[#00acc7] -mx-4 sm:-mx-6 px-4 sm:px-6 pt-6 sm:pt-8 pb-5 sm:pb-6 shadow-lg">
          <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 leading-tight">
                {getGreeting()} 👋
              </h1>
              <p className="text-white/90 text-sm sm:text-base truncate">
                {userName}
              </p>
            </div>

            {/* Quick Stats - Pills - Responsive */}
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0 border border-white/30">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">{tools.length} Tools</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0 border border-white/30">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">AI Powered</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex-shrink-0 border border-white/30">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white whitespace-nowrap">Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Carousel - Responsive */}
        <div className="px-4 sm:px-6">
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex-shrink-0 transition-all",
                    isActive
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{category.name}</span>
                  {category.id === "all" && isActive && (
                    <Badge variant="secondary" className="ml-1 bg-white/30 text-white text-[10px] px-1.5 py-0 border-0">
                      {tools.length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Popular Tools - Horizontal Scroll - Responsive */}
        {selectedCategory === "all" && (
          <div className="space-y-2.5 sm:space-y-3">
            <div className="flex items-center justify-between px-4 sm:px-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-1.5 sm:gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span>Populer</span>
              </h2>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-[10px] sm:text-xs">
                Top {popularTools.length}
              </Badge>
            </div>
            
            <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 px-4 sm:px-6 scrollbar-hide">
              {popularTools.map((tool, index) => {
                const Icon = tool.icon;
                
                return (
                  <Link key={tool.id} href={tool.href}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-[260px] sm:w-[280px] flex-shrink-0"
                    >
                      <Card className="border-0 bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transition-all overflow-hidden">
                        <div className={cn("h-2", tool.bgColor)} />
                        <div className="p-3.5 sm:p-4">
                          <div className="flex items-start gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
                            <div className={cn("w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0", tool.bgColor)}>
                              <Icon className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-tight">
                                {tool.name}
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {tool.features.slice(0, 2).map((feature, i) => (
                              <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* All Tools Grid - Mobile Optimized & Responsive */}
        <div className="px-4 sm:px-6 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate mr-2">
              {selectedCategory === "all" ? "Semua Tools" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
              {filteredTools.length} tools
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              
              return (
                <Link key={tool.id} href={tool.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
                      <div className="p-3.5 sm:p-4 flex items-start gap-3 sm:gap-4">
                        <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0", tool.bgColor)}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight">
                              {tool.name}
                            </h3>
                            {tool.popular && (
                              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2.5 sm:mb-3 line-clamp-2 leading-snug">
                            {tool.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {tool.features.map((feature, i) => (
                              <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 self-center" />
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tips Card - Mobile - Responsive */}
        <div className="px-4 sm:px-6">
          <Card className="border-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 p-4 sm:p-5 shadow-lg">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Rocket className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 sm:mb-2 leading-tight">
                  💡 Tips Sukses
                </h3>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                  Gunakan <span className="font-bold">CV ATS</span> untuk melamar online, 
                  <span className="font-bold"> CV Creative</span> untuk industri kreatif, dan 
                  <span className="font-bold"> Interview Prep</span> untuk persiapan wawancara!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ============================================ */}
      {/* DESKTOP VERSION - Professional Web Style */}
      {/* ============================================ */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-8 py-12 space-y-8">
          {/* Desktop Hero - Wide */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {getGreeting()}, {userName} 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Pilih tools yang Anda butuhkan untuk perjalanan karir Anda
              </p>
            </div>

            {/* Stats - Desktop */}
            <div className="flex gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl px-6 py-3 flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{tools.length}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Tools</p>
                </div>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl px-6 py-3 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">AI</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Powered</p>
                </div>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl px-6 py-3 flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">Free</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300">Forever</p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs - Desktop */}
          <div className="flex gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all",
                    isActive
                      ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                      : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{category.name}</span>
                  {category.id === "all" && (
                    <Badge variant="secondary" className={cn(
                      "ml-1 text-[10px] px-2 py-0 border-0",
                      isActive ? "bg-white/30 text-white" : "bg-gray-100 dark:bg-gray-800"
                    )}>
                      {tools.length}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tools Grid - Desktop 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              
              return (
                <Link key={tool.id} href={tool.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all h-full group">
                      <div className={cn("h-2", tool.bgColor)} />
                      <div className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110", tool.bgColor)}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {tool.name}
                              </h3>
                              {tool.popular && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-[10px]">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                              {tool.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {tool.features.map((feature, i) => (
                                <span key={i} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Tips Card - Desktop */}
          <Card className="border-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 p-8 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  💡 Tips Sukses untuk Persiapan Karir
                </h3>
                <p className="text-base text-white/95 leading-relaxed">
                  Maksimalkan peluang karirmu! Gunakan <span className="font-bold">CV ATS</span> untuk melamar ke perusahaan besar (lolos screening otomatis), 
                  <span className="font-bold"> CV Creative</span> untuk industri kreatif dan startup, dan <span className="font-bold">Interview Prep</span> untuk 
                  persiapan wawancara yang lebih matang dan percaya diri!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
