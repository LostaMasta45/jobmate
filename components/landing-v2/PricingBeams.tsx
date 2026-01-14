"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PricingBeams = () => {
  return (
    <section id="pricing" className="py-32 bg-black text-white relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Investasi Kecil, <br /> <span className="text-brand">Hasil Seumur Hidup</span>
          </motion.h2>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Pilih paket yang sesuai. Upgrade karirmu ke level berikutnya sekarang juga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-white/10 bg-neutral-900/30 backdrop-blur-sm rounded-3xl p-10 flex flex-col relative group hover:border-white/20 transition-all hover:-translate-y-2"
          >
            <div className="mb-8">
              <h3 className="text-xl font-medium text-neutral-300 mb-2">VIP Basic</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-base text-neutral-500 line-through mr-2">Rp 19.000</span>
                <span className="text-4xl font-bold text-white">Rp 10.000</span>
                <span className="text-neutral-500">/bulan</span>
              </div>
              <div className="inline-block bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded mb-4 font-bold">-47%</div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Cocok buat kamu yang baru mulai cari kerja.
              </p>
            </div>

            <div className="space-y-5 mb-10 flex-1">
              {[
                "Grup WA Career VIP InfoLokerJombang",
                "Web Job Portal VIP",
                "Bonus Template CV ATS-friendly",
                "Update lowongan harian",
                "Info verified & terpercaya"
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                    <Check className="w-3 h-3 text-neutral-400" />
                  </div>
                  {feat}
                </div>
              ))}
            </div>

            <Link href="/payment">
              <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 text-white h-12 font-medium">
                Pilih Basic
              </Button>
            </Link>
          </motion.div>

          {/* Premium Plan (Highlighted) */}
          <div className="relative group">
            {/* Rotating Border Beam */}
            <div className="absolute -inset-[2px] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#00acc7_100%)] blur-xl animate-spin-slow opacity-100" />
            </div>

            {/* Background Glow Beams */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-brand/30 to-purple-600/30 blur-[100px] -z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-700" />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative border border-white/10 bg-neutral-950/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 flex flex-col shadow-2xl"
            >
              {/* Subtle Metallic Texture Overlay */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay rounded-3xl" />

              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-auto max-w-[95%] bg-gradient-to-r from-amber-400 to-orange-500 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-sm font-extrabold shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-1.5 sm:gap-2 tracking-wide z-20 whitespace-nowrap">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4 fill-black flex-shrink-0" />
                <span>BEST VALUE</span>
              </div>

              <div className="mb-8 pt-4 sm:pt-2 relative z-10 text-center sm:text-left">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow-sm">VIP Premium</h3>
                <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-1 sm:gap-2 mb-2 sm:mb-1 justify-center sm:justify-start">
                  <span className="text-lg text-neutral-500 line-through">Rp 99.000</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Rp 39.000</span>
                    <span className="text-amber-400 font-bold text-xs bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20 sm:ml-2">LIFETIME</span>
                  </div>
                </div>
                <div className="inline-block bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded mb-4 font-bold border border-red-500/20">-60%</div>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Investasi sekali bayar untuk akses penuh ke semua tools canggih JobMate selamanya.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10 flex-1 relative z-10">
                {[
                  "Semua fitur VIP Basic",
                  "CV ATS Generator",
                  "Template Surat Lamaran & Email",
                  "Job Application Tracker (Kanban)",
                  "Interview Checklist & Panduan HRD",
                  "Skill-Based Resume Generator",
                  "WhatsApp Message Generator",
                  "Merge & Convert PDF Tools",
                  "Profile Builder",
                  "Akses Seumur Hidup"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-white group/item">
                    <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-1 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)] flex-shrink-0">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                    <span className="group-hover/item:text-amber-100 transition-colors">{feat}</span>
                  </div>
                ))}
              </div>

              <Link href="/payment">
                <Button className="relative w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-[length:200%_auto] text-black font-extrabold h-14 text-lg overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] transition-all hover:scale-[1.02]">
                  <span className="relative z-10">Gabung Premium Sekarang 🚀</span>
                </Button>
              </Link>

              <p className="text-center text-xs text-neutral-500 mt-4">
                Garansi uang kembali 30 hari jika tidak puas.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
