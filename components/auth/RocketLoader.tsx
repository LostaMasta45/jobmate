"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Star, Cloud, CheckCircle2, Briefcase, TrendingUp } from "lucide-react";

interface RocketLoaderProps {
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export function RocketLoader({ status, message }: RocketLoaderProps) {
  
  // Generate random stars for space background
  const stars = React.useMemo(() => [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2
  })), []);

  // Generate clouds for atmosphere layer
  const clouds = React.useMemo(() => [...Array(5)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    scale: Math.random() * 0.5 + 0.8,
    delay: i * 0.8
  })), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#0b1026] flex flex-col items-center justify-center font-sans overflow-hidden"
    >
      {/* === BACKGROUND LAYERS === */}
      
      {/* 1. Deep Space Gradient - Using Brand Colors mixed with deep space */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b1026] via-[#1b1e44] to-[#2a2d5a]" />
      
      {/* 2. Stars (Parallax Effect) */}
      <div className="absolute inset-0 z-0">
        {stars.map((star) => (
            <motion.div
                key={star.id}
                className="absolute bg-white rounded-full"
                style={{ 
                    left: `${star.x}%`, 
                    top: `${star.y}%`,
                    width: star.size, 
                    height: star.size 
                }}
                animate={{ 
                    opacity: [0.2, 1, 0.2],
                    y: [0, 200] // Move stars down to simulate upward movement
                }}
                transition={{ 
                    opacity: { duration: star.delay + 1, repeat: Infinity },
                    y: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
            />
        ))}
      </div>

      {/* 3. Passing Clouds (Atmosphere) - Only visible in loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-1 pointer-events-none">
            {clouds.map((cloud) => (
                <motion.div
                    key={cloud.id}
                    className="absolute text-white/5"
                    style={{ left: `${cloud.x}%` }}
                    initial={{ top: "110%" }}
                    animate={{ top: "-20%" }}
                    transition={{ 
                        duration: 4, 
                        repeat: Infinity, 
                        delay: cloud.delay,
                        ease: "linear"
                    }}
                >
                    <Cloud size={100 * cloud.scale} fill="currentColor" />
                </motion.div>
            ))}
        </div>
      )}

      {/* === MAIN CONTENT: THE ROCKET === */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        
        <AnimatePresence mode="wait">
            {status !== 'success' ? (
                /* === LOADING: LAUNCH PHASE === */
                <motion.div
                    key="rocket-launch"
                    className="relative"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -800, opacity: 0, transition: { duration: 0.8, ease: [0.32, 0.72, 0, 1] } }}
                >
                    {/* Speed Lines */}
                    <div className="absolute -inset-20 overflow-hidden pointer-events-none">
                         {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute top-0 w-0.5 bg-white/20 rounded-full blur-[1px]"
                                style={{ 
                                    left: `${20 + i * 15}%`,
                                    height: Math.random() * 50 + 50 + 'px'
                                }}
                                animate={{ top: ['-20%', '120%'], opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "linear" }}
                            />
                         ))}
                    </div>

                    {/* The Rocket Ship */}
                    <motion.div
                        animate={{ 
                            y: [-5, 5, -5],
                            x: [-2, 2, -2] 
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-32 h-48 flex items-center justify-center"
                    >
                        {/* Body */}
                        <div className="w-14 h-32 bg-white rounded-[50%] relative z-20 shadow-[inset_-8px_0_15px_rgba(0,0,0,0.1)] overflow-hidden">
                             {/* Window */}
                             <div className="absolute top-6 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#00acc7] rounded-full border-4 border-[#e2e8f0] flex items-center justify-center shadow-inner">
                                <div className="w-2 h-2 bg-white rounded-full absolute top-1.5 right-1.5 opacity-60" />
                             </div>
                             {/* Branding / Stripe - Using Heliotrope */}
                             <div className="absolute bottom-0 w-full h-12 bg-[#8e68fd]" />
                             <div className="absolute bottom-12 w-full h-2 bg-[#5547d0]" />
                        </div>

                        {/* Fins - Using Pacific Blue and Purple Heart */}
                        <div className="absolute bottom-4 -left-4 w-8 h-14 bg-[#5547d0] rounded-l-full transform skew-y-12 z-10 border-r border-black/10 shadow-lg" />
                        <div className="absolute bottom-4 -right-4 w-8 h-14 bg-[#5547d0] rounded-r-full transform -skew-y-12 z-10 border-l border-black/10 shadow-lg" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-6 bg-[#3977d3] z-25 rounded-b-full" />

                        {/* Thruster Flame */}
                        <motion.div
                            className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-8"
                            animate={{ height: [40, 65, 40], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 0.15, repeat: Infinity }}
                        >
                            <div className="w-full h-full bg-gradient-to-t from-transparent via-[#00acc7] to-[#8e68fd] rounded-b-full blur-[4px]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-[70%] bg-white rounded-b-full blur-[2px]" />
                        </motion.div>
                        
                        {/* Engine Glow */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#00acc7] rounded-full blur-[20px] opacity-40" />
                    </motion.div>
                </motion.div>
            ) : (
                /* === SUCCESS: ARRIVAL PHASE === */
                <motion.div
                    key="planet-arrival"
                    initial={{ scale: 0, rotate: 180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
                    className="relative"
                >
                    {/* Planet JobMate */}
                    <div className="relative w-56 h-56">
                        {/* Atmosphere Glow - Heliotrope */}
                        <div className="absolute inset-0 rounded-full bg-[#8e68fd] blur-[50px] opacity-40" />
                        
                        {/* Planet Body - Gradient using Brand Colors */}
                        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#3977d3] shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/10">
                            {/* Craters/Details */}
                            <div className="absolute top-6 right-10 w-8 h-5 bg-black/10 rounded-full rotate-12 blur-[1px]" />
                            <div className="absolute bottom-10 left-8 w-12 h-7 bg-black/10 rounded-full -rotate-6 blur-[1px]" />
                            <div className="absolute top-1/2 left-6 w-full h-12 bg-white/5 -rotate-12 transform skew-x-12 blur-[20px]" />
                            
                            {/* Continent shapes */}
                            <div className="absolute -right-4 top-1/3 w-20 h-20 bg-[#00acc7]/20 rounded-full blur-[10px]" />
                        </div>

                        {/* Flag / Success Marker */}
                        <motion.div 
                            initial={{ y: -40, opacity: 0, scale: 0.5 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="flex flex-col items-center relative">
                                {/* Pole */}
                                <div className="w-1 h-20 bg-white/80 rounded-full shadow-lg" />
                                {/* Flag */}
                                <motion.div 
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                    className="absolute top-1 left-1/2 w-28 h-16 bg-gradient-to-r from-[#00acc7] to-[#00d1dc] rounded-r-xl origin-left flex items-center justify-center shadow-lg border border-white/20"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-white font-extrabold text-sm uppercase tracking-wider drop-shadow-md">SUKSES!</span>
                                        <span className="text-[10px] text-white/90 font-medium">Selamat Datang</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Orbiting Rocket */}
                        <motion.div
                            className="absolute inset-[-30px]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-90">
                                <Rocket className="w-6 h-6 text-white fill-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-white to-transparent opacity-30 blur-[1px]" />
                            </div>
                        </motion.div>
                        
                        {/* Confetti/Sparkles effect on success */}
                        <div className="absolute inset-0 pointer-events-none">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute left-1/2 top-1/2 w-1 h-1 bg-[#00d1dc] rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ 
                                        scale: [0, 1, 0], 
                                        x: Math.cos(i * 30 * (Math.PI / 180)) * 100,
                                        y: Math.sin(i * 30 * (Math.PI / 180)) * 100,
                                    }}
                                    transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- TEXT STATUS --- */}
        <div className="mt-20 z-20 text-center min-h-[80px]">
            <AnimatePresence mode="wait">
                {status !== 'success' ? (
                    <motion.div
                        key="launching"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative"
                    >
                        <h2 className="text-2xl font-black text-white tracking-wider uppercase italic drop-shadow-lg">
                            Meluncur<span className="animate-pulse">...</span>
                        </h2>
                        <div className="mt-2 flex items-center justify-center gap-2">
                            <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-[#00d1dc]"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>
                        <p className="text-[#00acc7] text-xs mt-2 font-mono uppercase tracking-widest opacity-80">
                            Memulai Mesin Karir
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="landed"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 shadow-2xl"
                    >
                        <div className="flex items-center gap-2 text-[#00d1dc] mb-1 justify-center">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-wide text-sm">Misi Berhasil</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-white/90 text-xs font-medium">Selamat datang di dashboard Anda.</p>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.5 }}
                                className="flex items-center gap-1.5 text-[10px] text-[#00acc7] mt-1 bg-white/5 px-2 py-1 rounded-full border border-white/10"
                            >
                                <div className="w-2 h-2 border-2 border-[#00acc7] border-t-transparent rounded-full animate-spin" />
                                <span className="font-mono tracking-wider">MEMUAT DASHBOARD...</span>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
