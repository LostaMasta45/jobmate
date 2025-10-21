"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

export function LandingHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-amber-50 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/30 dark:bg-amber-800/20 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">Dipercaya 203.000+ Pencari Kerja</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6"
            >
              <span className="text-foreground">STOP BUANG WAKTU</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                CARI LOKER
              </span>
              <br />
              <span className="text-foreground">YANG GAK JELAS!</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Kini Kamu <strong className="text-foreground">NGGAK PERLU CAPEK</strong> scroll IG, FB, Telegram, atau platform lain.
              <br className="hidden sm:block" />
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Semua loker valid & update setiap hari
              </span>{" "}
              langsung dikirim ke{" "}
              <strong className="text-foreground">GRUP WA PREMIUM!</strong>
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <a href="#pricing" className="flex items-center justify-center gap-2">
                  Gabung Sekarang
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 rounded-xl font-semibold border-2 hover:bg-accent"
              >
                <a href="#tools" className="flex items-center justify-center">Lihat Fitur Tools</a>
              </Button>
            </motion.div>

            {/* Mobile Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="lg:hidden mt-8 mb-6 relative w-full max-w-md mx-auto aspect-square"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/ilustrasi.png"
                  alt="InfoLokerJombang - Platform Pencari Kerja Terpercaya"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 400px, 0px"
                  priority
                />
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl">✅</span>
                <span>Info Valid</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl">⚡</span>
                <span>Update Harian</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl">🎯</span>
                <span>Mudah Daftar</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Illustration Image */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/ilustrasi.png"
                  alt="InfoLokerJombang - Platform Pencari Kerja Terpercaya"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 0px, 500px"
                  priority
                />
              </div>
              
              {/* Floating notification badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 -left-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap hidden xl:block"
              >
                <span className="text-green-600">✓</span> 5 Loker Baru Hari Ini
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-8 -right-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap hidden xl:block"
              >
                <span className="text-amber-600">⭐</span> Trusted Platform
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
