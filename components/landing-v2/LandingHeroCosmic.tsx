"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, MessageSquare, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Typewriter Effect Component (Pure CSS/JS, no framer-motion) ---
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

// --- Simple Hero Visual (CSS animations only, no framer-motion) ---
const HeroVisual = () => {
    return (
        <div className="relative w-full aspect-[4/5] md:aspect-square max-w-sm mx-auto animate-fade-in-up">
            {/* Main Glass Card - VIP Pass */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-black/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
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
                    {/* Notification 1 */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start animate-slide-in-left">
                        <div className="bg-brand/20 p-2 rounded-full mt-1">
                            <MessageSquare className="w-4 h-4 text-brand" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white mb-0.5">Info Loker Admin</p>
                            <p className="text-[10px] text-neutral-400 leading-snug">PT. Maju Sejahtera membuka lowongan staff admin.</p>
                            <span className="text-[9px] text-brand mt-1 block">Baru saja • Verified ✅</span>
                        </div>
                    </div>

                    {/* Notification 2 */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start animate-slide-in-left animation-delay-500">
                        <div className="bg-purple-500/20 p-2 rounded-full mt-1">
                            <Mail className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white mb-0.5">Undangan Interview</p>
                            <p className="text-[10px] text-neutral-400 leading-snug">CV Anda lolos seleksi administrasi.</p>
                            <span className="text-[9px] text-purple-400 mt-1 block">Via Email JobMate</span>
                        </div>
                    </div>

                    {/* Notification 3 */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex gap-3 items-start animate-slide-in-left animation-delay-1000">
                        <div className="bg-green-500/20 p-2 rounded-full mt-1">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white mb-0.5">Loker Update</p>
                            <p className="text-[10px] text-neutral-400 leading-snug">5 Loker baru ditambahkan hari ini.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Glow */}
                <div className="h-1 w-full bg-gradient-to-r from-brand via-purple-500 to-brand" />
            </div>

            {/* Floating Elements */}
            <div className="absolute -right-4 top-20 bg-white text-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-20 animate-float">
                <span className="text-xs font-bold">🔥 Priority Access</span>
            </div>

            <div className="absolute -left-4 bottom-20 bg-neutral-800 border border-white/10 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 z-20 animate-float animation-delay-1000">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Live Updates</span>
            </div>
        </div>
    );
};

export function LandingHeroCosmic() {
    return (
        <div className="min-h-screen w-full flex md:items-center md:justify-center bg-black relative overflow-hidden pt-32 md:pt-32 pb-20">
            {/* Background Effects - Static, no JS */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute top-0 left-0 right-0 h-[500px] w-full bg-gradient-to-b from-brand/10 via-purple-500/5 to-transparent blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />

            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">

                    {/* Left Content: Text - CSS animations only */}
                    <div className="flex-1 text-left space-y-8">
                        <div className="animate-fade-in-up">
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
                        </div>

                        <p className="mt-6 font-light text-lg text-neutral-300 max-w-lg leading-relaxed animate-fade-in-up animation-delay-200">
                            Kini Kamu <strong className="text-white font-semibold">NGGAK PERLU CAPEK</strong> scroll IG, FB, Telegram, atau platform lain.
                            <span className="text-brand font-medium"> Semua loker valid & update setiap hari</span> langsung dikirim ke <strong className="text-white">GRUP WA PREMIUM!</strong>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 pt-4 animate-fade-in-up animation-delay-400">
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
                        </div>

                        <div className="pt-8 flex items-center gap-6 text-sm font-medium text-neutral-400 flex-wrap animate-fade-in-up animation-delay-800">
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
                        </div>
                    </div>

                    {/* Right Content: Visual */}
                    <div className="flex-1 w-full flex justify-center md:justify-end">
                        <div className="relative w-full max-w-md animate-fade-in-up animation-delay-200">
                            <HeroVisual />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
