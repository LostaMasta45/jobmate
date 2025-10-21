"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisons = [
  {
    task: "Bikin CV",
    manual: "2-3 jam",
    withTools: "5-10 menit",
    savings: "95%"
  },
  {
    task: "Email lamaran",
    manual: "30-60 menit",
    withTools: "2-5 menit",
    savings: "90%"
  },
  {
    task: "Surat lamaran",
    manual: "1-2 jam",
    withTools: "10-15 menit",
    savings: "85%"
  },
  {
    task: "Track aplikasi",
    manual: "1-2 jam/minggu",
    withTools: "10-15 menit/minggu",
    savings: "85%"
  },
  {
    task: "WA follow-up",
    manual: "20-30 menit",
    withTools: "2-5 menit",
    savings: "80%"
  },
  {
    task: "Merge dokumen",
    manual: "30-60 menit",
    withTools: "1-2 menit",
    savings: "95%"
  },
];

export function ToolsComparison() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="comparison" ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Manual vs <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">With 6 Tools</span>
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Lihat seberapa banyak waktu yang bisa kamu hemat dengan tools JobMate
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Manual Column */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-6">
                <X className="w-6 h-6 text-red-600" />
                <h3 className="text-xl font-bold text-red-600">Cara Manual</h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-red-200 dark:border-red-800/50">
                    <span className="text-sm font-medium">{item.task}</span>
                    <span className="text-sm text-red-600 font-semibold">{item.manual}</span>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total per minggu:</p>
                    <p className="text-3xl font-bold text-red-600">10-15 Jam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* With Tools Column */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-6">
                <Check className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-bold text-emerald-600">Dengan 6 Tools</h3>
              </div>
              <div className="space-y-4">
                {comparisons.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-emerald-200 dark:border-emerald-800/50">
                    <span className="text-sm font-medium">{item.task}</span>
                    <div className="text-right">
                      <span className="text-sm text-emerald-600 font-semibold">{item.withTools}</span>
                      <span className="text-xs text-emerald-600 ml-2">(↓{item.savings})</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total per minggu:</p>
                    <p className="text-3xl font-bold text-emerald-600">1-2 Jam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-8">
            <ArrowRight className="w-8 h-8 text-emerald-600" />
          </div>

          {/* ROI Calculation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 lg:p-12 text-white text-center"
          >
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold mb-6">ROI Calculator</h3>
            
            <div className="grid sm:grid-cols-3 gap-6 mb-8 text-left">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Hemat per minggu</p>
                <p className="text-2xl font-bold">8-13 Jam</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Hemat per tahun</p>
                <p className="text-2xl font-bold">~500 Jam</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-sm text-blue-100 mb-1">Investment</p>
                <p className="text-2xl font-bold">Rp 39K</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-xl p-6 mb-6">
              <p className="text-lg mb-2">Cost per hour (tahun pertama):</p>
              <p className="text-4xl font-bold mb-2">Rp 78/jam</p>
              <p className="text-sm text-blue-100">Rp 39.000 ÷ 500 jam = Rp 78/jam</p>
            </div>

            <div className="bg-yellow-400 text-yellow-900 rounded-xl p-6 mb-6">
              <p className="text-lg mb-2">Kalau waktu dihargai Rp 50.000/jam:</p>
              <p className="text-5xl font-bold mb-2">Rp 25 JUTA</p>
              <p className="text-sm">Nilai waktu yang dihemat per tahun!</p>
            </div>

            <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-blue-50 font-semibold">
              <a href="#pricing">Mulai Hemat Sekarang → Rp 39K Lifetime</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
