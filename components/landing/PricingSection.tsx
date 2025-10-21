"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Crown } from "lucide-react";

const basicFeatures = [
  "Grup WA Career VIP InfoLokerJombang",
  "Web Job Portal VIP",
  "Bonus Template CV ATS-friendly",
  "Update lowongan harian",
  "Info verified & terpercaya",
];

const premiumFeatures = [
  "Semua fitur VIP Basic",
  "CV ATS Generator",
  "Template Surat Lamaran & Email",
  "Job Application Tracker (Kanban)",
  "Interview Checklist & Panduan HRD",
  "Skill-Based Resume Generator",
  "WhatsApp Message Generator",
  "Merge & Convert PDF Tools",
  "Profile Builder",
  "Akses Seumur Hidup",
];

export function PricingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="pricing" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Pilih Paket yang Cocok Untukmu
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Investasi kecil untuk masa depan karirmu yang lebih cerah
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
          {/* VIP Basic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-background rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-lg border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:-translate-y-1 mt-8 sm:mt-10"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold">VIP Basic</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-600">
                  Rp 10.000
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">/bulan</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                💬 <em>Cocok buat kamu yang baru mulai cari kerja</em>
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm sm:text-base py-5 sm:py-6"
            >
              <a href="/vip?plan=basic" className="flex items-center justify-center">Mulai dengan Basic</a>
            </Button>

            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
              Perpanjangan otomatis setiap bulan
            </p>
          </motion.div>

          {/* VIP Premium - RECOMMENDED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border-2 border-amber-400 dark:border-amber-600 hover:-translate-y-2 transition-all mt-8 sm:mt-10"
          >
            {/* Recommended Badge */}
            <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-lg border-0 animate-pulse">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 inline" />
                Rekomendasi Admin
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold">VIP Premium</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-600">
                  Rp 39.000
                </span>
                <span className="text-sm sm:text-base text-muted-foreground">Lifetime</span>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                💬 <em>Sekali bayar, selamanya akses!</em>
              </p>
            </div>

            <div className="space-y-2.5 sm:space-y-3 mb-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm lg:text-base font-medium leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-3 sm:p-4 mb-6">
              <p className="text-xs sm:text-sm font-semibold text-center leading-relaxed">
                🔥 "Setara 1 nasi goreng + es teh,<br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                tapi hasilnya peluang kerja seumur hidup!"
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm sm:text-base py-5 sm:py-6 shadow-lg"
            >
              <a href="/vip?plan=premium" className="flex items-center justify-center">
                Ambil Premium Sekarang! 🚀
              </a>
            </Button>

            <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4 leading-relaxed">
              ✨ Sekali bayar, akses selamanya. Tanpa biaya bulanan!
            </p>
          </motion.div>
        </div>

        {/* Comparison Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-6 max-w-2xl border border-blue-200 dark:border-blue-900">
            <p className="text-sm sm:text-base text-muted-foreground mb-2">
              💡 <strong className="text-foreground">Tips dari Admin:</strong>
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kalau kamu serius cari kerja dan butuh tools lengkap (CV, Email, Tracker),
              ambil <strong className="text-amber-600">VIP Premium</strong>.
              Hemat biaya bulanan dan dapat semua fitur selamanya!
            </p>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            <span>Pembayaran Aman</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>Aktif Instan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💯</span>
            <span>Garansi Uang Kembali</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
