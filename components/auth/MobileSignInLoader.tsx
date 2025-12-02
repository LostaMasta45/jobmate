"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

interface MobileSignInLoaderProps {
  status: 'loading' | 'success' | 'error';
  message?: string;
}

export function MobileSignInLoader({ status, message }: MobileSignInLoaderProps) {
  const [successStep, setSuccessStep] = React.useState(0);
  const [msgIndex, setMsgIndex] = React.useState(0);

  const loadingMessages = [
    "Merapikan dokumen lamaran...",
    "Berangkat menuju kantor...",
    "Melapor ke resepsionis...",
    "Menunggu panggilan interview...",
    "Menjabat tangan HRD..."
  ];

  React.useEffect(() => {
    if (status === 'success') {
      setTimeout(() => setSuccessStep(1), 500);
    }
    if (status === 'loading') {
      const interval = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1800);
      return () => clearInterval(interval);
    }
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center font-sans overflow-hidden"
    >
      {/* --- BACKGROUND GRADIENT & PARTICLES (MATCHING LOGIN) --- */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd] via-[#6e52e0] to-[#00acc7] z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(142,104,253,0.5),transparent_50%)] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,209,220,0.4),transparent_50%)] mix-blend-soft-light" />
        
        {/* Animated Background Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random()
            }}
            animate={{ 
              y: [null, Math.random() * -100],
              opacity: [0.2, 0]
            }}
            transition={{ 
              duration: Math.random() * 5 + 5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}
      </div>

      {/* --- SCROLLING CITYSCAPE (Subtle Overlay) --- */}
      <div className="absolute bottom-0 w-full h-1/2 z-0 opacity-20 pointer-events-none mix-blend-overlay">
        <motion.div
          className="absolute bottom-0 left-0 flex w-[200%]"
          animate={status === 'success' ? { x: 0 } : { x: ["0%", "-50%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {[1, 2].map((_, i) => (
            <div key={i} className="w-full h-64 flex items-end gap-1 px-4">
              {[...Array(25)].map((_, j) => (
                <div 
                  key={j} 
                  className="bg-white rounded-t-sm"
                  style={{ 
                    width: Math.random() * 30 + 10 + "px",
                    height: Math.random() * 80 + 20 + "px",
                    opacity: Math.random() * 0.5 + 0.2
                  }} 
                />
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* --- MAIN CHARACTER CONTAINER --- */}
      <div className="relative z-10 flex flex-col items-center transform scale-110">
        
        {status === 'success' ? (
          /* SUCCESS STATE */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 relative"
          >
            {/* Burst Effect Background */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/20 rounded-full blur-xl"
            />

            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center relative z-10"
            >
              <CheckCircle2 className="w-12 h-12 text-[#00acc7]" />
              {/* Corner Sparkles */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 bg-[#8e68fd] p-1.5 rounded-full border-2 border-white"
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="text-center text-white relative z-10">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold drop-shadow-md"
              >
                Berhasil Masuk!
              </motion.h3>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/80 mt-2 font-medium"
              >
                Selamat datang kembali
              </motion.p>
            </div>
          </motion.div>
        ) : (
          /* WALKING STATE */
          <div className="relative w-48 h-64 flex items-center justify-center">
            
            {/* SHADOW */}
            <motion.div 
                className="absolute bottom-10 w-24 h-4 bg-black/20 rounded-full blur-md"
                animate={{ scaleX: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* CHARACTER */}
            <motion.div
              className="relative flex flex-col items-center"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* HEAD */}
              <div className="w-14 h-14 bg-[#ffdecb] rounded-2xl z-20 relative border-b-4 border-[#e0c0ae] shadow-lg">
                 {/* Hair */}
                 <div className="absolute -top-2 -left-1 w-[110%] h-6 bg-[#2d3436] rounded-t-xl rounded-br-xl" />
                 {/* Glasses */}
                 <div className="absolute top-5 left-2 flex gap-1">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-white/20 backdrop-blur-sm" />
                    <div className="w-4 h-4 rounded-full border-2 border-slate-800 bg-white/20 backdrop-blur-sm" />
                    <div className="absolute top-1.5 left-4 w-2 h-0.5 bg-slate-800" />
                 </div>
                 {/* Smile */}
                 <div className="absolute bottom-3 left-4 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
              </div>

              {/* BODY */}
              <div className="w-20 h-24 bg-white rounded-2xl z-10 -mt-2 shadow-md flex flex-col items-center relative overflow-hidden">
                  {/* Collar */}
                  <div className="absolute top-0 w-full h-full bg-white">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[16px] border-t-[#ffdecb] z-10" />
                     {/* Tie */}
                     <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-16 bg-[#5547d0] rounded-b-md shadow-sm" />
                     {/* Pocket */}
                     <div className="absolute top-10 left-2 w-5 h-6 border-t border-slate-200 rounded-b-md" />
                  </div>
              </div>

              {/* ARMS */}
              {/* Left Arm (Back) */}
              <motion.div
                className="absolute top-16 -left-3 w-5 h-20 bg-white rounded-full origin-top z-0 shadow-inner flex flex-col items-center justify-end"
                animate={{ rotate: [35, -35, 35] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                 <div className="absolute bottom-0 w-full h-5 bg-[#ffdecb] rounded-full" />
                 
                 {/* Briefcase */}
                 <div className="absolute top-[85%] -left-4 w-14 h-10 bg-[#3e2723] rounded-sm border-2 border-[#281917] transform rotate-12 shadow-md z-0">
                    {/* Handle */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-3 border-4 border-[#281917] rounded-t-lg" />
                    {/* Flap */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-[#4e342e] border-b border-[#281917]" />
                    {/* Clasps */}
                    <div className="absolute top-3 left-2 w-1.5 h-2 bg-[#ffb300] rounded-[1px]" />
                    <div className="absolute top-3 right-2 w-1.5 h-2 bg-[#ffb300] rounded-[1px]" />
                 </div>
              </motion.div>

              {/* Right Arm (Front - Holding Envelope) */}
              <motion.div
                className="absolute top-16 -right-3 w-5 h-16 bg-white rounded-full origin-top z-30 flex flex-col items-center shadow-lg"
                animate={{ rotate: [-35, 35, -35] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                 {/* ENVELOPE - HYPER REALISTIC */}
                 <div className="absolute -bottom-8 -right-5 w-16 h-11 z-0 transform -rotate-12 origin-top-left">
                    {/* Drop Shadow */}
                    <div className="absolute inset-0 rounded-sm bg-black/20 blur-[2px] translate-y-1 translate-x-1" />
                    
                    {/* Main Body Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8d6e63] via-[#795548] to-[#5d4037] rounded-sm border border-[#4e342e]" />
                    
                    {/* Paper Slip Poking Out */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-[92%] h-3 bg-[#f5f5f5] rounded-t-sm shadow-inner" />

                    {/* Flap (SVG for perfect shape) */}
                    <svg viewBox="0 0 64 36" className="absolute top-0 left-0 w-full h-auto drop-shadow-md z-10">
                        <path d="M0 0 L32 26 L64 0" fill="#a1887f" stroke="#5d4037" strokeWidth="0.5" />
                    </svg>

                    {/* String Tie Mechanism */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#d7ccc8] rounded-full border border-[#8d6e63] shadow-sm z-20" />
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#d7ccc8] rounded-full border border-[#8d6e63] shadow-sm z-20" />
                    
                    {/* The String */}
                    <svg className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-4 z-10 pointer-events-none overflow-visible">
                        <path d="M1 0 Q 4 2 1 4" stroke="rgba(255,255,255,0.8)" strokeWidth="0.5" fill="none" />
                    </svg>

                    {/* CV Label - Sticker Style */}
                    <div className="absolute bottom-1.5 right-1.5 bg-[#fff9c4] px-1.5 py-0.5 rounded-[1px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-yellow-200 transform -rotate-2">
                        <div className="flex items-center gap-0.5">
                            <div className="w-1 h-1 bg-red-500 rounded-full" />
                            <span className="text-[5px] font-bold text-slate-800 leading-none tracking-tight">CONFIDENTIAL</span>
                        </div>
                    </div>
                 </div>

                 {/* Hand (Fist) - Placed AFTER envelope to appear 'holding' it */}
                 <div className="absolute -bottom-2 w-6 h-6 bg-[#ffdecb] rounded-full border border-[#e0c0ae] z-10 shadow-sm flex items-center justify-center">
                    {/* Fingers wrapping around (knuckles) */}
                    <div className="absolute top-0.5 w-5 h-2 bg-[#f5d0b0] rounded-full opacity-50" />
                    
                    {/* Thumb wrapping around - Positioned to look like a firm grip */}
                    <div className="absolute -top-1 -left-1 w-3 h-4 bg-[#ffdecb] rounded-full border border-[#e0c0ae] transform -rotate-45 shadow-sm z-20" />
                 </div>
              </motion.div>

              {/* LEGS */}
              <div className="relative mt-[-6px] w-full flex justify-center">
                 {/* Left Leg */}
                 <motion.div 
                    className="absolute top-0 left-3 w-7 h-24 bg-[#2d3436] rounded-full origin-top z-10"
                    animate={{ 
                        rotate: [-40, 40, -40],
                        y: [0, -2, 0]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                 >
                    <div className="absolute bottom-0 -left-2 w-10 h-5 bg-black rounded-xl" />
                 </motion.div>

                 {/* Right Leg */}
                 <motion.div 
                    className="absolute top-0 right-3 w-7 h-24 bg-[#2d3436] rounded-full origin-top z-0"
                    animate={{ 
                        rotate: [40, -40, 40],
                        y: [0, -2, 0]
                    }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                 >
                    <div className="absolute bottom-0 -left-2 w-10 h-5 bg-black rounded-xl" />
                 </motion.div>
              </div>
            </motion.div>
          </div>
        )}

        {/* TEXT STATUS */}
        {status === 'loading' && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 text-center z-20"
            >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-1 tracking-wide min-w-[240px]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={msgIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {loadingMessages[msgIndex]}
                            </motion.span>
                        </AnimatePresence>
                    </h3>
                    <motion.div 
                        className="h-1 w-32 bg-white/20 rounded-full overflow-hidden mx-auto mt-2"
                    >
                        <motion.div 
                            className="h-full bg-[#00d1dc]"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </div>
            </motion.div>
        )}

      </div>
    </motion.div>
  );
}
