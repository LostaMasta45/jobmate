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
  Search,
  ChevronRight,
  Info,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
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
  bgColor: string; // Tailwind bg color class for the icon container
  iconColor: string; // Tailwind text color class
  description: string;
  longDescription: string;
  category: "cv" | "interview" | "application" | "utility";
  popular?: boolean;
  gradient: string; // New gradient field for the icon background
  features: string[];
}

const tools: Tool[] = [
  {
    id: "cv-ats",
    name: "CV ATS Generator",
    shortName: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileText,
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    gradient: "from-[#4facfe] to-[#00f2fe]",
    description: "Buat CV ATS-Friendly",
    longDescription: "Sistem pembuat CV otomatis yang dioptimalkan untuk Application Tracking System (ATS). Tingkatkan peluang lolos screening dengan format yang disukai HRD.",
    category: "cv",
    popular: true,
    features: ["ATS Friendly", "Auto-Format", "PDF Export"]
  },
  {
    id: "interview",
    name: "Interview Preparation",
    shortName: "Interview",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    bgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    gradient: "from-[#43e97b] to-[#38f9d7]",
    description: "Latihan Interview AI",
    longDescription: "Simulasi wawancara kerja dengan AI. Dapatkan pertanyaan spesifik sesuai posisi dan feedback instan untuk jawaban Anda menggunakan metode STAR.",
    category: "interview",
    popular: true,
    features: ["AI Simulation", "STAR Method", "Instant Feedback"]
  },
  {
    id: "tracker",
    name: "Job Application Tracker",
    shortName: "Tracker",
    href: "/tools/tracker",
    icon: Target,
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    gradient: "from-[#f6d365] to-[#fda085]",
    description: "Kelola Lamaran Kerja",
    longDescription: "Dashboard Kanban untuk melacak status setiap lamaran kerja Anda. Jangan pernah lupa jadwal interview atau follow-up lagi.",
    category: "utility",
    popular: true,
    features: ["Kanban Board", "Reminders", "Progress Stats"]
  },
  {
    id: "cv-creative",
    name: "Creative CV Builder",
    shortName: "Creative",
    href: "/tools/cv-creative",
    icon: Palette,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    iconColor: "text-pink-600 dark:text-pink-400",
    gradient: "from-[#fa709a] to-[#fee140]",
    description: "Desain CV Modern",
    longDescription: "Template CV visual yang menarik untuk industri kreatif. Tampil beda dan tunjukkan personalitas Anda melalui desain yang profesional.",
    category: "cv",
    features: ["Modern Design", "Custom Colors", "Visual Appeal"]
  },
  {
    id: "email",
    name: "Email Generator",
    shortName: "Email",
    href: "/tools/email-generator",
    icon: Mail,
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    gradient: "from-[#4facfe] to-[#00f2fe]",
    description: "Buat Email Lamaran",
    longDescription: "Generator body email otomatis untuk melamar kerja. Pastikan etika dan struktur bahasa email Anda profesional dan menarik.",
    category: "interview",
    features: ["Professional Tone", "Templates", "One-click Copy"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp Templates",
    shortName: "WhatsApp",
    href: "/tools/wa-generator",
    icon: Send,
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    gradient: "from-[#0ba360] to-[#3cba92]",
    description: "Template Chat HRD",
    longDescription: "Kumpulan template pesan WhatsApp sopan untuk menghubungi HRD, follow-up lamaran, atau menanyakan status aplikasi.",
    category: "interview",
    features: ["Ready-to-use", "Professional", "Various Scenarios"]
  },
  {
    id: "surat",
    name: "Surat Lamaran Kerja",
    shortName: "Surat",
    href: "/tools/surat-lamaran",
    icon: FileEdit,
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    gradient: "from-[#667eea] to-[#764ba2]",
    description: "Template Surat Lamaran",
    longDescription: "Buat surat lamaran kerja formal (Cover Letter) dalam Bahasa Indonesia yang baik dan benar. Tersedia berbagai template untuk fresh grad hingga pro.",
    category: "application",
    features: ["Indonesian Standard", "Formal Format", "Easy Edit"]
  },
  {
    id: "cover",
    name: "English Cover Letter",
    shortName: "Cover Letter",
    href: "/tools/cover-letter",
    icon: FilePlus,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    gradient: "from-[#30cfd0] to-[#330867]",
    description: "English Cover Letter",
    longDescription: "Buat Cover Letter bahasa Inggris profesional untuk melamar ke perusahaan multinasional atau startup global.",
    category: "application",
    features: ["English Templates", "Global Standard", "Professional"]
  },
  {
    id: "pdf",
    name: "PDF Utilities",
    shortName: "PDF Tools",
    href: "/tools/pdf-tools",
    icon: FileImage,
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    gradient: "from-[#ff0844] to-[#ffb199]",
    description: "Edit & Convert PDF",
    longDescription: "Alat serbaguna untuk menggabungkan, memisahkan, atau mengompres file PDF lamaran Anda agar sesuai dengan batas ukuran upload.",
    category: "utility",
    features: ["Merge", "Compress", "Convert"]
  }
];

const categories = [
  { id: "all", name: "All Apps" },
  { id: "cv", name: "CV & Resume" },
  { id: "interview", name: "Interview" },
  { id: "application", name: "Lamaran" },
  { id: "utility", name: "Tools" },
];

export function ToolsPageClient2({ userName }: ToolsPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter tools
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] to-[#E8ECF2] dark:from-black dark:to-[#121212] text-gray-900 dark:text-white pb-24 font-sans selection:bg-blue-500/20">
      {/* Decorative Background Elements for Light Mode */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-200/30 blur-[100px] mix-blend-multiply dark:hidden" />
        <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-200/30 blur-[100px] mix-blend-multiply dark:hidden" />
        <div className="absolute bottom-[10%] right-[20%] w-[50%] h-[50%] rounded-full bg-amber-100/40 blur-[100px] mix-blend-multiply dark:hidden" />
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 relative z-10">
        
        {/* Header - Glassmorphism Card Style */}
        <div className="mb-8 relative">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              Tools Library
            </h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">
              Enhance your career journey with AI power.
            </p>
          </div>
        </div>

        {/* Search - iOS Style with Better Shadow/Blur */}
        <div className="relative mb-8 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <Input 
            type="text"
            placeholder="Search for tools..."
            className="pl-10 h-12 bg-white/80 dark:bg-[#1C1C1E] backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-none rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/20 text-base placeholder:text-slate-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Pills - Improved Light Mode Contrast */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "px-4 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm hover:shadow-md active:scale-95 border",
                selectedCategory === category.id
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white shadow-lg shadow-slate-900/20"
                  : "bg-white/80 dark:bg-[#1C1C1E] text-slate-600 dark:text-gray-400 border-transparent hover:bg-white dark:hover:bg-[#2C2C2E]"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Grid Layout - Native Mobile App Style */}
        <div className="grid grid-cols-4 gap-y-8 gap-x-4 mb-12">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href} className="group flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="relative flex flex-col items-center w-full"
                >
                  {/* App Icon Container - Super Minimalist "Squircle" */}
                  <div className="relative mb-3 group-active:scale-95 transition-transform duration-200">
                    {/* Icon Background with Super Soft Gradient & Shadow */}
                    <div 
                      className={cn(
                        "w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-[22px] flex items-center justify-center relative overflow-hidden",
                        "shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
                        "border-[1px] border-white/20 dark:border-white/5",
                        `bg-gradient-to-br ${tool.gradient}`
                      )}
                    >
                      {/* Glass Reflection Overlay - Subtle */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 opacity-100 pointer-events-none" />
                      
                      {/* Inner Icon - Clean & White */}
                      <Icon className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] text-white drop-shadow-sm relative z-10 stroke-[1.5px]" />
                    </div>
                  </div>
                  
                  {/* App Label - Clean Typography */}
                  <span className="text-[11px] sm:text-xs font-medium text-center text-slate-600 dark:text-slate-300 leading-tight px-0.5 w-full truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {tool.shortName}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-gray-800 to-transparent mb-10" />

        {/* Detailed List Section - Card Style */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Info className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Tool Guides
            </h2>
          </div>

          <div className="space-y-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={tool.id} 
                  className="bg-white/70 dark:bg-[#1C1C1E] backdrop-blur-md rounded-3xl p-5 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.1)] border border-white/50 dark:border-gray-800/50 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm", tool.bgColor)}>
                      <Icon className={cn("w-7 h-7", tool.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <Link href={tool.href} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-gray-800 text-slate-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed mb-3.5 line-clamp-2">
                        {tool.longDescription}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((feature, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="bg-slate-100/80 dark:bg-gray-800 text-slate-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700 shadow-none font-medium text-[10px] px-2.5 py-0.5"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tools found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
}
