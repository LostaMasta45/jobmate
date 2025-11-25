"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MotivationCosmic = () => {
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Part 1: Bukan Kurang Usaha */}
        <div className="text-center mb-24">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
            >
                Bukan Kurang Usaha, <br/>
                <span className="text-rose-500">Tapi Caramu yang Salah</span>
            </motion.h2>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="space-y-6 max-w-3xl mx-auto"
            >
                <p className="text-xl md:text-2xl text-neutral-300 font-medium mb-8">
                    Kamu bukan satu-satunya yang:
                </p>

                <ul className="space-y-4 text-left text-lg md:text-xl text-neutral-400">
                    <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-rose-500 text-2xl">•</span>
                        <span>Scroll lowongan tiap malam <span className="text-rose-400 font-semibold">sampai mata perih</span></span>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-rose-500 text-2xl">•</span>
                        <span>Apply kerja di semua portal tapi <span className="text-rose-400 font-semibold">nggak pernah dipanggil</span></span>
                    </li>
                    <li className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <span className="text-rose-500 text-2xl">•</span>
                        <span>Bikin CV seadanya dari template yang sama <span className="text-rose-400 font-semibold">kayak ribuan orang lain</span></span>
                    </li>
                </ul>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-16"
            >
                <p className="text-xl font-medium mb-8 text-neutral-300">Tapi tetap aja:</p>
                <div className="grid md:grid-cols-3 gap-4 mb-12">
                    {["Gak dipanggil interview", "Gak dapet feedback", "Gak tahu harus mulai dari mana"].map((item, i) => (
                        <div key={i} className="bg-rose-950/20 border border-rose-500/20 p-6 rounded-2xl text-rose-200 flex flex-col items-center gap-3 hover:bg-rose-900/30 transition-colors">
                            <X className="w-8 h-8 text-rose-500" />
                            <span className="font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-r from-brand/20 to-purple-600/20 border border-brand/20 p-8 rounded-2xl max-w-3xl mx-auto backdrop-blur-sm">
                    <p className="text-xl md:text-2xl font-bold flex flex-col md:flex-row items-center justify-center gap-4">
                        <span className="text-4xl">💡</span>
                        <span>Bukan kamu yang gagal, tapi <span className="text-brand underline decoration-wavy underline-offset-4">sistem carimu</span> yang perlu di-upgrade!</span>
                    </p>
                </div>
            </motion.div>
        </div>

        {/* Part 2: 2 Pilihan */}
        <div className="text-center mb-24">
            <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-bold mb-12"
            >
                Sekarang Kamu Punya <span className="text-brand">2 Pilihan:</span>
            </motion.h3>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {/* Option 1 */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-neutral-900 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-colors"
                >
                    <div className="absolute top-4 right-4 bg-neutral-800 text-neutral-400 text-xs font-bold px-3 py-1 rounded-full">Cara Lama</div>
                    <div className="text-6xl mb-6 grayscale group-hover:grayscale-0 transition-all">😔</div>
                    <p className="text-lg text-neutral-300 leading-relaxed">
                        <span className="font-bold text-white text-xl mr-2">1️⃣</span> 
                        Terus ngandelin cara lama yang bikin kamu <span className="text-rose-500 font-bold">jalan di tempat</span>.
                    </p>
                </motion.div>

                {/* Option 2 */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-brand/10 to-purple-900/10 border border-brand/50 p-8 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(0,172,199,0.1)] hover:shadow-[0_0_50px_rgba(0,172,199,0.2)] transition-all"
                >
                    <div className="absolute top-4 right-4 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">Recommended</div>
                    <div className="text-6xl mb-6">🚀</div>
                    <p className="text-lg text-white leading-relaxed">
                        <span className="font-bold text-xl mr-2">2️⃣</span> 
                        Gabung jadi bagian dari <span className="text-brand font-bold">50 orang pertama</span> yang dapet akses langsung ke info loker <span className="text-brand font-black">VALID</span>!
                    </p>
                </motion.div>
            </div>

            <Button size="lg" className="bg-brand hover:bg-brand-600 text-white h-14 px-8 rounded-full text-lg shadow-lg shadow-brand/20 hover:scale-105 transition-transform">
                Lihat Paket <ArrowDown className="ml-2 w-5 h-5" />
            </Button>
        </div>

        {/* Part 3: Comparison Context (The Maroon Section replacement - dark styled) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-rose-900/40 to-red-900/40 border border-rose-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <h3 className="text-2xl md:text-4xl font-bold mb-6 text-white">
                    Pilih Paket di Bawah Sesuai Kebutuhanmu
                </h3>
                <p className="text-rose-200 font-medium mb-8">⚠️ FYI: Semua paket di bawah ini...</p>

                <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-8">
                    <p className="text-xl md:text-2xl font-bold mb-6">
                        Bahkan <span className="text-brand underline decoration-wavy">LEBIH MURAH</span> dari:
                    </p>
                    <ul className="space-y-4 text-left text-lg text-neutral-300 max-w-xl mx-auto">
                        {[
                            "2 bungkus rokok", 
                            "1x makan nasi goreng + es teh", 
                            "Skincare yang belum tentu rutin dipakai", 
                            "Paket data yang habis buat scroll loker hoax"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <span className="text-brand text-xl">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-lg text-rose-100">
                    Investasi kecil untuk masa depan karirmu yang <span className="font-bold text-white">LEBIH CERAH!</span>
                </p>
            </div>
        </motion.div>

      </div>
    </section>
  );
};
