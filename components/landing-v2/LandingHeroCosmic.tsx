"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, MessageSquare, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Typewriter Effect Component ---
const TypewriterEffect = ({ words }: { words: { text: string; className?: string }[] }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex].text;
    const typeSpeed = isDeleting ? 50 : 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText.length === word.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className={cn("inline-block", words[currentWordIndex].className)}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

// --- Hero Visual Component (Replaces Card3D) ---
const HeroVisual = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative w-full aspect-[4/5] md:aspect-square max-w-sm mx-auto perspective-1000"
    >
        {/* Main Glass Card - VIP Pass */}
        <motion.div 
            style={{ transform: "translateZ(20px)" }}
            className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
        >
            {/* Card Header */}
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="font-bold text-white text-xs">JM</span>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Jombang Career VIP</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] text-green-400">Online • 203K+ Members</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Body - Notification Stream */}
            <div className="flex-1 p-4 space-y-3 overflow-hidden relative">
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

                {/* Notification 1 */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start hover:bg-white/10 transition-colors cursor-default"
                >
                    <div className="bg-brand/20 p-2 rounded-full mt-1">
                        <MessageSquare className="w-4 h-4 text-brand" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white mb-0.5">Info Loker Admin</p>
                        <p className="text-[10px] text-neutral-400 leading-snug">PT. Maju Sejahtera membuka lowongan staff admin. Gaji UMR. Min SMA/SMK.</p>
                        <span className="text-[9px] text-brand mt-1 block">Baru saja • Verified ✅</span>
                    </div>
                </motion.div>

                {/* Notification 2 */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start hover:bg-white/10 transition-colors cursor-default"
                >
                    <div className="bg-purple-500/20 p-2 rounded-full mt-1">
                        <Mail className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white mb-0.5">Undangan Interview</p>
                        <p className="text-[10px] text-neutral-400 leading-snug">Selamat! CV Anda lolos seleksi administrasi. Jadwal interview besok jam 09.00.</p>
                        <span className="text-[9px] text-purple-400 mt-1 block">Via Email JobMate</span>
                    </div>
                </motion.div>

                {/* Notification 3 */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start hover:bg-white/10 transition-colors cursor-default"
                >
                    <div className="bg-green-500/20 p-2 rounded-full mt-1">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white mb-0.5">Loker Update</p>
                        <p className="text-[10px] text-neutral-400 leading-snug">5 Loker baru ditambahkan hari ini. Cek sekarang sebelum tutup!</p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Glow */}
            <div className="h-1 w-full bg-gradient-to-r from-brand via-purple-500 to-brand animate-shine" />
        </motion.div>

        {/* Floating Elements (Outside Card) */}
        <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: "translateZ(50px)" }}
            className="absolute -right-4 top-20 bg-white text-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-20"
        >
            <span className="text-xs font-bold">🔥 Priority Access</span>
        </motion.div>

        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{ transform: "translateZ(40px)" }}
            className="absolute -left-4 bottom-20 bg-neutral-800 border border-white/10 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-20"
        >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium">Live Updates</span>
        </motion.div>
    </motion.div>
  );
};

export function LandingHeroCosmic() {
  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center bg-black relative overflow-hidden pt-32 md:pt-32 pb-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="absolute top-0 left-0 right-0 h-[500px] w-full bg-gradient-to-b from-brand/10 via-purple-500/5 to-transparent blur-3xl opacity-30 pointer-events-none" />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Left Content: Text */}
            <div className="flex-1 text-left space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/30 bg-brand/10 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(0,172,199,0.2)]">
                        <Sparkles className="w-4 h-4 text-brand" />
                        <span className="text-sm font-medium text-brand-100">Dipercaya 203.000+ Pencari Kerja</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                        STOP BUANG WAKTU <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-500">
                            CARI LOKER
                        </span> <br />
                        <TypewriterEffect 
                            words={[
                                { text: "YANG GAK JELAS!", className: "text-white" },
                                { text: "YANG HOAX!", className: "text-red-500" },
                                { text: "YANG EXPIRED!", className: "text-yellow-500" },
                            ]} 
                        />
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 font-light text-lg text-neutral-300 max-w-lg leading-relaxed"
                >
                    Kini Kamu <strong className="text-white font-semibold">NGGAK PERLU CAPEK</strong> scroll IG, FB, Telegram, atau platform lain. 
                    <span className="text-brand font-medium"> Semua loker valid & update setiap hari</span> langsung dikirim ke <strong className="text-white">GRUP WA PREMIUM!</strong>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-5 pt-4"
                >
                    <Button 
                        size="lg" 
                        className="bg-brand hover:bg-brand-600 text-white rounded-full px-8 h-14 text-lg shadow-[0_0_30px_rgba(0,172,199,0.4)] hover:shadow-[0_0_50px_rgba(0,172,199,0.6)] transition-all duration-300 group"
                    >
                        Gabung Sekarang
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                        variant="outline" 
                        size="lg" 
                        className="rounded-full px-8 h-14 text-lg border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                    >
                        Lihat Fitur Tools
                    </Button>
                </motion.div>

                <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 1, delay: 0.8 }}
                     className="pt-8 flex items-center gap-6 text-sm font-medium text-neutral-400 flex-wrap"
                >
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-green-500/20 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                        </div>
                        <span>Info Valid</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-purple-500/20 rounded-full">
                             <Sparkles className="w-3 h-3 text-purple-500" />
                        </div>
                        <span>Update Harian</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-brand/20 rounded-full">
                             <CheckCircle2 className="w-3 h-3 text-brand" />
                        </div>
                        <span>Mudah Daftar</span>
                    </div>
                </motion.div>
            </div>

            {/* Right Content: 3D Visual */}
            <div className="flex-1 w-full flex justify-center md:justify-end perspective-1000">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full max-w-md"
                >
                    <HeroVisual />
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}
