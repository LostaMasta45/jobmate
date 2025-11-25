"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Crown, Shield, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const basicFeatures = [
  { text: "Grup WA InfoLoker VIP", included: true },
  { text: "Web Job Portal VIP", included: true },
  { text: "Bonus Template CV ATS-friendly", included: true },
  { text: "Update lowongan harian", included: true },
  { text: "6 Tools Premium", included: false },
  { text: "5 Tools baru (coming soon)", included: false },
  { text: "Akses Seumur Hidup", included: false },
];

const premiumFeatures = [
  { text: "Semua fitur VIP Basic", included: true },
  { text: "✅ 6 Tools Premium (CV, Email, dll)", included: true, highlight: true },
  { text: "🔜 5 Tools baru (Roadmap 2026)", included: true, highlight: true },
  { text: "Akses Seumur Hidup (Lifetime)", included: true },
  { text: "Priority Support Admin", included: true },
  { text: "Export Unlimited", included: true },
  { text: "Update selamanya gratis", included: true },
];

export const ToolsPricingCTACosmic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" ref={ref} className="py-24 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Investasi Kecil, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-blue-500">Hasil Maksimal</span>
          </motion.h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan karirmu.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative"
          >
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles className="w-5 h-5 text-emerald-500" />
                 <h3 className="text-xl font-bold text-white">VIP Basic</h3>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                 <span className="text-4xl font-bold text-white">Rp 10K</span>
                 <span className="text-neutral-500">/bulan</span>
              </div>
              <p className="text-sm text-neutral-400">Cocok buat coba-coba pantau loker.</p>
            </div>

            <div className="space-y-4 mb-8">
               {basicFeatures.map((feature, idx) => (
                 <div key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <X className="w-5 h-5 text-neutral-700 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-neutral-300' : 'text-neutral-700 line-through'}`}>
                        {feature.text}
                    </span>
                 </div>
               ))}
            </div>

            <Button asChild className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                <a href="/payment?plan=basic">Mulai Basic</a>
            </Button>
            <p className="text-xs text-center text-neutral-600 mt-4">Perpanjang otomatis setiap bulan</p>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative bg-gradient-to-b from-neutral-900 to-black border border-brand/50 rounded-3xl p-8 shadow-2xl shadow-brand/10 md:scale-105 z-10"
          >
             {/* Badge */}
             <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                 <Badge className="bg-gradient-to-r from-brand to-blue-600 text-white px-4 py-1 border-0 shadow-lg">
                     ⭐ BEST VALUE
                 </Badge>
             </div>

             <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-6 h-6 text-brand" />
                    <h3 className="text-xl font-bold text-white">VIP Premium</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-brand to-blue-500 bg-clip-text text-transparent">Rp 39K</span>
                    <span className="text-neutral-400">lifetime</span>
                </div>
                <p className="text-sm text-brand font-semibold">Bayar sekali, akses selamanya!</p>
             </div>

             <div className="space-y-4 mb-8">
                {premiumFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="p-0.5 bg-brand/20 rounded-full mt-0.5">
                            <Check className="w-3 h-3 text-brand" />
                        </div>
                        <span className={`text-sm ${feature.highlight ? 'text-white font-medium' : 'text-neutral-300'}`}>
                            {feature.text}
                        </span>
                    </div>
                ))}
             </div>

             <div className="bg-brand/10 border border-brand/20 rounded-xl p-4 mb-8 text-center">
                 <p className="text-brand font-bold text-sm">💰 Hemat Rp 25 JUTA nilai waktu per tahun!</p>
             </div>

             <Button asChild className="w-full h-12 bg-gradient-to-r from-brand to-blue-600 hover:from-brand-600 hover:to-blue-700 text-white font-bold shadow-lg shadow-brand/25">
                 <a href="/payment?plan=premium">Ambil Premium Lifetime</a>
             </Button>
             <p className="text-xs text-center text-neutral-500 mt-4">Tanpa biaya langganan bulanan</p>
          </motion.div>
        </div>

        {/* Trust Elements */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 text-center max-w-3xl mx-auto text-neutral-400"
        >
            <div className="flex flex-col items-center gap-2">
                <Shield className="w-6 h-6 text-brand" />
                <span className="text-sm">Garansi 7 Hari</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-sm">4.8/5 Rating</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-neutral-600 flex items-center justify-center text-xs">🔒</div>
                <span className="text-sm">Secure Payment</span>
            </div>
        </motion.div>
      </div>
    </section>
  );
};
