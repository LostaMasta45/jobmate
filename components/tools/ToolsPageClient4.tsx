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
  ArrowRight,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface ToolsPageClientProps {
  userName: string;
}

interface Tool {
  id: string;
  name: string;
  shortName: string;
  href: string;
  icon: any;
  description: string;
  category: "cv" | "interview" | "application" | "utility";
  gradient: string;
  iconColor: string;
  stats: string;
}

const tools: Tool[] = [
  {
    id: "cv-ats",
    name: "CV ATS Generator",
    shortName: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileText,
    description: "Buat CV standar ATS otomatis.",
    category: "cv",
    gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    stats: "Auto Format"
  },
  {
    id: "interview",
    name: "Interview Prep",
    shortName: "Interview",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    description: "Latihan interview dengan AI.",
    category: "interview",
    gradient: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    stats: "AI Coach"
  },
  {
    id: "tracker",
    name: "Job Tracker",
    shortName: "Tracker",
    href: "/tools/tracker",
    icon: Target,
    description: "Kelola status lamaran kerja.",
    category: "utility",
    gradient: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20",
    iconColor: "text-amber-600 dark:text-amber-400",
    stats: "Kanban"
  },
  {
    id: "cv-creative",
    name: "Creative CV",
    shortName: "Creative",
    href: "/tools/cv-creative",
    icon: Palette,
    description: "Template desain CV modern.",
    category: "cv",
    gradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    stats: "Premium"
  },
  {
    id: "email",
    name: "Email Generator",
    shortName: "Email",
    href: "/tools/email-generator",
    icon: Mail,
    description: "Buat body email lamaran.",
    category: "interview",
    gradient: "from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    stats: "Instant"
  },
  {
    id: "whatsapp",
    name: "WA Templates",
    shortName: "WhatsApp",
    href: "/tools/wa-generator",
    icon: Send,
    description: "Template chat ke HRD.",
    category: "interview",
    gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    stats: "Ready"
  },
  {
    id: "surat",
    name: "Surat Lamaran",
    shortName: "Surat",
    href: "/tools/surat-lamaran",
    icon: FileEdit,
    description: "Cover letter Bahasa Indonesia.",
    category: "application",
    gradient: "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    stats: "Formal"
  },
  {
    id: "cover",
    name: "English Cover",
    shortName: "Cover Letter",
    href: "/tools/cover-letter",
    icon: FilePlus,
    description: "English cover letter builder.",
    category: "application",
    gradient: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    stats: "Global"
  },
  {
    id: "pdf",
    name: "PDF Tools",
    shortName: "PDF Tools",
    href: "/tools/pdf-tools",
    icon: FileImage,
    description: "Merge & compress PDF.",
    category: "utility",
    gradient: "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    stats: "Utils"
  }
];

const categories = [
  { id: "all", name: "Overview" },
  { id: "cv", name: "Resume" },
  { id: "interview", name: "Interview" },
  { id: "application", name: "Application" },
  { id: "utility", name: "Utility" },
];

export function ToolsPageClient4({ userName }: ToolsPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-gray-900 dark:text-white font-sans pb-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              Tools
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Empower your career with AI.
            </p>
          </div>

          {/* Refined Search Bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <Input 
              type="text"
              placeholder="Search..."
              className="pl-8 h-12 bg-transparent border-0 border-b border-gray-200 dark:border-gray-800 rounded-none px-0 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white transition-all text-base placeholder:text-gray-300 dark:placeholder:text-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Clean Tabs */}
        <div className="flex flex-wrap gap-8 mb-12 border-b border-gray-100 dark:border-gray-900/50 pb-px">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "text-sm font-medium transition-all pb-4 relative",
                selectedCategory === category.id
                  ? "text-black dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div 
                  layoutId="activeTabLine"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-black dark:bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Hybrid Grid: Mobile Icons + Modern Card Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50 bg-white dark:bg-[#0F0F10] hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-gray-100/50 dark:hover:shadow-none group-hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Subtle Gradient Background on Hover */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
                    tool.gradient
                  )} />

                  <div className="relative z-10 flex items-start gap-5">
                    {/* Icon - Mobile Style but Integrated */}
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gray-50 dark:bg-gray-900/50 group-hover:bg-white/80 dark:group-hover:bg-black/20 transition-colors backdrop-blur-sm shadow-sm",
                    )}>
                      <Icon className={cn("w-7 h-7 transition-transform duration-300 group-hover:scale-110", tool.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                          {tool.name}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                        {tool.description}
                      </p>

                      {/* Mini Stats Pill */}
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group-hover:bg-white/50 dark:group-hover:bg-white/5 transition-colors">
                        <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          {tool.stats}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 dark:text-gray-600">No tools found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
