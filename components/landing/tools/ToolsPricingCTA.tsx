"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Crown, Sparkles, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const basicFeatures = [
  { text: "Grup WA Career VIP InfoLokerJombang", included: true },
  { text: "Web Job Portal VIP", included: true },
  { text: "Bonus Template CV ATS-friendly", included: true },
  { text: "Update lowongan harian", included: true },
  { text: "6 Tools Premium", included: false },
  { text: "5 Tools baru (coming soon)", included: false },
  { text: "Akses Seumur Hidup", included: false },
  { text: "Priority Support", included: false },
];

const premiumFeatures = [
  { text: "Semua fitur VIP Basic", included: true },
  { text: "✅ CV ATS Generator", included: true, highlight: true },
  { text: "✅ Email Lamaran Generator", included: true, highlight: true },
  { text: "✅ Job Application Tracker", included: true, highlight: true },
  { text: "✅ Surat Lamaran Generator", included: true, highlight: true },
  { text: "✅ WhatsApp Generator", included: true, highlight: true },
  { text: "✅ PDF Tools Suite", included: true, highlight: true },
  { text: "🔜 5 Tools baru (Q1-Q2 2026)", included: true, highlight: true },
  { text: "Akses Seumur Hidup", included: true },
  { text: "Priority Support", included: true },
  { text: "Export Unlimited", included: true },
  { text: "Update selamanya", included: true },
];

export function ToolsPricingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="pricing" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Investasi Kecil, <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Hasil Maksimal</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Pilih paket yang sesuai dengan kebutuhan karirmu
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {/* VIP Basic */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-background rounded-2xl sm:rounded-3xl p-6 lg:p-8 shadow-lg border-2 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all"
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold">VIP Basic</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-600">
                  Rp 10K
                </span>
                <span className="text-base text-muted-foreground">/bulan</span>
              </div>
              <p className="text-sm text-muted-foreground">
                💬 Cocok buat kamu yang baru mulai cari kerja
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {basicFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  {feature.included ? (
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground/50 line-through'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <a href="/payment?plan=basic">Mulai dengan Basic</a>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Perpanjangan otomatis setiap bulan
            </p>
          </motion.div>

          {/* VIP Premium - RECOMMENDED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-2xl sm:rounded-3xl p-6 lg:p-8 shadow-2xl border-2 border-emerald-500 md:scale-105"
          >
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-1 text-sm font-semibold">
                ⭐ REKOMENDASI
              </Badge>
            </div>

            <div className="mb-6 mt-2">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl font-bold">VIP Premium</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Rp 39K
                </span>
                <span className="text-base text-muted-foreground">lifetime</span>
              </div>
              <p className="text-sm font-semibold text-emerald-600">
                🎯 Bayar sekali, pakai selamanya!
              </p>
            </div>

            <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className={`text-sm ${feature.highlight ? 'font-semibold text-foreground' : ''}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 text-center">
                💰 Hemat Rp 25 JUTA nilai waktu per tahun!
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold"
            >
              <a href="/payment?plan=premium">Upgrade ke Premium Sekarang</a>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Akses selamanya, tanpa perpanjangan
            </p>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Shield className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-semibold">Garansi 7 Hari</h4>
              <p className="text-sm text-muted-foreground">
                Uang kembali 100% jika tidak puas
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">⭐</div>
              <h4 className="font-semibold">4.8/5 Rating</h4>
              <p className="text-sm text-muted-foreground">
                Dari 1.200+ pengguna aktif
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🔒</div>
              <h4 className="font-semibold">Pembayaran Aman</h4>
              <p className="text-sm text-muted-foreground">
                Data terlindungi & terenkripsi
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
