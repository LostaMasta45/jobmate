"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, ArrowDown } from "lucide-react";

export function MotivationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-gradient-to-b from-white via-emerald-50 to-rose-50 dark:from-background dark:via-emerald-950/10 dark:to-rose-950/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        {/* Section 1: Bukan Kurang Usaha */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-16 sm:mb-20"
        >
          <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-8 text-[#0C3B2E] dark:text-emerald-600 leading-tight">
            Bukan Kurang Usaha,<br />Tapi Caramu yang Salah
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="space-y-6"
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground font-semibold mb-6">
              Kamu bukan satu-satunya yang:
            </p>

            <ul className="text-left max-w-2xl mx-auto space-y-3 sm:space-y-4 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1">•</span>
                <span>
                  Scroll lowongan tiap malam <em className="text-rose-600 dark:text-rose-400 font-medium not-italic">sampai mata perih,</em>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1">•</span>
                <span>
                  Apply kerja di semua portal tapi <em className="text-rose-600 dark:text-rose-400 font-medium not-italic">nggak pernah dipanggil,</em>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1">•</span>
                <span>
                  Bikin CV seadanya dari template yang sama <em className="text-rose-600 dark:text-rose-400 font-medium not-italic">kayak ribuan orang lain.</em>
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-10"
          >
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground font-semibold mb-6">
              Tapi tetap aja:
            </p>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-10">
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 sm:p-6 border-2 border-rose-200 dark:border-rose-900">
                <X className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 mx-auto mb-3" />
                <p className="text-sm sm:text-base font-medium text-foreground">
                  Gak dipanggil interview
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 sm:p-6 border-2 border-rose-200 dark:border-rose-900">
                <X className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 mx-auto mb-3" />
                <p className="text-sm sm:text-base font-medium text-foreground">
                  Gak dapet feedback
                </p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl p-4 sm:p-6 border-2 border-rose-200 dark:border-rose-900">
                <X className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 mx-auto mb-3" />
                <p className="text-sm sm:text-base font-medium text-foreground">
                  Gak tahu harus mulai dari mana
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center justify-center gap-3">
                <span className="text-3xl sm:text-4xl">💡</span>
                <span className="text-left">
                  Bukan kamu yang gagal, tapi <span className="underline decoration-amber-300">sistem carimu</span> yang perlu di-upgrade!
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Section 2: 2 Pilihan */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center mb-16 sm:mb-20"
        >
          <h3 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl mb-8 sm:mb-12 text-[#0C3B2E] dark:text-emerald-600">
            Sekarang Kamu Punya 2 Pilihan:
          </h3>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-10">
            {/* Pilihan 1 - Cara Lama */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 bg-slate-400 dark:bg-slate-600 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                Cara Lama
              </div>
              <div className="text-5xl sm:text-6xl mb-4">😔</div>
              <p className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed">
                <span className="font-bold">1️⃣</span> Terus ngandelin cara lama yang bikin kamu <span className="font-bold text-rose-600 dark:text-rose-400">jalan di tempat</span>
              </p>
            </motion.div>

            {/* Pilihan 2 - Jombang Career VIP */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 sm:p-8 border-4 border-emerald-500 dark:border-emerald-600 relative overflow-hidden shadow-xl"
            >
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-amber-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                ⭐ Recommended
              </div>
              <div className="text-5xl sm:text-6xl mb-4">🚀</div>
              <p className="text-base sm:text-lg lg:text-xl text-foreground leading-relaxed">
                <span className="font-bold">2️⃣</span> Atau gabung jadi bagian dari <span className="font-bold text-emerald-700 dark:text-emerald-400">50 orang pertama</span> yang dapet akses langsung ke info loker <span className="font-black text-emerald-700 dark:text-emerald-300">VALID</span> yang bikin siap kerja!
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              <a href="#pricing" className="flex items-center gap-2">
                Lihat Paket
                <ArrowDown className="w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>

        {/* Section 3: Banding Harga (Maroon Background) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="bg-[#991B1B] rounded-3xl p-8 sm:p-10 lg:p-12 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h3 className="font-extrabold text-2xl sm:text-3xl lg:text-4xl mb-4">
                Pilih Paket di Bawah Sesuai Kebutuhanmu
              </h3>

              <p className="text-sm sm:text-base text-amber-300 mb-8 font-semibold">
                ⚠️ FYI: Semua paket di bawah ini...
              </p>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-white/20">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
                  Bahkan <span className="text-amber-300 underline">LEBIH MURAH</span> dari:
                </p>

                <ul className="text-left space-y-3 sm:space-y-4 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-300 flex-shrink-0 mt-1 text-xl">•</span>
                    <span>2 bungkus rokok</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-300 flex-shrink-0 mt-1 text-xl">•</span>
                    <span>1x makan nasi goreng + es teh</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-300 flex-shrink-0 mt-1 text-xl">•</span>
                    <span>Skincare yang kamu belum tentu rutin pakai</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-300 flex-shrink-0 mt-1 text-xl">•</span>
                    <span>Paket data yang kamu habisin buat scroll loker hoax!</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-base sm:text-lg lg:text-xl font-medium text-amber-200">
                  Investasi kecil untuk masa depan karirmu yang <span className="font-bold text-white">LEBIH CERAH!</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
