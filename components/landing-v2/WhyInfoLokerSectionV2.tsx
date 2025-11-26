"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle, Briefcase, Shield, Zap } from "lucide-react";
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
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-500 mb-6"
                    >
                        <MessageCircle className="w-4 h-4 fill-green-500" />
                        <span className="text-sm font-medium">Komunitas Karir Terbesar</span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
                    >
                        Bukan Sekadar Tools. <br/> 
                        <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                            Akses Info Loker Valid.
                        </span>
                    </motion.h2>
                    <p className="text-lg text-neutral-400">
                        Bergabunglah dengan 1.500+ member VIP yang mendapatkan info lowongan kerja terverifikasi setiap harinya langsung di HP mereka.
                    </p>
                 </div>

                 <div className="space-y-4">
                     {[
                         { icon: Zap, text: "Update puluhan loker valid setiap hari di Grup WA VIP", color: "text-yellow-400" },
                         { icon: Shield, text: "Bebas penipuan, scam, dan iklan tidak jelas", color: "text-green-400" },
                         { icon: Briefcase, text: "Filter loker sesuai kualifikasi & gaji yang layak", color: "text-blue-400" },
                         { icon: Star, text: "Prioritas info untuk member VIP sebelum publik", color: "text-purple-400" }
                     ].map((item, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-brand/30 transition-all group"
                        >
                            <div className={`p-2 bg-white/5 rounded-lg ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <p className="text-neutral-300 font-medium">
                                {item.text}
                            </p>
                        </motion.div>
                     ))}
                 </div>
             </div>

             {/* Right: Dashboard Mockup Visual */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative group"
             >
                 {/* Dashboard Card */}
                 <div className="relative rounded-3xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                     {/* Header Mockup */}
                     <div className="h-12 bg-neutral-800 border-b border-white/5 flex items-center px-4 gap-2">
                         <div className="flex gap-1.5">
                             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                             <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                             <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                         </div>
                         <div className="ml-4 w-full max-w-[200px] h-6 bg-neutral-900 rounded-md border border-white/5 flex items-center px-2">
                             <div className="w-3 h-3 rounded-full bg-neutral-700 mr-2" />
                             <div className="w-20 h-2 bg-neutral-700 rounded-full" />
                         </div>
                     </div>

                     {/* Content Mockup - Simplified VIP Dashboard Layout */}
                     <div className="p-6 bg-neutral-900 min-h-[400px] relative">
                         <div className="grid grid-cols-12 gap-4 mb-6">
                             {/* Sidebar */}
                             <div className="col-span-3 hidden sm:block space-y-3">
                                 <div className="h-8 w-full bg-neutral-800 rounded-lg" />
                                 <div className="h-8 w-full bg-neutral-800/50 rounded-lg" />
                                 <div className="h-8 w-full bg-neutral-800/50 rounded-lg" />
                                 <div className="h-8 w-full bg-neutral-800/50 rounded-lg" />
                             </div>
                             
                             {/* Main Area */}
                             <div className="col-span-12 sm:col-span-9 space-y-4">
                                 {/* Welcome Box */}
                                 <div className="h-32 rounded-2xl bg-gradient-to-r from-emerald-900/50 to-black border border-emerald-500/20 p-6 relative overflow-hidden">
                                     <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full border border-emerald-500/30">VIP ACTIVE</div>
                                     <div className="space-y-2 mt-4">
                                         <div className="h-6 w-48 bg-white/10 rounded-lg" />
                                         <div className="h-4 w-64 bg-white/5 rounded-lg" />
                                     </div>
                                 </div>

                                 {/* Stats Row */}
                                 <div className="grid grid-cols-3 gap-3">
                                     <div className="h-24 rounded-xl bg-neutral-800/50 border border-white/5 p-3">
                                         <div className="h-8 w-8 rounded-lg bg-blue-500/20 mb-2" />
                                         <div className="h-6 w-12 bg-white/10 rounded" />
                                     </div>
                                     <div className="h-24 rounded-xl bg-neutral-800/50 border border-white/5 p-3">
                                         <div className="h-8 w-8 rounded-lg bg-purple-500/20 mb-2" />
                                         <div className="h-6 w-12 bg-white/10 rounded" />
                                     </div>
                                     <div className="h-24 rounded-xl bg-neutral-800/50 border border-white/5 p-3">
                                         <div className="h-8 w-8 rounded-lg bg-orange-500/20 mb-2" />
                                         <div className="h-6 w-12 bg-white/10 rounded" />
                                     </div>
                                 </div>

                                 {/* Loker List */}
                                 <div className="space-y-3">
                                     <div className="flex items-center justify-between mb-2">
                                         <div className="h-5 w-32 bg-white/10 rounded" />
                                         <div className="h-5 w-16 bg-white/5 rounded" />
                                     </div>
                                     {[1, 2, 3].map((i) => (
                                         <div key={i} className="h-20 rounded-xl bg-neutral-800/30 border border-white/5 p-3 flex gap-3 items-center">
                                             <div className="w-12 h-12 rounded-lg bg-white/5" />
                                             <div className="flex-1 space-y-2">
                                                 <div className="h-4 w-3/4 bg-white/10 rounded" />
                                                 <div className="h-3 w-1/2 bg-white/5 rounded" />
                                             </div>
                                             <div className="w-20 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20" />
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Overlay Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                 </div>
                 
                 {/* Floating Badges */}
                 <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -right-6 top-20 bg-neutral-800 border border-white/10 p-4 rounded-2xl shadow-xl z-20 hidden sm:block"
                 >
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                             <MessageCircle className="w-5 h-5 text-green-500" />
                         </div>
                         <div>
                             <p className="text-xs text-neutral-400">Grup WA VIP</p>
                             <p className="text-sm font-bold text-white">1,542 Members</p>
                         </div>
                     </div>
                 </motion.div>

                 <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -left-6 bottom-20 bg-neutral-800 border border-white/10 p-4 rounded-2xl shadow-xl z-20 hidden sm:block"
                 >
                     <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                             <Briefcase className="w-5 h-5 text-blue-500" />
                         </div>
                         <div>
                             <p className="text-xs text-neutral-400">Total Loker</p>
                             <p className="text-sm font-bold text-white">50+ Hari Ini</p>
                         </div>
                     </div>
                 </motion.div>
                 
                 {/* Background Decor */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[100px] -z-10 opacity-40 rounded-full pointer-events-none" />
             </motion.div>
        </div>
      </div>
    </section>
  );
};
