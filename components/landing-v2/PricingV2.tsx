"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PricingV2 = () => {
  return (
    <section id="pricing" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-bold mb-4">Investasi Kecil, <span className="text-brand">Hasil Besar</span></h2>
           <p className="text-neutral-400">Pilih paket yang sesuai dengan target karirmu.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
           {/* Basic Plan */}
           <div className="border border-white/10 bg-white/5 rounded-3xl p-8 flex flex-col relative group hover:border-white/20 transition-colors">
              <div className="mb-6">
                  <h3 className="text-xl font-medium text-neutral-300 mb-2">VIP Basic</h3>
                  <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Rp 10k</span>
                      <span className="text-neutral-500">/bulan</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">Cukup untuk update info loker harian.</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                  {["Akses Grup WA VIP", "Info Loker Valid Harian", "Job Portal Basic"].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                          <Check className="w-4 h-4 text-neutral-500" />
                          {feat}
                      </div>
                  ))}
              </div>

              <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 text-white">
                  Pilih Basic
              </Button>
           </div>

           {/* Premium Plan (Highlighted) */}
           <div className="border border-brand/50 bg-black rounded-3xl p-8 flex flex-col relative shadow-[0_0_50px_-12px_rgba(0,172,199,0.3)]">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  BEST VALUE
              </div>

              <div className="mb-6">
                  <h3 className="text-xl font-medium text-brand mb-2">VIP Premium</h3>
                  <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">Rp 39k</span>
                      <span className="text-brand font-bold text-lg bg-brand/10 px-2 py-0.5 rounded ml-2">LIFETIME</span>
                  </div>
                  <p className="text-sm text-neutral-500 mt-2">Sekali bayar, akses semua tools selamanya.</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                  {[
                      "Semua Fitur Basic", 
                      "CV ATS Generator (Unlimited)", 
                      "Auto Cover Letter & Email", 
                      "Application Tracker",
                      "Interview Guide & Checklist"
                  ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-medium text-white">
                          <div className="bg-brand/20 p-1 rounded-full">
                             <Check className="w-3 h-3 text-brand" />
                          </div>
                          {feat}
                      </div>
                  ))}
              </div>

              <Button className="w-full rounded-xl bg-brand hover:bg-brand-600 text-white shadow-lg shadow-brand/25 h-12 text-base">
                  Ambil Promo Lifetime 🚀
              </Button>
           </div>
        </div>
      </div>
    </section>
  );
};
