"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 via-background to-amber-50 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-br from-emerald-600 to-green-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden shadow-2xl"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Jangan Tunda Lagi!</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight px-2"
            >
              Siap Gak Siap,<br />
              Kerja Harus Dimulai dari Sekarang 💪
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base sm:text-lg lg:text-xl text-emerald-50 mb-8 leading-relaxed px-2"
            >
              Gabung sekarang bareng <strong className="text-white">203.000+ pencari kerja</strong> di Jombang
              yang sudah duluan dapat info lowongan terbaru setiap hari!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <a href="#pricing" className="flex items-center gap-2">
                  Pilih Paket Sekarang
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl"
              >
                <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20tertarik%20gabung%20Career%20VIP">
                  Chat Admin Dulu
                </a>
              </Button>
            </motion.div>

            {/* Urgency Message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-amber-400 text-amber-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 inline-block max-w-full"
            >
              <p className="font-semibold text-xs sm:text-sm lg:text-base leading-relaxed">
                ⚡ <strong>Limited Time:</strong> Harga spesial Rp 39k lifetime bisa berubah sewaktu-waktu!
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 text-center text-sm text-muted-foreground"
        >
          <p className="mb-2">
            Powered by <strong className="text-foreground">InfoLokerJombang × JobMate</strong>
          </p>
          <p>© 2025 JobMate. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="/contact" className="hover:text-foreground transition-colors">Contact Us</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
