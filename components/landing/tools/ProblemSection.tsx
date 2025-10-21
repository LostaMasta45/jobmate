"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, Frown, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Clock,
    title: "Buang Waktu 2-3 Jam per CV",
    description: "Buat CV manual pakai Word, format berantakan, gak ATS-friendly",
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
  {
    icon: Frown,
    title: "Lupa Track Aplikasi",
    description: "Apply ke 20+ perusahaan, lupa mana yang sudah interview, mana yang belum reply",
    color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: TrendingDown,
    title: "Dokumen Gak Profesional",
    description: "Surat lamaran copy-paste, email gak sopan, dokumen PDF gak rapi",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
  },
];

export function ProblemSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Cari Kerja Manual = <span className="text-red-600">Buang Waktu</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kamu bisa habiskan <strong>10-15 jam per minggu</strong> cuma untuk administrasi lamaran kerja
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-lg border"
              >
                <div className={`w-12 h-12 rounded-xl ${problem.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                <p className="text-sm text-muted-foreground">{problem.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-6 py-3 rounded-full font-semibold">
            Total Waktu Terbuang: <span className="text-xl">10-15 Jam/Minggu</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
