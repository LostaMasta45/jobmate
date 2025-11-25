"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rani",
    role: "Staff Admin • Mojowarno",
    text: "Dulu susah cari kerja, sekarang tiap hari dapat info valid. Cuma seminggu gabung, langsung dapet panggilan interview!",
  },
  {
    name: "Bima",
    role: "Marketing • Sumobito",
    text: "Cuma 39 ribu dapet tools lengkap buat CV & interview! Ini investasi terbaik buat cari kerja. Worth it banget!",
  },
  {
    name: "Dina",
    role: "Customer Service • Peterongan",
    text: "Keterima kerja karena grup ini. Makasih InfoLokerJombang! Sekarang gaji naik 2x lipat dari sebelumnya.",
  },
  {
    name: "Aldi",
    role: "IT Support • Jombang Kota",
    text: "Tools JobMate-nya keren! CV generator bikin CV jadi profesional. HRD sampai bilang 'CV kamu bagus banget!'",
  },
  {
    name: "Siti",
    role: "Cashier • Ploso",
    text: "Sebagai ibu rumah tangga yang mau kerja lagi, grup ini bantu banget. Info loker part-time juga banyak!",
  },
  {
    name: "Rendi",
    role: "Driver • Mojoagung",
    text: "Fresh graduate gak punya pengalaman? Tenang! Tools-nya ada yang khusus buat kita. Sekarang udah kerja di perusahaan bagus.",
  },
];

export const TestimonialMarquee = () => {
  return (
    <section className="py-24 bg-neutral-950 overflow-hidden">
       <div className="text-center mb-12 px-4">
           <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kata Mereka Yang Sudah <span className="text-brand">Sukses</span></h2>
       </div>

       <div className="relative flex overflow-x-hidden group">
           <div className="flex animate-marquee gap-6 py-4 group-hover:[animation-play-state:paused]">
               {[...testimonials, ...testimonials, ...testimonials].map((item, i) => (
                   <div 
                      key={i}
                      className="flex-shrink-0 w-[300px] md:w-[400px] p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors"
                   >
                       <div className="flex gap-1 mb-4">
                           {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                       </div>
                       <p className="text-neutral-300 mb-6 text-sm md:text-base leading-relaxed">"{item.text}"</p>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                               {item.name[0]}
                           </div>
                           <div>
                               <h4 className="text-white font-medium text-sm">{item.name}</h4>
                               <p className="text-xs text-neutral-500">{item.role}</p>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
           
           {/* Gradient Fade Sides */}
           <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />
       </div>
    </section>
  );
};
