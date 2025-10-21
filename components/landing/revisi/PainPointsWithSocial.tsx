"use client";

import { motion } from "framer-motion";
import { AlertCircle, Clock, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PainPointsWithSocial() {
  const painPoints = [
    {
      icon: Clock,
      title: "Buang Waktu Scroll Loker Hoax",
      description: "Capek scroll IG, FB, Telegram tapi lokernya gak jelas atau udah expired",
    },
    {
      icon: TrendingDown,
      title: "CV Tenggelam & Gak Dipanggil",
      description: "Apply ke ratusan tempat tapi gak pernah ada kabar, CV kamu kalah saing",
    },
    {
      icon: AlertCircle,
      title: "Gak Tau Mulai Dari Mana",
      description: "Bingung bikin CV, email lamaran, atau persiapan interview yang benar",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Masalah yang</span>{" "}
            <span className="text-red-600">Bikin Kamu Gagal</span>{" "}
            <span className="text-foreground">Dapat Kerja</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kalau kamu ngalamin 3 hal ini, berarti cara cari kerja kamu harus di-upgrade!
          </p>
        </motion.div>

        {/* Pain Points Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <point.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-foreground">{point.title}</h3>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Social Proof Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-6">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">203.000+</div>
              <div className="text-sm opacity-90">Pencari Kerja Mempercayai Kami</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">87+</div>
              <div className="text-sm opacity-90">User Gabung Minggu Ini</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-1">4.8/5</div>
              <div className="text-sm opacity-90">Rating dari Member VIP</div>
            </div>
          </div>
          
          <p className="text-lg font-semibold mb-4">
            "Gak perlu buang waktu scroll loker hoax lagi. Semua info valid langsung masuk ke HP!"
          </p>
          
          <Button
            asChild
            size="lg"
            className="bg-white text-emerald-700 hover:bg-slate-100 font-bold shadow-lg hover:scale-105 transition-transform"
          >
            <a href="#pricing">Gabung Sekarang Mulai 15K →</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
