"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Info, Users, Calendar, MapPin, CheckCircle } from "lucide-react";
import Image from "next/image";

export const WhyInfoLokerOriginal = () => {
  return (
    <section className="py-20 bg-neutral-950 text-white border-t border-white/5 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             {/* Left: Image Visual */}
             <motion.div 
                initial={{ opacity: 1, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
             >
                 <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                    <Image
                        src="/tele.jpg" 
                        alt="InfoLokerJombang Telegram"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                        <div className="bg-brand text-white p-3 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">203.000+</p>
                            <p className="text-sm text-neutral-300">Follower Aktif di Sosial Media</p>
                        </div>
                    </div>
                 </div>
                 
                 {/* Decorative Elements */}
                 <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-brand/10 rounded-full blur-3xl opacity-30" />
             </motion.div>

             {/* Right: Content */}
             <div className="space-y-8">
                 <div>
                    <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/30 bg-brand/10 text-brand mb-4"
                    >
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-medium">Sejak 2019</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 1, y: 0 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                    >
                        Kenapa InfoLoker <br/> <span className="bg-gradient-to-r from-blue-400 to-brand bg-clip-text text-transparent">Jombang?</span>
                    </motion.h2>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Platform informasi lowongan kerja terbesar dan terpercaya di Jombang Raya. Kami menghubungkan ribuan pencari kerja dengan perusahaan impian mereka.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                         { icon: Calendar, title: "Update Tiap Hari", desc: "Info loker baru setiap hari tanpa libur." },
                         { icon: CheckCircle, title: "Terverifikasi", desc: "Semua loker sudah melalui proses screening ketat." },
                         { icon: MapPin, title: "Fokus Lokal", desc: "Spesialisasi area Jombang, Mojokerto, Kediri." },
                         { icon: Star, title: "Komunitas Aktif", desc: "Diskusi dan sharing pengalaman antar member." }
                     ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 1, y: 0 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="p-4 rounded-2xl bg-neutral-900 border border-white/5 hover:border-brand/30 transition-all group hover:bg-white/5"
                        >
                            <item.icon className="w-6 h-6 text-brand mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-white mb-1">{item.title}</h3>
                            <p className="text-sm text-neutral-400">{item.desc}</p>
                        </motion.div>
                     ))}
                 </div>
             </div>
        </div>
      </div>
    </section>
  );
};
