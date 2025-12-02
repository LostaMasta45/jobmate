"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, User, Building2, CheckCircle2, Fingerprint, Sparkles } from "lucide-react";

interface ScannerLoaderProps {
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export function ScannerLoader({ status, message }: ScannerLoaderProps) {
  const [scanCycle, setScanCycle] = React.useState(0);

  React.useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setScanCycle(prev => prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center font-sans overflow-hidden"
    >
      {/* --- BACKGROUND: TECH GRID --- */}
      <div className="absolute inset-0 z-0">
        {/* Grid Pattern */}
        <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
                backgroundImage: 'linear-gradient(#6e52e0 1px, transparent 1px), linear-gradient(to right, #6e52e0 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent" />
        
        {/* Glowing Orbs */}
        <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#8e68fd] rounded-full blur-[100px] opacity-30" 
        />
        <motion.div 
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00acc7] rounded-full blur-[100px] opacity-30" 
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center">
        
        <div className="relative w-64 h-80 perspective-1000">
            <AnimatePresence mode="wait">
                {status !== 'success' ? (
                    /* === STATE 1: RESUME SCANNING === */
                    <motion.div
                        key="resume"
                        initial={{ opacity: 0, rotateX: 20 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Paper Header */}
                        <div className="h-20 bg-slate-50 border-b border-slate-100 p-4 flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                                <User className="w-full h-full p-2 text-slate-400" />
                            </div>
                            <div className="space-y-2">
                                <div className="w-24 h-2.5 bg-slate-800 rounded-full" />
                                <div className="w-16 h-2 bg-slate-300 rounded-full" />
                            </div>
                        </div>

                        {/* Paper Body */}
                        <div className="p-5 space-y-4 flex-1">
                             {/* Skill Bars */}
                             <div className="space-y-2">
                                {[0.8, 0.6, 0.9].map((width, i) => (
                                    <div key={i} className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${width * 100}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className="h-full bg-slate-300" 
                                        />
                                    </div>
                                ))}
                             </div>

                             {/* Text Lines */}
                             <div className="space-y-2 pt-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-full h-2 bg-slate-100 rounded-full" style={{ width: `${Math.random() * 40 + 60}%`}} />
                                ))}
                             </div>
                        </div>

                        {/* === SCANNER BEAM === */}
                        <motion.div
                            className="absolute left-0 w-full h-12 bg-gradient-to-b from-[#00acc7]/50 to-transparent z-20 border-t-2 border-[#00acc7] shadow-[0_0_20px_rgba(0,172,199,0.5)]"
                            animate={{ top: ["-20%", "120%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Scanning particles */}
                            <div className="absolute top-0 left-0 w-full h-px bg-white/50" />
                        </motion.div>

                        {/* Status Overlay Text (Holographic) */}
                        <div className="absolute bottom-4 left-0 w-full text-center">
                            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Analyzing Profile...</span>
                        </div>
                    </motion.div>
                ) : (
                    /* === STATE 2: EMPLOYEE ID BADGE === */
                    <motion.div
                        key="badge"
                        initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className="relative w-full h-full"
                    >
                        {/* Lanyard String */}
                        <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 100 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="absolute -top-24 left-1/2 -translate-x-1/2 w-2 bg-[#334155] z-0"
                        />
                         <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#1e293b] rounded-md z-0"
                        />

                        {/* ID Badge Card */}
                        <div className="relative w-full h-full bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col items-center pt-8 pb-4 z-10">
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                            
                            {/* Avatar */}
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                className="w-24 h-24 rounded-full p-1 bg-gradient-to-r from-[#8e68fd] to-[#00acc7]"
                            >
                                <div className="w-full h-full bg-slate-800 rounded-full overflow-hidden flex items-center justify-center relative">
                                    <User className="w-12 h-12 text-white" />
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-[#1e293b]"
                                    >
                                        <CheckCircle2 className="w-3 h-3 text-white" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Content */}
                            <div className="text-center mt-6 space-y-1">
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-xl font-bold text-white"
                                >
                                    Welcome Aboard!
                                </motion.div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-sm text-[#00acc7] font-medium"
                                >
                                    Verified Employee
                                </motion.div>
                            </div>

                            {/* Bottom Tech Decor */}
                            <div className="mt-auto w-full px-6">
                                <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] text-slate-400">ID NUMBER</span>
                                        <span className="text-xs font-mono text-white">JM-8829-X</span>
                                    </div>
                                    <Fingerprint className="w-8 h-8 text-[#8e68fd]/50" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* --- TEXT STATUS --- */}
        <div className="mt-12 h-16 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                {status !== 'success' ? (
                    <motion.div
                        key="scanning-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-2 text-[#00acc7]">
                            <Scan className="w-4 h-4 animate-pulse" />
                            <span className="text-sm font-medium tracking-wider uppercase">AI Scanning in progress</span>
                        </div>
                        <p className="text-xs text-slate-400">Mencocokkan kualifikasi terbaik...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success-text"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="flex items-center gap-2 text-green-400">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold tracking-wider uppercase">Access Granted</span>
                        </div>
                        <p className="text-xs text-slate-400">Mengalihkan ke Dashboard...</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}
