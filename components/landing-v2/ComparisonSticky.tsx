"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, X, ArrowRightLeft, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export const ComparisonSticky = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
     if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }

  return (
    <section className="py-24 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
           <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-5xl font-bold mb-4"
           >
             Jangan Biarkan Karirmu <span className="text-red-500 line-through decoration-4 decoration-white/20">Stuck</span>
           </motion.h2>
           <p className="text-neutral-400 text-lg">
               Lihat perbedannya. Rasakan hasilnya.
           </p>
        </div>

        {/* Slider Visual Comparison */}
        <div 
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl mb-20 cursor-ew-resize select-none group"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
        >
            {/* Image 2 (Right - JobMate) */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-purple-900/20 flex items-center justify-center">
                 <div className="text-center p-8">
                    <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(0,172,199,0.4)]">
                         <Unlock className="w-10 h-10 text-brand" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">JobMate VIP</h3>
                    <p className="text-brand-100 font-medium">Lolos ATS & Interview Siap</p>
                 </div>
                 
                 {/* Background Grid for JobMate */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            </div>

            {/* Image 1 (Left - Old Way) - Clipped */}
            <div 
                className="absolute inset-0 bg-neutral-900 border-r border-white/20 flex items-center justify-center overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
            >
                {/* Content fixed position relative to container, not clipped div */}
                 <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-neutral-950">
                    <div className="text-center p-8 opacity-50 grayscale">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                             <Lock className="w-10 h-10 text-white/50" />
                        </div>
                        <h3 className="text-3xl font-bold text-neutral-500 mb-2">Cara Lama</h3>
                        <p className="text-neutral-600">Manual & Melelahkan</p>
                    </div>
                    <div className="absolute inset-0 bg-black/60" />
                 </div>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
                    <ArrowRightLeft className="w-5 h-5" />
                </div>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-xs px-3 py-1 rounded-full border border-white/10 text-neutral-400 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Geser untuk membandingkan
            </div>
        </div>

        {/* Sticky Header Table - Scrollable on Mobile */}
        <div className="max-w-4xl mx-auto relative">
             {/* Scroll hint overlay for mobile */}
             <div className="md:hidden absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-40 pointer-events-none" />
             
             <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                 <div className="min-w-[600px]">
                     <div className="sticky top-0 z-30 backdrop-blur-md bg-black/90 border-y border-white/10 py-4 grid grid-cols-12 gap-4 mb-8 items-center">
                        <div className="col-span-4 font-medium text-neutral-400 pl-4">Fitur</div>
                        <div className="col-span-4 text-center font-bold text-neutral-500">Manual</div>
                        <div className="col-span-4 text-center font-bold text-brand flex items-center justify-center gap-2">
                            JobMate <span className="inline px-2 py-0.5 bg-brand/20 rounded text-xs">PRO</span>
                        </div>
                     </div>

                     <div className="space-y-2">
                        {comparisonItems.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.05 }}
                                className="grid grid-cols-12 gap-4 py-4 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 items-center"
                            >
                                <div className="col-span-4 font-medium text-white">{item.label}</div>
                                <div className="col-span-4 text-center text-sm text-neutral-500">
                                    {item.old}
                                </div>
                                <div className="col-span-4 text-center font-bold text-brand flex items-center justify-center gap-2 text-sm">
                                    <Check className="w-4 h-4 text-brand block" />
                                    {item.new}
                                </div>
                            </motion.div>
                        ))}
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </section>
  );
};

const comparisonItems = [
    { label: "Info Lowongan Kerja", old: "Scroll IG/FB", new: "Langsung Grup WA" },
    { label: "Kualitas Info Loker", old: "Banyak Hoax", new: "100% Valid & Verified" },
    { label: "Job Portal Khusus", old: "Tidak Ada", new: "Web Portal VIP" },
    { label: "Template CV", old: "Cari Sendiri", new: "CV ATS Generator AI" },
    { label: "Surat Lamaran", old: "Manual", new: "Auto Generator" },
    { label: "Application Tracker", old: "Manual", new: "Kanban Board Otomatis" },
    { label: "Interview Guide", old: "Cari Sendiri", new: "Checklist & Panduan HRD" },
    { label: "Tools Produktivitas", old: "Tidak Ada", new: "8+ Tools Premium" },
    { label: "Biaya", old: "Gratis (Buang Waktu)", new: "Rp 39K Sekali Bayar" },
    { label: "Hasil Akhir", old: "Stress & Gak Dipanggil", new: "AUTOPILOT MODE 🚀" }
];

// Update render inside component to use item.old and item.new
// ...
             <div className="space-y-2">
                {comparisonItems.map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: idx * 0.05 }}
                        className="grid grid-cols-12 gap-4 py-4 px-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 items-center"
                    >
                        <div className="col-span-4 md:col-span-4 font-medium text-white">{item.label}</div>
                        <div className="col-span-4 md:col-span-4 text-center text-sm text-neutral-500">
                            {item.old}
                        </div>
                        <div className="col-span-4 md:col-span-4 text-center font-bold text-brand flex items-center justify-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-brand hidden md:block" />
                            {item.new}
                        </div>
                    </motion.div>
                ))}
             </div>
// ...
