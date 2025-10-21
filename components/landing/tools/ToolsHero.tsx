"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Users, Clock } from "lucide-react";

export function ToolsHero() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-950/20 dark:via-blue-950/20 dark:to-purple-950/20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            6 Tools Premium + 5 Tools Baru Segera Hadir
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              6 Tools JobMate Premium
            </span>
            <br />
            Autopilot Mode Cari Kerja
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Hemat <strong className="text-foreground">10-15 jam setiap minggu</strong> dengan 6 tools essential yang bikin proses cari kerja lebih cepat dan profesional
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
              <a href="#tools" className="flex items-center gap-2">
                Lihat Semua Tools
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#pricing">Upgrade Premium</a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl sm:text-3xl font-bold">1.2K+</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-2xl sm:text-3xl font-bold">6</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Core Tools</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-2xl sm:text-3xl font-bold">10-15</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Hours Saved/Week</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
