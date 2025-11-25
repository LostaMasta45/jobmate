"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Briefcase, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const UserSegmentation = () => {
  const [activeTab, setActiveTab] = useState<"fresh" | "pro">("fresh");

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-brand/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Siapa Kamu?</h2>
          <p className="text-neutral-400">Pilih statusmu untuk melihat solusi yang tepat.</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-full inline-flex relative">
            <motion.div
              className="absolute top-1 bottom-1 rounded-full bg-brand"
              initial={false}
              animate={{
                left: activeTab === "fresh" ? "4px" : "50%",
                width: "calc(50% - 4px)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setActiveTab("fresh")}
              className={cn(
                "relative z-10 px-6 py-3 rounded-full flex items-center gap-2 transition-colors min-w-[160px] justify-center",
                activeTab === "fresh" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
              )}
            >
              <User className="w-4 h-4" />
              Fresh Graduate
            </button>
            <button
              onClick={() => setActiveTab("pro")}
              className={cn(
                "relative z-10 px-6 py-3 rounded-full flex items-center gap-2 transition-colors min-w-[160px] justify-center",
                activeTab === "pro" ? "text-white font-bold" : "text-neutral-400 hover:text-white"
              )}
            >
              <Briefcase className="w-4 h-4" />
              Sudah Kerja
            </button>
          </div>
        </div>

        {/* Content Cards */}
        <div className="relative min-h-[400px]">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 items-center bg-neutral-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm"
            >
                {activeTab === "fresh" ? (
                    <>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                                <Sparkles className="w-4 h-4" />
                                Solusi Pemula
                            </div>
                            <h3 className="text-3xl font-bold text-white">Bingung Mulai Darimana?</h3>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Jangan takut. Kami bimbing kamu dari nol sampai dapat kerja pertama.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Template CV Fresh Grad (Tanpa Pengalaman)",
                                    "Panduan Interview Dasar & Grooming",
                                    "Skill-based Resume Generator"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
                             <div className="text-center p-6">
                                 <div className="text-6xl mb-4">🎓</div>
                                 <p className="font-bold text-white text-xl">Siap Kerja Pertama!</p>
                             </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium border border-emerald-500/20">
                                <Briefcase className="w-4 h-4" />
                                Solusi Pro
                            </div>
                            <h3 className="text-3xl font-bold text-white">Mau Resign tapi Ragu?</h3>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Hemat waktumu. Biar kami yang filter loker valid dan gaji kompetitif buat kamu.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Filter Loker Valid & Verified",
                                    "Auto-Email Lamaran (Hemat Waktu)",
                                    "Info Gaji Transparan (jika tersedia)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-neutral-300">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative aspect-square md:aspect-[4/3] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
                             <div className="text-center p-6">
                                 <div className="text-6xl mb-4">💼</div>
                                 <p className="font-bold text-white text-xl">Upgrade Karir!</p>
                             </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
      </div>
    </section>
  );
};
