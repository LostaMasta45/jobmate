"use client";

import React from "react";
import { motion } from "framer-motion";

export const AboutSectionV2 = () => {
  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-brand/50 transition-colors group hover:-translate-y-1 duration-300"
             >
                 <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">🚫</div>
                 <h4 className="text-xl font-bold text-white mb-3">Stop Capek Cari Loker</h4>
                 <p className="text-base text-neutral-400 leading-relaxed">Info langsung ke WA, gak perlu scroll sana-sini.</p>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-brand/50 transition-colors group hover:-translate-y-1 duration-300"
             >
                 <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">✅</div>
                 <h4 className="text-xl font-bold text-white mb-3">Loker Terpercaya</h4>
                 <p className="text-base text-neutral-400 leading-relaxed">100% valid, sudah diverifikasi tim kami.</p>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-brand/50 transition-colors group hover:-translate-y-1 duration-300"
             >
                 <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">📱</div>
                 <h4 className="text-xl font-bold text-white mb-3">Satu Tempat</h4>
                 <p className="text-base text-neutral-400 leading-relaxed">Semua loker ada di satu grup WhatsApp.</p>
             </motion.div>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:border-brand/50 transition-colors group hover:-translate-y-1 duration-300"
             >
                 <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">🔔</div>
                 <h4 className="text-xl font-bold text-white mb-3">Update Harian</h4>
                 <p className="text-base text-neutral-400 leading-relaxed">Selalu dapat peluang baru setiap hari.</p>
             </motion.div>
        </div>
      </div>
    </section>
  );
};
