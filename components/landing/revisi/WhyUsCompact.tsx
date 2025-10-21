"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Users, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function WhyUsCompact() {
  const [showComparison, setShowComparison] = useState(false);

  const benefits = [
    {
      icon: Zap,
      title: "Info Loker Valid & Update Harian",
      description: "Loker baru langsung masuk ke grup WA Premium. Gak perlu scroll IG/FB lagi.",
    },
    {
      icon: Users,
      title: "Komunitas 203.000+ Pencari Kerja",
      description: "Sharing tips, pengalaman interview, dan saling support sesama member.",
    },
    {
      icon: Shield,
      title: "Sudah Terpercaya 5+ Tahun",
      description: "Platform loker lokal Jombang terbesar dengan ribuan success stories.",
    },
    {
      icon: TrendingUp,
      title: "10+ Tools JobMate (Premium Only)",
      description: "CV ATS, Email Lamaran, Tracker, dan tools lain bikin kamu siap tempur.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Motivation Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            💡 Bukan Kamu yang Salah
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Bukan Kurang Usaha,</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Tapi Caramu yang Perlu Upgrade
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Kamu udah coba scroll loker tiap hari, apply ratusan kali, tapi tetap gak dipanggil?{" "}
            <strong className="text-foreground">Sistem carimu yang harus berubah!</strong>{" "}
            Saatnya pakai cara yang lebih efektif dan terbukti berhasil.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-bold mb-2 text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Comparison Section - Collapsed by default */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Pilih Cara Cari Kerja yang <span className="text-emerald-600">Lebih Smart</span>
            </h3>
            <Button
              variant="ghost"
              onClick={() => setShowComparison(!showComparison)}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {showComparison ? "Sembunyikan" : "Lihat"} Perbandingan Basic vs Premium →
            </Button>
          </div>

          {showComparison && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold">Fitur</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">
                      VIP Basic
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-emerald-600">
                      VIP Premium ⭐
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">Grup WA Info Loker</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">Portal Loker Valid</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">Template CV ATS</td>
                    <td className="text-center py-3 px-4">1 Template</td>
                    <td className="text-center py-3 px-4">
                      <strong className="text-emerald-600">10+ Template</strong>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">CV Generator + Export PDF</td>
                    <td className="text-center py-3 px-4 text-slate-400">✕</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">Email Lamaran Generator</td>
                    <td className="text-center py-3 px-4 text-slate-400">✕</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4">Job Application Tracker</td>
                    <td className="text-center py-3 px-4 text-slate-400">✕</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Harga</td>
                    <td className="text-center py-3 px-4 font-bold">15K/bulan</td>
                    <td className="text-center py-3 px-4 font-bold text-emerald-600">
                      50K Lifetime
                    </td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          )}

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-4">
              <strong className="text-foreground">FYI:</strong> Semua paket ini lebih murah dari:{" "}
              <span className="text-red-600">2 bungkus rokok</span> • nasi goreng + es teh •
              paket data buat scroll loker hoax!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <a href="#pricing">Lihat Paket Lengkap →</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
