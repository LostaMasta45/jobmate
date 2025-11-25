"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
    FileText, 
    Mail, 
    LayoutDashboard, 
    MessageSquare, 
    Award, 
    FileEdit, 
    FolderOpen, 
    User,
    ArrowUpRight,
    Sparkles
} from "lucide-react";

export const BentoGridPro = () => {
  return (
    <section id="features" className="py-24 bg-black text-white relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
             <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6"
            >
                <span className="text-sm text-brand">🚀 Eksklusif untuk VIP Premium</span>
            </motion.div>
            
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-6"
            >
                Apa Itu <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand to-purple-500">Tools JobMate?</span>
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-neutral-400 text-lg max-w-2xl mx-auto"
            >
                Semua yang kamu butuh untuk <strong className="text-white">siap kerja</strong> — dari buat CV, kirim lamaran, sampai track progress interview.
            </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
            {/* 1. CV ATS (Large) */}
            <BentoCard
                title="CV ATS Generator"
                description="Buat CV otomatis yang lolos sistem HRD dengan format profesional."
                Icon={FileText}
                iconColor="text-blue-400"
                className="md:col-span-2 md:row-span-2 min-h-[300px]"
                delay={0}
            >
                <div className="absolute right-4 bottom-4 w-2/3 h-2/3 bg-neutral-900 border border-white/10 rounded-tl-2xl overflow-hidden opacity-50 group-hover:opacity-100 transition-all duration-500">
                     <div className="p-4 space-y-2">
                         <div className="h-2 w-1/3 bg-white/20 rounded" />
                         <div className="h-2 w-full bg-white/10 rounded" />
                         <div className="h-2 w-full bg-white/10 rounded" />
                     </div>
                     <motion.div 
                        className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        animate={{ top: ["0%", "100%", "0%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     />
                </div>
            </BentoCard>

            {/* 2. Cover Letter */}
            <BentoCard
                title="Template Surat Lamaran"
                description="20+ contoh surat lamaran kerja formal & kreatif."
                Icon={Mail}
                iconColor="text-purple-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.1}
            />

            {/* 3. Tracker */}
            <BentoCard
                title="Job Tracker"
                description="Pantau semua lamaranmu: Terkirim – Interview – Diterima."
                Icon={LayoutDashboard}
                iconColor="text-emerald-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.2}
            />

            {/* 4. WA Generator */}
            <BentoCard
                title="WA Generator"
                description="Bikin pesan WA profesional saat kirim lamaran."
                Icon={MessageSquare}
                iconColor="text-green-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.3}
            />

            {/* 5. Skill Resume */}
            <BentoCard
                title="Skill-Based Resume"
                description="Buat CV berbasis keahlian, cocok untuk freshgraduate!"
                Icon={Award}
                iconColor="text-amber-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.4}
            />

            {/* 6. Interview Checklist (Wide) */}
            <BentoCard
                title="Interview Checklist"
                description="Daftar pertanyaan umum, tips, dan trik menjawab versi HRD."
                Icon={FileEdit}
                iconColor="text-pink-400"
                className="md:col-span-2 md:row-span-1"
                delay={0.5}
            >
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden lg:block">
                    <div className="flex gap-2">
                        <div className="bg-pink-500/20 text-pink-300 text-xs px-2 py-1 rounded">STAR Method</div>
                        <div className="bg-pink-500/20 text-pink-300 text-xs px-2 py-1 rounded">Do & Don't</div>
                    </div>
                 </div>
            </BentoCard>

            {/* 7. PDF Tools */}
            <BentoCard
                title="PDF Tools"
                description="Gabungkan & kompres file lamaran langsung."
                Icon={FolderOpen}
                iconColor="text-red-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.6}
            />

            {/* 8. Profile Builder */}
            <BentoCard
                title="Profile Builder"
                description="Simpan data diri agar form lamaran auto-generate."
                Icon={User}
                iconColor="text-indigo-400"
                className="md:col-span-1 md:row-span-1"
                delay={0.7}
            />
        </div>
      </div>
    </section>
  );
};

const BentoCard = ({
  title,
  description,
  Icon,
  iconColor,
  className,
  children,
  delay,
}: {
  title: string;
  description: string;
  Icon: React.ElementType;
  iconColor?: string;
  className?: string;
  children?: React.ReactNode;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/50 p-6 hover:border-white/20 transition-all duration-300 group flex flex-col",
        className
      )}
    >
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={cn("w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5", iconColor && `group-hover:${iconColor.replace('text-', 'text-')}`)}>
            <Icon className={cn("w-5 h-5 transition-colors", iconColor)} />
        </div>

        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-brand transition-colors duration-300">
            {title}
        </h3>
        <p className="text-sm text-neutral-400 leading-relaxed group-hover:text-neutral-300 transition-colors">
            {description}
        </p>
      </div>

      {children}
    </motion.div>
  );
};
