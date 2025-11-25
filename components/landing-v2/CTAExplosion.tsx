"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const CTAExplosion = () => {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; scale: number; duration: number; delay: number; width: number; height: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      x: 50 + (Math.random() * 100 - 50),
      y: 50 + (Math.random() * 100 - 50),
      scale: Math.random() + 0.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <section className="py-32 bg-black relative overflow-hidden flex items-center justify-center">
      
      {/* Background Explosion Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Center Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/20 blur-[120px] rounded-full opacity-50" />
          
          {/* Particles */}
          {particles.map((p, i) => (
              <motion.div
                  key={i}
                  initial={{ 
                      opacity: 0, 
                      x: "50%", 
                      y: "50%",
                      scale: 0 
                  }}
                  animate={{ 
                      opacity: [0, 1, 0], 
                      x: `${p.x}%`,
                      y: `${p.y}%`,
                      scale: [0, p.scale, 0]
                  }}
                  transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "easeOut"
                  }}
                  className="absolute top-0 left-0 w-2 h-2 bg-brand rounded-full shadow-[0_0_10px_rgba(0,172,199,0.8)]"
                  style={{
                      width: p.width + 'px',
                      height: p.height + 'px',
                  }}
              />
          ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
         <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-sm font-medium mb-8"
         >
            <Sparkles className="w-4 h-4" />
            <span>Limited Time Offer</span>
         </motion.div>

         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
         >
             Siap Merubah <br />
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-400 to-neutral-600">Nasib Karirmu?</span>
         </motion.h2>
         
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed"
         >
             Ribuan orang sudah terbantu. Sekarang giliran kamu. 
             <br/>Jangan biarkan kesempatan lewat begitu saja.
         </motion.p>

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-5"
         >
             <Button size="lg" className="bg-white text-black hover:bg-neutral-200 h-16 px-10 text-xl rounded-full font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 group">
                 Gabung VIP Sekarang
                 <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </Button>
         </motion.div>
         
         <p className="mt-8 text-sm text-neutral-500">
             Garansi 7 hari uang kembali • Batal kapan saja
         </p>
      </div>
    </section>
  );
};
