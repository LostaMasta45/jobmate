"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Star } from "lucide-react";
import Image from "next/image";

export const AboutStatsV2 = () => {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* About Header */}
        <div className="text-center mb-16">
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-sm mb-6"
            >
                <span className="text-sm text-brand-200">Apa Itu Jombang VIP Career</span>
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold mb-6"
            >
                Grup WhatsApp <br />
                <span className="text-brand">"JOMBANG CAREER VIP"</span>
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-neutral-400 text-lg max-w-3xl mx-auto leading-relaxed"
            >
                Grup eksklusif yang memberikan kamu akses ke <strong className="text-white">ratusan lowongan kerja valid</strong> di Jombang dan sekitarnya, langsung ke WhatsApp-mu setiap hari.
            </motion.p>
        </div>

        {/* Why Choose Us Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
             {/* Left: Stats & Image */}
             <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
             >
                 <div className="relative bg-neutral-900 border border-white/10 rounded-3xl p-6 overflow-hidden group">
                     <div className="absolute inset-0 bg-brand/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     
                     {/* Fake Image Placeholder - In real implementation, use Image component */}
                     <div className="relative aspect-video bg-neutral-800 rounded-2xl overflow-hidden mb-6">
                        <Image
                            src="/tele.jpg"
                            alt="Channel Telegram InfoLokerJombang"
                            fill
                            className="object-cover"
                        />
                     </div>
                     
                     <div className="grid grid-cols-3 gap-4 text-center">
                         <div>
                             <div className="text-3xl font-bold text-white mb-1">2019</div>
                             <div className="text-xs text-neutral-500">Berdiri Sejak</div>
                         </div>
                         <div>
                             <div className="text-3xl font-bold text-brand mb-1">203K+</div>
                             <div className="text-xs text-neutral-500">Follower Aktif</div>
                         </div>
                         <div>
                             <div className="text-3xl font-bold text-white mb-1">#1</div>
                             <div className="text-xs text-neutral-500">Platform Loker</div>
                         </div>
                     </div>
                 </div>
                 
                 {/* Decorative Blob */}
                 <div className="absolute -top-10 -left-10 w-64 h-64 bg-brand/20 blur-[100px] -z-10" />
             </motion.div>

             {/* Right: Reasons List */}
             <div className="space-y-6">
                 <h3 className="text-2xl font-bold mb-6">Kenapa Jadi Pilihan Terbaik?</h3>
                 {[
                     "Menghadirkan info lowongan kerja terpercaya sejak tahun 2019",
                     "Sudah membantu ribuan pencari kerja menemukan pekerjaan",
                     "Bekerja sama dengan berbagai perusahaan lokal terpercaya",
                     "Berpengalaman menyaring informasi lowongan terbaik",
                     "Platform terbesar di bidang loker untuk wilayah Jombang"
                 ].map((reason, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                     >
                         <div className="mt-1">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                         </div>
                         <p className="text-neutral-300 text-sm md:text-base leading-relaxed">
                             {reason}
                         </p>
                     </motion.div>
                 ))}
             </div>
        </div>

        {/* Features Horizontal Scroll/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {[
                 { icon: "🚫", title: "Stop Capek Cari Loker", desc: "Info langsung ke WA, gak perlu scroll sana-sini." },
                 { icon: "✅", title: "Loker Terpercaya", desc: "100% valid, sudah diverifikasi tim kami." },
                 { icon: "📱", title: "Satu Tempat", desc: "Semua loker ada di satu grup WhatsApp." },
                 { icon: "🔔", title: "Update Harian", desc: "Selalu dapat peluang baru setiap hari." }
             ].map((feat, i) => (
                 <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="bg-neutral-900/50 border border-white/10 p-6 rounded-2xl hover:border-brand/50 transition-colors group"
                 >
                     <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feat.icon}</div>
                     <h4 className="font-bold text-white mb-2">{feat.title}</h4>
                     <p className="text-sm text-neutral-400">{feat.desc}</p>
                 </motion.div>
             ))}
        </div>

      </div>
    </section>
  );
};
