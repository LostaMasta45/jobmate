"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export const WhyInfoLokerSectionV2 = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-neutral-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             {/* Left: Content & Reasons */}
             <div className="space-y-10">
                 <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 mb-6"
                    >
                        <Star className="w-4 h-4 fill-yellow-500" />
                        <span className="text-sm font-medium">Kenapa Kami?</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                    >
                        Kenapa Jadi <br/> <span className="text-brand">Pilihan Terbaik?</span>
                    </motion.h2>
                 </div>

                 <div className="space-y-4">
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                     >
                         <div className="mt-1 p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                            <Star className="w-4 h-4 text-brand fill-brand" />
                         </div>
                         <p className="text-neutral-300 text-base leading-relaxed pt-1">
                             Menghadirkan info lowongan kerja terpercaya sejak tahun 2019
                         </p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                     >
                         <div className="mt-1 p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                            <Star className="w-4 h-4 text-brand fill-brand" />
                         </div>
                         <p className="text-neutral-300 text-base leading-relaxed pt-1">
                             Sudah membantu ribuan pencari kerja menemukan pekerjaan
                         </p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                     >
                         <div className="mt-1 p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                            <Star className="w-4 h-4 text-brand fill-brand" />
                         </div>
                         <p className="text-neutral-300 text-base leading-relaxed pt-1">
                             Bekerja sama dengan berbagai perusahaan lokal terpercaya
                         </p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                     >
                         <div className="mt-1 p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                            <Star className="w-4 h-4 text-brand fill-brand" />
                         </div>
                         <p className="text-neutral-300 text-base leading-relaxed pt-1">
                             Berpengalaman menyaring informasi lowongan terbaik
                         </p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                     >
                         <div className="mt-1 p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                            <Star className="w-4 h-4 text-brand fill-brand" />
                         </div>
                         <p className="text-neutral-300 text-base leading-relaxed pt-1">
                             Platform terbesar di bidang loker untuk wilayah Jombang
                         </p>
                     </motion.div>
                 </div>
             </div>

             {/* Right: Stats & Image Visual */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
             >
                 {/* Main Card */}
                 <div className="relative bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-[2rem] p-4 sm:p-8 overflow-hidden shadow-2xl">
                     
                     {/* Image Container */}
                     <div className="relative aspect-video bg-neutral-800 rounded-xl overflow-hidden mb-6 sm:mb-8 shadow-lg border border-white/5 group">
                        <Image
                            src="/tele.jpg"
                            alt="Channel Telegram InfoLokerJombang"
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2">
                            <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full animate-pulse">Verified</span>
                            <span className="text-white text-xs sm:text-sm font-medium drop-shadow-md">Official Channel</span>
                        </div>
                     </div>
                     
                     {/* Stats Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                         <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">2019</div>
                             <div className="text-xs sm:text-sm text-neutral-500 font-medium">Berdiri Sejak</div>
                         </div>
                         <div className="text-center p-3 sm:p-4 rounded-2xl bg-brand/10 border border-brand/20">
                             <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand mb-1">203K+</div>
                             <div className="text-xs sm:text-sm text-brand/70 font-medium">Follower Aktif</div>
                         </div>
                         <div className="text-center p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/5">
                             <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">#1</div>
                             <div className="text-xs sm:text-sm text-neutral-500 font-medium">Platform Loker</div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Background Decor */}
                 <div className="absolute -inset-4 bg-gradient-to-tr from-brand/20 to-purple-500/20 rounded-[3rem] blur-2xl -z-10 opacity-50" />
             </motion.div>
        </div>
      </div>
    </section>
  );
};
