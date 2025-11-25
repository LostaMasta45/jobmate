"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { X, Check, TrendingUp, Clock } from "lucide-react";
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
    withTools: "15 menit/minggu",
    savings: "85%"
  },
  {
    task: "WA follow-up",
    manual: "20-30 menit",
    withTools: "2-5 menit",
    savings: "80%"
  },
];

export const ToolsComparisonCosmic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="comparison" ref={ref} className="py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Manual vs <span className="bg-gradient-to-r from-brand to-blue-500 bg-clip-text text-transparent">Autopilot</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Jangan habiskan waktu berhargamu untuk hal administratif. Fokus pada persiapan interview.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
            {/* Manual Card */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="bg-red-900/10 border border-red-500/20 rounded-3xl p-8 backdrop-blur-sm"
            >
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <X className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Cara Manual</h3>
                </div>

                <div className="space-y-6">
                    {comparisons.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-red-500/10 last:border-0">
                            <span className="text-neutral-400">{item.task}</span>
                            <span className="text-red-400 font-mono">{item.manual}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-red-500/20 text-center">
                    <p className="text-sm text-neutral-500 mb-2">Total Waktu Terbuang</p>
                    <p className="text-4xl font-bold text-red-500">10-15 Jam</p>
                    <p className="text-xs text-red-400/70 mt-1">per minggu</p>
                </div>
            </motion.div>

            {/* Tools Card */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-brand/10 to-blue-600/10 border border-brand/30 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden"
            >
                 <div className="absolute top-0 right-0 p-4">
                     <div className="bg-brand text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-brand/20">
                         RECOMMENDED
                     </div>
                 </div>

                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-brand/20 rounded-lg">
                        <Check className="w-6 h-6 text-brand" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Dengan JobMate</h3>
                </div>

                <div className="space-y-6">
                    {comparisons.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-brand/10 last:border-0">
                            <span className="text-white">{item.task}</span>
                            <div className="text-right">
                                <span className="text-brand font-mono block">{item.withTools}</span>
                                <span className="text-[10px] text-green-400">Hemat {item.savings}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-brand/20 text-center">
                    <p className="text-sm text-neutral-400 mb-2">Total Waktu Dibutuhkan</p>
                    <p className="text-4xl font-bold text-brand">1-2 Jam</p>
                    <p className="text-xs text-brand/70 mt-1">per minggu</p>
                </div>
            </motion.div>
        </div>

        {/* ROI Calculation */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto bg-neutral-900 rounded-3xl p-8 md:p-10 border border-white/10 text-center"
        >
            <div className="flex items-center justify-center gap-2 text-brand mb-4">
                <TrendingUp className="w-6 h-6" />
                <span className="font-bold tracking-wide">ROI CALCULATOR</span>
            </div>
            
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-8">
                Berapa Harga Waktumu?
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/5 rounded-2xl p-6">
                    <p className="text-neutral-400 text-sm mb-2">Biaya Langganan (Lifetime)</p>
                    <p className="text-3xl font-bold text-white">Rp 39.000</p>
                </div>
                 <div className="bg-white/5 rounded-2xl p-6">
                    <p className="text-neutral-400 text-sm mb-2">Waktu Hemat / Tahun</p>
                    <p className="text-3xl font-bold text-white">~500 Jam</p>
                </div>
            </div>

            <div className="bg-gradient-to-r from-brand to-blue-600 rounded-2xl p-8 shadow-xl shadow-brand/10">
                <p className="text-blue-100 mb-2">Jika waktumu dihargai Rp 50.000/jam, kamu hemat:</p>
                <p className="text-4xl md:text-6xl font-bold text-white tracking-tight">Rp 25.000.000</p>
                <p className="text-sm text-white/80 mt-2">per tahun hanya dengan Rp 39.000</p>
            </div>

            <div className="mt-8">
                <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-200 font-bold rounded-full px-8 h-12">
                    <a href="#pricing">Investasi Rp 39.000 Sekarang</a>
                </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
