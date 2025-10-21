"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const painPoints = [
  {
    emoji: "😩",
    text: "Capek scroll tiap malam tapi info loker gak jelas",
  },
  {
    emoji: "😕",
    text: "Loker udah tutup / gaji gak sesuai",
  },
  {
    emoji: "😴",
    text: "Notifikasi grup numpuk, gak tahu mana yang valid",
  },
  {
    emoji: "😔",
    text: "Bosen cari tapi hasil nihil",
  },
  {
    emoji: "😓",
    text: "Mager karena harus buka banyak platform",
  },
];

export function PainPoints() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Kamu Pasti Pernah Merasakan Ini...
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Frustrasi cari kerja itu normal, tapi gak harus terus-terusan!
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background rounded-2xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{point.emoji}</div>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {point.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emotional Hook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 rounded-2xl p-6 sm:p-8 lg:p-12 text-center border-2 border-red-200 dark:border-red-900"
        >
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight">
            💭 "Berapa lama lagi mau capek scroll grup loker{" "}
            <span className="text-red-600 dark:text-red-400">TANPA HASIL</span>?"
          </p>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-emerald-600 to-amber-600 mx-auto mb-4 rounded-full" />
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Jangan khawatir
            </span>{" "}
            — Solusinya ada di{" "}
            <strong className="text-foreground">JOMBANG CAREER VIP</strong>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
