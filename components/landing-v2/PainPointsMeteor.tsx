"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PainPointsMeteor = () => {
  const [meteors, setMeteors] = useState<Array<{ top: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const meteorCount = 20;
    const newMeteors = new Array(meteorCount).fill(null).map(() => ({
      top: Math.floor(Math.random() * 100),
      left: Math.floor(Math.random() * 100),
      delay: Math.random() * 1 + 0.2,
      duration: Math.floor(Math.random() * 8 + 2),
    }));
    setMeteors(newMeteors);
  }, []);
  
  return (
    <section className="py-24 bg-neutral-950 text-white relative overflow-hidden">
       {/* Meteor Effect Layer */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {meteors.map((meteor, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]",
                        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent"
                    )}
                    style={{
                        top: meteor.top + "%",
                        left: meteor.left + "%",
                        animationDelay: meteor.delay + "s",
                        animationDuration: meteor.duration + "s",
                    }}
                />
            ))}
       </div>
       
       <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm font-medium">
                    Masalah Umum Pencari Kerja
                </span>
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500"
              >
                  Kamu Pasti Pernah <br className="hidden md:block"/> <span className="text-rose-500">Merasakan Ini...</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                 className="text-neutral-400 text-lg max-w-2xl mx-auto"
              >
                 Frustrasi cari kerja itu normal, tapi gak harus terus-terusan!
              </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center mb-16">
              <MeteorCard 
                  title="Info Gak Jelas"
                  description="Capek scroll tiap malam tapi info loker gak jelas."
                  icon={<span className="text-4xl">😩</span>}
                  delay={0}
              />
              <MeteorCard 
                  title="Loker Tutup / Gaji Zonk"
                  description="Loker udah tutup atau gaji gak sesuai ekspektasi."
                  icon={<span className="text-4xl">😕</span>}
                  delay={0.1}
              />
              <MeteorCard 
                  title="Notif Numpuk"
                  description="Notifikasi grup numpuk, gak tahu mana yang valid."
                  icon={<span className="text-4xl">😴</span>}
                  delay={0.2}
              />
               <MeteorCard 
                  title="Hasil Nihil"
                  description="Bosen cari tapi hasil nihil, gak ada panggilan."
                  icon={<span className="text-4xl">😔</span>}
                  delay={0.3}
              />
              <MeteorCard 
                  title="Ribet Buka Platform"
                  description="Mager karena harus buka banyak platform loker."
                  icon={<span className="text-4xl">😓</span>}
                  delay={0.4}
              />
          </div>
          
          {/* Emotional Hook */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-3xl mx-auto text-center bg-gradient-to-r from-rose-950/30 to-neutral-950/30 border border-rose-500/20 rounded-2xl p-8 backdrop-blur-sm"
          >
               <p className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight">
                💭 "Berapa lama lagi mau capek scroll grup loker <span className="text-rose-500">TANPA HASIL</span>?"
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-brand to-rose-500 mx-auto mb-6 rounded-full" />
              <p className="text-lg text-neutral-300 leading-relaxed">
                <span className="font-bold text-brand">Jangan khawatir</span> — Solusinya ada di <strong className="text-white">JOMBANG CAREER VIP</strong>
              </p>
          </motion.div>
       </div>
    </section>
  );
};

const MeteorCard = ({ title, description, icon, delay }: { title: string, description: string, icon: React.ReactNode, delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 0.5 }}
            className="group relative"
        >
            {/* Spotlight Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl overflow-hidden group-hover:border-white/20 transition-colors duration-500">
                
                {/* Floating Icon Background */}
                <div className="absolute -right-8 -top-8 bg-white/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />

                <div className="relative z-10">
                    <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/5 shadow-lg">
                        {icon}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-brand transition-colors duration-300">
                        {title}
                    </h3>
                    
                    <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                        {description}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}
