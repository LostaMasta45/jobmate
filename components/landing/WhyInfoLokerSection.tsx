"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

const reasons = [
  "Menghadirkan info lowongan kerja terpercaya sejak tahun 2019",
  "Sudah membantu ribuan pencari kerja menemukan pekerjaan yang sesuai",
  "Bekerja sama dengan berbagai perusahaan lokal terpercaya",
  "Berpengalaman menyaring informasi lowongan terbaik dari ribuan sumber",
  "Platform terbesar di bidang loker untuk wilayah Jombang",
];

export function WhyInfoLokerSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section 
      id="why-infoloker" 
      ref={ref} 
      className="py-12 sm:py-16 lg:py-20 bg-[#991B1B] relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Yuk Kenal Lebih Dekat dengan INFOLOKERJOMBANG</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight px-2">
              KENAPA INFOLOKERJOMBANG<br className="hidden sm:block" />{" "}
              <span className="sm:hidden">JADI PILIHAN TERBAIK?</span>
              <span className="hidden sm:inline">JADI PILIHAN TERBAIK?</span>
            </h2>
          </motion.div>

          {/* Reasons List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4 sm:space-y-5"
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 sm:gap-4 text-left bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-6 hover:bg-white/20 transition-all"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex-shrink-0 fill-amber-300 text-amber-300 mt-0.5 sm:mt-1" />
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white font-medium leading-relaxed">
                  {reason}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-white/20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1 sm:mb-2">
                  2019
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-white/90">Berdiri Sejak</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1 sm:mb-2">
                  203K+
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-white/90">Follower Aktif</p>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-amber-300 mb-1 sm:mb-2">
                  #1
                </div>
                <p className="text-xs sm:text-sm lg:text-base text-white/90 break-words">Platform Loker Jombang</p>
              </div>
            </div>
          </motion.div>

          {/* Social Proof Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="mt-8 sm:mt-12 px-2"
          >
            <div className="relative max-w-md mx-auto">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-2xl rounded-3xl" />
              
              {/* Image container */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-6 border-2 border-white/20 shadow-2xl hover:scale-105 transition-transform duration-300">
                <Image
                  src="/tele.jpg"
                  alt="203.000+ follower mempercayai InfoLokerJombang"
                  width={512}
                  height={300}
                  className="w-full h-auto rounded-lg sm:rounded-xl lg:rounded-2xl"
                  priority
                />
                
                {/* Badge overlay */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 bg-gradient-to-r from-emerald-400 to-green-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 rounded-full shadow-lg text-[10px] sm:text-xs lg:text-sm font-bold animate-pulse whitespace-nowrap">
                  ✓ Verified Channel
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-center text-white/90 text-xs sm:text-sm lg:text-base mt-3 sm:mt-4 font-medium leading-relaxed px-2">
                📱 Bukti nyata kepercayaan dari 203.000+ followers di Instagram
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
