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
  Sparkles,
  Zap
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
  description: string;
  category: "cv" | "interview" | "application" | "utility";
  color: string; // Main accent color
  stats: string;
}

const tools: Tool[] = [
  {
    id: "cv-ats",
    name: "CV ATS Generator",
    shortName: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileText,
    description: "Lolos screening otomatis dengan format standar industri.",
    category: "cv",
    color: "blue",
    stats: "95% Success Rate"
  },
  {
    id: "interview",
    name: "Interview Prep",
    shortName: "Interview",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    description: "Simulasi AI dengan feedback realtime.",
    category: "interview",
    color: "emerald",
    stats: "50+ Scenarios"
  },
  {
    id: "tracker",
    name: "Job Tracker",
    shortName: "Tracker",
    href: "/tools/tracker",
    icon: Target,
    description: "Pantau status lamaran dalam satu dashboard.",
    category: "utility",
    color: "amber",
    stats: "Kanban Board"
  },
  {
    id: "cv-creative",
    name: "Creative CV",
    shortName: "Creative",
    href: "/tools/cv-creative",
    icon: Palette,
    description: "Tampil beda untuk industri kreatif.",
    category: "cv",
    color: "pink",
    stats: "Premium Templates"
  },
  {
    id: "email",
    name: "Email Writer",
    shortName: "Email",
    href: "/tools/email-generator",
    icon: Mail,
    description: "Tulis email lamaran profesional instan.",
    category: "interview",
    color: "cyan",
    stats: "Auto-Generated"
  },
  {
    id: "whatsapp",
    name: "WA Templates",
    shortName: "WhatsApp",
    href: "/tools/wa-generator",
    icon: Send,
    description: "Chat HRD dengan sopan dan profesional.",
    category: "interview",
    color: "green",
    stats: "Quick Copy"
  },
  {
    id: "surat",
    name: "Surat Lamaran",
    shortName: "Surat",
    href: "/tools/surat-lamaran",
    icon: FileEdit,
    description: "Cover letter bahasa Indonesia formal.",
    category: "application",
    color: "purple",
    stats: "Standard Format"
  },
  {
    id: "cover",
    name: "English Cover",
    shortName: "Cover Letter",
    href: "/tools/cover-letter",
    icon: FilePlus,
    description: "Professional English cover letters.",
    category: "application",
    color: "indigo",
    stats: "Global Ready"
  },
  {
    id: "pdf",
    name: "PDF Tools",
    shortName: "PDF Tools",
    href: "/tools/pdf-tools",
    icon: FileImage,
    description: "Merge, compress, dan convert file PDF.",
    category: "utility",
    color: "red",
    stats: "All-in-One"
  }
];

const categories = [
  { id: "all", name: "All" },
  { id: "cv", name: "Resume" },
  { id: "interview", name: "Interview" },
  { id: "application", name: "Cover Letter" },
  { id: "utility", name: "Utils" },
];

export function ToolsPageClient3({ userName }: ToolsPageClientProps) {
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

  // Helper for dynamic colors
  const getColorClasses = (color: string) => {
    const map: Record<string, string> = {
      blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 border-blue-200 dark:border-blue-800/50",
      emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50",
      amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 border-amber-200 dark:border-amber-800/50",
      pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/40 border-pink-200 dark:border-pink-800/50",
      cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/40 border-cyan-200 dark:border-cyan-800/50",
      green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/40 border-green-200 dark:border-green-800/50",
      purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 border-purple-200 dark:border-purple-800/50",
      indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800/50",
      red: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 border-red-200 dark:border-red-800/50",
    };
    return map[color] || map.blue;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-white pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Modern Clean Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-900 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
              <Sparkles className="w-3 h-3" />
              <span>JobMate Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Explore. Create. <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Get Hired.</span>
            </h1>
          </div>

          {/* Search with minimalist line design */}
          <div className="relative w-full md:w-72 group">
            <Input 
              type="text"
              placeholder="Search tools..."
              className="bg-transparent border-0 border-b-2 border-gray-200 dark:border-gray-800 rounded-none px-0 py-6 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white transition-colors text-lg placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
          </div>
        </div>

        {/* Minimalist Tabs */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-gray-100 dark:border-gray-800 pb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-black dark:hover:text-white relative py-1",
                selectedCategory === category.id
                  ? "text-black dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              )}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-[25px] left-0 right-0 h-0.5 bg-black dark:bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => {
            const Icon = tool.icon;
            const colorClass = getColorClasses(tool.color);

            return (
              <Link key={tool.id} href={tool.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <div className="group h-full relative bg-gray-50 dark:bg-[#121212] rounded-[32px] p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-800">
                    
                    {/* Background Blob for Hover Effect */}
                    <div className={cn(
                      "absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none",
                      `bg-${tool.color}-500`
                    )} />

                    <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                      <div className="flex items-start justify-between">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors",
                          colorClass
                        )}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-200 dark:border-gray-800 rounded-full px-3 py-1">
                            {tool.category}
                           </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:underline decoration-2 underline-offset-4">
                          {tool.name}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-gray-800/50">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          <Zap className="w-3.5 h-3.5 text-yellow-500" />
                          {tool.stats}
                        </div>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all -mr-2 opacity-0 group-hover:opacity-100 group-hover:mr-0",
                          colorClass
                        )}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[32px]">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tools found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
