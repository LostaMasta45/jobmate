"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, X, Zap, Crown, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonData = [
  {
    feature: "Info Lowongan Kerja",
    free: { status: "partial", text: "Scroll sendiri di IG/FB" },
    basic: { status: true, text: "Langsung ke Grup WA" },
    premium: { status: true, text: "Langsung ke Grup WA" },
  },
  {
    feature: "Kualitas Info Loker",
    free: { status: false, text: "Banyak yang hoax" },
    basic: { status: true, text: "100% Valid & Verified" },
    premium: { status: true, text: "100% Valid & Verified" },
  },
  {
    feature: "Job Portal Khusus",
    free: { status: false, text: "Tidak ada" },
    basic: { status: true, text: "Web Portal VIP" },
    premium: { status: true, text: "Web Portal VIP" },
  },
  {
    feature: "Template CV",
    free: { status: false, text: "Cari sendiri" },
    basic: { status: "partial", text: "Template biasa" },
    premium: { status: true, text: "CV ATS Generator AI" },
  },
  {
    feature: "Surat Lamaran",
    free: { status: false, text: "Bikin manual" },
    basic: { status: false, text: "Tidak ada" },
    premium: { status: true, text: "Auto Generator + Template" },
  },
  {
    feature: "Application Tracker",
    free: { status: false, text: "Tracking manual" },
    basic: { status: false, text: "Manual" },
    premium: { status: true, text: "Kanban Board Otomatis" },
  },
  {
    feature: "Interview Guide",
    free: { status: false, text: "Cari sendiri" },
    basic: { status: false, text: "Tidak ada" },
    premium: { status: true, text: "Checklist & Panduan HRD" },
  },
  {
    feature: "Tools Produktivitas",
    free: { status: false, text: "Tidak ada" },
    basic: { status: false, text: "Tidak ada" },
    premium: { status: true, text: "8+ Tools Premium" },
  },
  {
    feature: "Biaya",
    free: { status: "neutral", text: "Gratis (tapi buang waktu)" },
    basic: { status: "neutral", text: "Rp 10K/bulan" },
    premium: { status: "neutral", text: "Rp 39K sekali bayar" },
  },
  {
    feature: "Hasil Akhir",
    free: { status: false, text: "Stress & Gak dipanggil 😫" },
    basic: { status: "partial", text: "Lebih mudah cari kerja ✅" },
    premium: { status: true, text: "AUTOPILOT MODE 🚀" },
  },
];

export function ComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            Pilih Cara Cari Kerja yang <span className="text-emerald-600">Lebih Smart</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Lihat sendiri perbedaannya. <span className="font-bold text-emerald-600 dark:text-emerald-400">Mana yang lebih bikin kamu cepat dapat kerja?</span>
          </p>
          
          {/* Toggle Button */}
          <Button
            onClick={() => setShowComparison(!showComparison)}
            variant="ghost"
            size="lg"
            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-semibold text-base sm:text-lg group transition-all"
          >
            {showComparison ? "Sembunyikan" : "Lihat"} Perbandingan Basic vs Premium
            <ChevronDown 
              className={`ml-2 w-5 h-5 transition-transform duration-300 ${
                showComparison ? "rotate-180" : ""
              }`}
            />
          </Button>
        </motion.div>

        {/* Comparison Content - Collapsible */}
        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile View - Cards */}
              <div className="lg:hidden space-y-6">
          {comparisonData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-background rounded-2xl p-4 shadow-lg border-2"
            >
              <h4 className="font-bold text-base mb-4 text-foreground">{item.feature}</h4>
              
              <div className="space-y-3">
                {/* Free */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                  <div className="flex-shrink-0">
                    {item.free.status === true && <Check className="w-5 h-5 text-emerald-600" />}
                    {item.free.status === false && <X className="w-5 h-5 text-rose-500" />}
                    {item.free.status === "partial" && <span className="text-amber-500">⚠️</span>}
                    {item.free.status === "neutral" && <span className="text-slate-500">•</span>}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">GRATIS</div>
                    <div className="text-sm text-muted-foreground">{item.free.text}</div>
                  </div>
                </div>

                {/* Basic */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                  <div className="flex-shrink-0">
                    {item.basic.status === true && <Check className="w-5 h-5 text-emerald-600" />}
                    {item.basic.status === false && <X className="w-5 h-5 text-rose-500" />}
                    {item.basic.status === "partial" && <span className="text-amber-500">⚠️</span>}
                    {item.basic.status === "neutral" && <span className="text-emerald-600">•</span>}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      VIP BASIC
                    </div>
                    <div className="text-sm text-foreground font-medium">{item.basic.text}</div>
                  </div>
                </div>

                {/* Premium */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-400 dark:border-amber-600">
                  <div className="flex-shrink-0">
                    {item.premium.status === true && <Check className="w-5 h-5 text-amber-600" />}
                    {item.premium.status === false && <X className="w-5 h-5 text-rose-500" />}
                    {item.premium.status === "partial" && <span className="text-amber-500">⚠️</span>}
                    {item.premium.status === "neutral" && <span className="text-amber-600">•</span>}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      VIP PREMIUM
                    </div>
                    <div className="text-sm text-foreground font-bold">{item.premium.text}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
              </div>

              {/* Desktop View - Table */}
              <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:block overflow-hidden rounded-3xl shadow-2xl border-2 border-slate-200 dark:border-slate-800"
        >
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <th className="p-6 text-left text-lg font-bold text-foreground w-1/4">
                  Fitur
                </th>
                <th className="p-6 text-center w-1/4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">CARA LAMA</div>
                  <div className="text-xl font-bold text-slate-700 dark:text-slate-300">Gratis</div>
                  <div className="text-xs text-slate-500 mt-1">(tapi buang waktu)</div>
                </th>
                <th className="p-6 text-center w-1/4 bg-emerald-50 dark:bg-emerald-950/20">
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4" />
                    VIP BASIC
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rp 10K</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">/bulan</div>
                </th>
                <th className="p-6 text-center w-1/4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-pulse">
                    ⭐ PALING LARIS
                  </div>
                  <div className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center justify-center gap-1 mt-2">
                    <Crown className="w-4 h-4" />
                    VIP PREMIUM
                  </div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">Rp 39K</div>
                  <div className="text-xs text-amber-600 dark:text-amber-500 mt-1">Sekali bayar (LIFETIME!)</div>
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {comparisonData.map((item, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className={`border-t border-slate-200 dark:border-slate-800 ${
                    index === comparisonData.length - 1 ? 'bg-slate-50 dark:bg-slate-900/50' : 'bg-background'
                  } hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors`}
                >
                  {/* Feature name */}
                  <td className="p-4 font-semibold text-sm text-foreground">
                    {item.feature}
                  </td>

                  {/* Free */}
                  <td className="p-4 text-center bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex flex-col items-center gap-2">
                      {item.free.status === true && <Check className="w-6 h-6 text-emerald-600" />}
                      {item.free.status === false && <X className="w-6 h-6 text-rose-500" />}
                      {item.free.status === "partial" && <span className="text-2xl">⚠️</span>}
                      {item.free.status === "neutral" && <span className="text-slate-500 text-xl">•</span>}
                      <span className="text-xs text-muted-foreground">{item.free.text}</span>
                    </div>
                  </td>

                  {/* Basic */}
                  <td className="p-4 text-center bg-emerald-50/50 dark:bg-emerald-950/10">
                    <div className="flex flex-col items-center gap-2">
                      {item.basic.status === true && <Check className="w-6 h-6 text-emerald-600" />}
                      {item.basic.status === false && <X className="w-6 h-6 text-rose-500" />}
                      {item.basic.status === "partial" && <span className="text-2xl">⚠️</span>}
                      {item.basic.status === "neutral" && <span className="text-emerald-600 text-xl">•</span>}
                      <span className="text-xs text-foreground font-medium">{item.basic.text}</span>
                    </div>
                  </td>

                  {/* Premium */}
                  <td className="p-4 text-center bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
                    <div className="flex flex-col items-center gap-2">
                      {item.premium.status === true && <Check className="w-6 h-6 text-amber-600" />}
                      {item.premium.status === false && <X className="w-6 h-6 text-rose-500" />}
                      {item.premium.status === "partial" && <span className="text-2xl">⚠️</span>}
                      {item.premium.status === "neutral" && <span className="text-amber-600 text-xl">•</span>}
                      <span className="text-xs text-foreground font-bold">{item.premium.text}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>

            {/* Footer CTA */}
            <tfoot>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <td className="p-6 font-bold text-lg">
                  Pilihan Kamu:
                </td>
                <td className="p-6 text-center">
                  <div className="text-sm text-muted-foreground italic">
                    Tetap stuck di tempat?
                  </div>
                </td>
                <td className="p-6 text-center">
                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <a href="#pricing">Pilih Basic →</a>
                  </Button>
                </td>
                <td className="p-6 text-center">
                  <Button
                    asChild
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
                  >
                    <a href="#pricing">Pilih Premium 🚀</a>
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            Sudah jelas kan bedanya? <span className="font-bold text-emerald-600 dark:text-emerald-400">Investasi kecil, hasil maksimal!</span>
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <a href="#pricing" className="flex items-center gap-2">
              Lihat Paket Lengkap
              <span className="text-xl">↓</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
