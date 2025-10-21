"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "🚫",
    title: "Stop Capek Cari Loker",
    description: "Semua info lowongan langsung dikirim ke grupmu, gak perlu scroll sana-sini",
  },
  {
    icon: "✅",
    title: "Loker Terpercaya, Tanpa Hoax",
    description: "Setiap info sudah diverifikasi tim kami, 100% valid dan terpercaya",
  },
  {
    icon: "📱",
    title: "Satu Tempat Semua Loker",
    description: "Gak perlu buka banyak platform, semua ada di satu grup WhatsApp",
  },
  {
    icon: "🔔",
    title: "Info Terbaru Setiap Hari",
    description: "Update lowongan fresh setiap hari, jadi selalu dapat peluang baru",
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Apa Itu Jombang VIP Career
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Grup WhatsApp{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                "JOMBANG CAREER VIP"
              </span>
              <br />
              <span className="text-muted-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Solusi Cari Kerja yang Praktis
              </span>
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Grup eksklusif yang memberikan kamu akses ke{" "}
              <strong className="text-foreground">ratusan lowongan kerja valid</strong> di
              Jombang dan sekitarnya, langsung ke WhatsApp-mu setiap hari.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/10 dark:to-green-950/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-1.5 sm:mb-2 text-foreground leading-tight">{feature.title}</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
