"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  PenTool,
  MessageSquare,
  Palette,
  Target,
  FileImage,
  Mail,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  Clock,
  Star,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ToolsPageClientProps {
  userName: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: any;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
  category: "popular" | "creative" | "productivity";
  badge?: string;
}

const tools: Tool[] = [
  // Popular Tools
  {
    id: "cv-ats",
    name: "CV ATS-Friendly",
    description: "Buat CV yang lolos ATS sistem",
    href: "/tools/cv-ats",
    icon: FileText,
    color: "bg-blue-500",
    gradientFrom: "from-blue-500",
    gradientTo: "to-blue-600",
    iconColor: "text-blue-600",
    category: "popular",
    badge: "Paling Populer"
  },
  {
    id: "interview",
    name: "Interview Prep",
    description: "Persiapan interview kerja",
    href: "/tools/interview-prep",
    icon: MessageSquare,
    color: "bg-green-500",
    gradientFrom: "from-green-500",
    gradientTo: "to-emerald-600",
    iconColor: "text-green-600",
    category: "popular"
  },
  {
    id: "tracker",
    name: "Job Tracker",
    description: "Track lamaran kerjamu",
    href: "/tools/tracker",
    icon: Target,
    color: "bg-amber-500",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
    iconColor: "text-amber-600",
    category: "popular"
  },
  
  // Creative Tools
  {
    id: "cv-creative",
    name: "CV Creative",
    description: "Desain CV yang unik & menarik",
    href: "/tools/cv-creative",
    icon: Palette,
    color: "bg-pink-500",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    iconColor: "text-pink-600",
    category: "creative",
    badge: "Terbaru"
  },
  {
    id: "surat-lamaran",
    name: "Surat Lamaran",
    description: "Generator surat lamaran profesional",
    href: "/tools/surat-lamaran",
    icon: PenTool,
    color: "bg-purple-500",
    gradientFrom: "from-purple-500",
    gradientTo: "to-purple-600",
    iconColor: "text-purple-600",
    category: "creative"
  },
  
  // Productivity Tools
  {
    id: "email",
    name: "Email Generator",
    description: "Buat email profesional cepat",
    href: "/tools/email-generator",
    icon: Mail,
    color: "bg-cyan-500",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    iconColor: "text-cyan-600",
    category: "productivity"
  },
  {
    id: "wa",
    name: "WhatsApp Generator",
    description: "Template pesan WhatsApp",
    href: "/tools/wa-generator",
    icon: Users,
    color: "bg-emerald-500",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    iconColor: "text-emerald-600",
    category: "productivity"
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Merge, split & convert PDF",
    href: "/tools/pdf-tools",
    icon: FileImage,
    color: "bg-red-500",
    gradientFrom: "from-red-500",
    gradientTo: "to-orange-600",
    iconColor: "text-red-600",
    category: "productivity"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

export function ToolsPageClient({ userName }: ToolsPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [greeting, setGreeting] = useState<string>("Halo"); // Default greeting to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  const popularTools = tools.filter(t => t.category === "popular");
  const creativeTools = tools.filter(t => t.category === "creative");
  const productivityTools = tools.filter(t => t.category === "productivity");

  // Client-side only greeting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        
        {/* Hero Section with Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 dark:border-primary/30 shadow-xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 dark:from-primary/20 dark:via-purple-500/20 dark:to-pink-500/20 p-6 sm:p-8"
        >
          {/* Animated background blobs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/30 dark:bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mb-4 border border-gray-200/50 dark:border-gray-700/50"
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {greeting}, {userName}
              </span>
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Toolbox Karir
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              Pilih tools untuk membuat CV, surat lamaran, dan persiapan interview
            </p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          <Card className="border border-blue-100 dark:border-blue-900/30 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{tools.length}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Tools</p>
            </CardContent>
          </Card>
          
          <Card className="border border-emerald-100 dark:border-emerald-900/30 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2m</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Avg Time</p>
            </CardContent>
          </Card>
          
          <Card className="border border-amber-100 dark:border-amber-900/30 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
            <CardContent className="p-4 text-center">
              <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Popular Tools */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paling Populer</h2>
            </div>
          </div>
          
          <div className="grid gap-3">
            {popularTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link href={tool.href}>
                    <Card className="group relative overflow-hidden border border-gray-200/80 dark:border-gray-800/50 shadow-lg hover:shadow-2xl transition-all duration-300 active:scale-[0.98] bg-white dark:bg-gray-900">
                      {/* Gradient background on hover */}
                      <div className={cn(
                        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                        `bg-gradient-to-br ${tool.gradientFrom} ${tool.gradientTo}`
                      )} />
                      
                      <CardContent className="relative p-4 flex items-center gap-4">
                        {/* Icon Container */}
                        <motion.div
                          className={cn(
                            "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center",
                            "bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-300",
                            tool.gradientFrom,
                            tool.gradientTo
                          )}
                          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                        </motion.div>
                        
                        {/* Tool Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors">
                              {tool.name}
                            </h3>
                            {tool.badge && (
                              <Badge className="text-[10px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">
                                {tool.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors">
                            {tool.description}
                          </p>
                        </div>
                        
                        {/* Arrow Icon */}
                        <motion.div
                          className="flex-shrink-0"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Creative Tools */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Creative Tools</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {creativeTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link href={tool.href}>
                    <Card className="group relative overflow-hidden border border-gray-200/80 dark:border-gray-800/50 shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.97] h-full bg-white dark:bg-gray-900">
                      <CardContent className="p-4 space-y-3">
                        <motion.div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            "bg-gradient-to-br shadow-md group-hover:shadow-lg transition-all",
                            tool.gradientFrom,
                            tool.gradientTo
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </motion.div>
                        
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Productivity Tools */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Produktivitas</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {productivityTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link href={tool.href}>
                    <Card className="group relative overflow-hidden border border-gray-200/80 dark:border-gray-800/50 shadow-md hover:shadow-xl transition-all duration-300 active:scale-[0.98] bg-white dark:bg-gray-900">
                      <CardContent className="p-4 flex items-center gap-3">
                        <motion.div
                          className={cn(
                            "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center",
                            "bg-gradient-to-br shadow-md group-hover:shadow-lg transition-all",
                            tool.gradientFrom,
                            tool.gradientTo
                          )}
                          whileHover={{ scale: 1.1 }}
                        >
                          <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {tool.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {tool.description}
                          </p>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border border-primary/20 dark:border-primary/30 shadow-md bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  💡 Tips Pro
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Kombinasikan beberapa tools untuk hasil maksimal! Misalnya: CV ATS + Interview Prep untuk persiapan lengkap.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
