"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, AlertTriangle, FileX } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Buang Waktu 2-3 Jam per CV",
    description: "Buat CV manual pakai Word, format berantakan, gak ATS-friendly.",
    gradient: "from-red-500/20 to-rose-500/20",
    iconColor: "text-red-500",
  },
  {
    icon: AlertTriangle,
    title: "Lupa Track Aplikasi",
    description: "Apply ke 20+ perusahaan, lupa mana yang sudah interview atau belum.",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500",
  },
  {
    icon: FileX,
    title: "Dokumen Gak Profesional",
    description: "Surat lamaran copy-paste, email gak sopan, dokumen PDF berantakan.",
    gradient: "from-yellow-500/20 to-lime-500/20",
    iconColor: "text-yellow-500",
  },
];

export const ProblemSectionCosmic = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-neutral-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Cari Kerja Manual = <span className="text-red-500">Buang Waktu</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-neutral-400 text-lg max-w-2xl mx-auto"
          >
            Tanpa sistem yang rapi, kamu bisa kehilangan kesempatan emas hanya karena administrasi yang berantakan.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                className="relative group p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${problem.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{problem.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
