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
  Rocket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

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
    features: ["Format ATS-optimized", "Template profesional", "Keyword optimization"]
  },
  {
    id: "interview",
    name: "Interview",
    shortName: "Interview",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    bgColor: "bg-green-500",
    iconColor: "text-green-600",
    cardBgLight: "bg-gradient-to-br from-green-50 to-green-100",
    cardBgDark: "dark:from-green-950/50 dark:to-green-900/30",
    description: "Persiapan interview dengan pertanyaan AI dan metode STAR untuk jawaban sempurna",
    features: ["Pertanyaan AI-generated", "Metode STAR", "Tips & tricks"]
  },
  {
    id: "tracker",
    name: "Tracker",
    shortName: "Tracker",
    href: "/tools/tracker",
    icon: Target,
    bgColor: "bg-amber-500",
    iconColor: "text-amber-600",
    cardBgLight: "bg-gradient-to-br from-amber-50 to-amber-100",
    cardBgDark: "dark:from-amber-950/50 dark:to-amber-900/30",
    description: "Kelola semua lamaran kerja dalam satu dashboard Kanban dengan status tracking",
    features: ["Kanban board", "Status tracking", "Follow-up reminder"]
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
    features: ["Template colorful", "Design modern", "Export HD"]
  },
  {
    id: "email",
    name: "Email",
    shortName: "Email",
    href: "/tools/email-generator",
    icon: Mail,
    bgColor: "bg-cyan-500",
    iconColor: "text-cyan-600",
    cardBgLight: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    cardBgDark: "dark:from-cyan-950/50 dark:to-cyan-900/30",
    description: "Generate email lamaran profesional dengan AI untuk melamar kerja via email",
    features: ["AI-powered", "Professional tone", "Copy-ready"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    shortName: "WhatsApp",
    href: "/tools/wa-generator",
    icon: Send,
    bgColor: "bg-emerald-500",
    iconColor: "text-emerald-600",
    cardBgLight: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    cardBgDark: "dark:from-emerald-950/50 dark:to-emerald-900/30",
    description: "Template pesan WhatsApp untuk follow-up lamaran atau kontak HRD dengan sopan",
    features: ["Template siap pakai", "Professional format", "Quick send"]
  },
  {
    id: "surat",
    name: "Surat",
    shortName: "Surat",
    href: "/tools/surat-lamaran",
    icon: FileEdit,
    bgColor: "bg-purple-500",
    iconColor: "text-purple-600",
    cardBgLight: "bg-gradient-to-br from-purple-50 to-purple-100",
    cardBgDark: "dark:from-purple-950/50 dark:to-purple-900/30",
    description: "Buat surat lamaran formal Indonesia dengan berbagai template sesuai posisi",
    features: ["Template formal", "Bahasa profesional", "Export PDF/Word"]
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
    features: ["English template", "Professional writing", "Customizable"]
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
    features: ["Merge PDF", "Compress file", "Convert format"]
  }
];

export function ToolsPageClient({ userName }: ToolsPageClientProps) {
  const [mounted, setMounted] = useState(false);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-md space-y-4 p-4 pb-24">
        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-blue-700 p-6 shadow-lg">
            {/* Subtle decoration */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
            
            <div className="relative z-10 space-y-3">
              {/* Greeting */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-white/90">
                  {getGreeting()} 👋
                </span>
              </div>
              
              {/* Main Title */}
              <h1 className="text-2xl font-bold text-white">
                {userName || "Job Seeker"}
              </h1>
              
              {/* Hero Title */}
              <div className="mt-4 rounded-2xl bg-white/15 p-4 backdrop-blur-xl border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      JOB READY 2025 🚀
                    </h2>
                    <p className="mt-1 text-sm text-white/90">
                      Siapkan karir impianmu
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <Briefcase className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-3 gap-3"
        >
          {/* Tools Count */}
          <Card className="border-0 bg-white p-3.5 text-center shadow-sm dark:bg-gray-900">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500">
                <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">9</p>
              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Tools</p>
            </div>
          </Card>

          {/* Success Rate */}
          <Card className="border-0 bg-white p-3.5 text-center shadow-sm dark:bg-gray-900">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500">
                <TrendingUp className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">95%</p>
              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Success</p>
            </div>
          </Card>

          {/* Users */}
          <Card className="border-0 bg-white p-3.5 text-center shadow-sm dark:bg-gray-900">
            <div className="flex flex-col items-center gap-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
                <Award className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">1K+</p>
              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Users</p>
            </div>
          </Card>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="pt-2"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tools Karir
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Pilih tools untuk memulai
          </p>
        </motion.div>

        {/* Tools Grid 3x3 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={itemVariants}>
              <Link href={tool.href}>
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Card className="border-0 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md dark:bg-gray-900">
                    <div className="flex flex-col items-center gap-2.5 text-center">
                      {/* Icon Container - Solid Color */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={cn(
                          "flex h-14 w-14 items-center justify-center rounded-2xl transition-all",
                          tool.bgColor
                        )}
                      >
                        <tool.icon 
                          className="h-7 w-7 text-white" 
                          strokeWidth={2}
                        />
                      </motion.div>
                      
                      {/* Tool Name */}
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {tool.shortName}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Tool Descriptions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="space-y-3"
        >
          {/* Section Header */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Apa itu setiap tool?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Penjelasan detail fungsi setiap tool
            </p>
          </div>

          {/* Tool Description Cards */}
          <div className="space-y-2">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.05), duration: 0.3 }}
              >
                <Card className="border-0 bg-white p-3.5 shadow-sm dark:bg-gray-900">
                  <div className="flex items-start gap-3">
                    {/* Icon - Solid Color */}
                    <div className={cn(
                      "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl",
                      tool.bgColor
                    )}>
                      <tool.icon 
                        className="h-6 w-6 text-white" 
                        strokeWidth={2}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Tool Name */}
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                        {tool.name}
                      </h4>
                      
                      {/* Description */}
                      <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        {tool.description}
                      </p>

                      {/* Features */}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {tool.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          >
                            • {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5 }}
        >
          <Card className="border-0 bg-blue-500 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20">
                <Rocket className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">
                  💡 Tips Sukses
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/90">
                  Gunakan CV ATS untuk melamar online, CV Creative untuk industri kreatif, dan Interview Prep untuk persiapan wawancara.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
