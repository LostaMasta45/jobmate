"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mail, Sparkles, Send, PenTool, Brain, Search, Star, Clock, Calendar, CheckCircle2, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export type LoaderType = 'application' | 'inquiry' | 'follow_up' | 'thank_you' | 'general';

interface LoadingOverlayProps {
    isVisible: boolean;
    type?: LoaderType;
    message?: string; // Optional override
    subMessage?: string;
}

const PHASES_BY_TYPE = {
    application: [
        { text: "Menganalisis Profil & Lowongan...", icon: Brain, color: "text-blue-500" },
        { text: "Mencocokkan Skill dengan Syarat...", icon: Search, color: "text-purple-500" },
        { text: "Menonjolkan Kompetensi Utama...", icon: Star, color: "text-amber-500" },
        { text: "Finalisasi Surat Lamaran...", icon: Mail, color: "text-pink-500" },
    ],
    inquiry: [
        { text: "Riset Perusahaan & Target...", icon: BuildingIcon, color: "text-indigo-500" },
        { text: "Mencari Titik Hubung Personal...", icon: Search, color: "text-cyan-500" },
        { text: "Menyusun Intro yang Menarik...", icon: PenTool, color: "text-purple-500" },
        { text: "Memastikan Nada Profesional...", icon: CheckCircle2, color: "text-emerald-500" },
    ],
    follow_up: [
        { text: "Mengecek Riwayat Interaksi...", icon: Clock, color: "text-orange-500" },
        { text: "Menakar Waktu Pengiriman...", icon: Calendar, color: "text-blue-500" },
        { text: "Merangkai Pengingat Halus...", icon: PenTool, color: "text-purple-500" },
        { text: "Menghindari Kesan Memaksa...", icon: Shield, color: "text-green-500" },
    ],
    thank_you: [
        { text: "Mengingat Momen Interview...", icon: Brain, color: "text-yellow-500" },
        { text: "Menyusun Ucapan Apresiasi...", icon: HeartIcon, color: "text-red-500" },
        { text: "Menegaskan Ketertarikan...", icon: Star, color: "text-purple-500" },
        { text: "Menutup dengan Profesional...", icon: CheckCircle2, color: "text-green-500" },
    ],
    general: [
        { text: "Memahami Konteks...", icon: Brain, color: "text-blue-500" },
        { text: "Menyusun Strategi Komunikasi...", icon: PenTool, color: "text-purple-500" },
        { text: "Merangkai Narasi...", icon: Mail, color: "text-pink-500" },
        { text: "Menyempurnakan Tata Bahasa...", icon: Sparkles, color: "text-amber-500" },
    ]
};

// Helper component for Heart icon
function HeartIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}

// Helper component for Inquiry icon
function BuildingIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M8 10h.01" />
            <path d="M16 10h.01" />
            <path d="M8 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M16 18h.01" />
        </svg>
    )
}

export function LoadingOverlay({
    isVisible,
    type = 'general',
    message,
    subMessage = "AI sedang bekerja keras untukmu..."
}: LoadingOverlayProps) {
    const [phaseIndex, setPhaseIndex] = useState(0);

    const phases = PHASES_BY_TYPE[type] || PHASES_BY_TYPE.general;

    // Cycle through phases
    useEffect(() => {
        if (!isVisible) return;

        // Reset to 0 when becoming visible
        setPhaseIndex(0);

        const interval = setInterval(() => {
            setPhaseIndex((prev) => (prev + 1) % phases.length);
        }, 2000); // 2s per phase

        return () => clearInterval(interval);
    }, [isVisible, phases.length]);

    if (!isVisible) return null;

    const CurrentIcon = phases[phaseIndex].icon;
    const isLastPhase = phaseIndex === phases.length - 1;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
        >
            <div className="relative">
                {/* Central Container */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative flex items-center justify-center w-36 h-36"
                >
                    {/* Pulsing Background Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.6, 1],
                            opacity: [0.3, 0, 0.3],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-0 rounded-full blur-2xl bg-gradient-to-tr ${isLastPhase ? 'from-green-500/30 to-emerald-500/30' : 'from-purple-500/30 to-pink-500/30'}`}
                    />

                    {/* Rotating Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-slate-300 dark:border-slate-700 rounded-full opacity-40"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 border border-dotted border-slate-300 dark:border-slate-700 rounded-full opacity-40"
                    />

                    {/* Flying Particles - colored based on phase */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-1.5 h-1.5 rounded-full ${isLastPhase ? 'bg-emerald-400' : 'bg-purple-400'}`}
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                                x: [Math.cos(i * 45 * (Math.PI / 180)) * 70, 0],
                                y: [Math.sin(i * 45 * (Math.PI / 180)) * 70, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                            }}
                        />
                    ))}

                    {/* Main Icon Box */}
                    <div className="relative z-10 w-20 h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex items-center justify-center border border-slate-100 dark:border-zinc-800">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={phaseIndex}
                                initial={{ scale: 0.4, opacity: 0, rotateY: 90 }}
                                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                exit={{ scale: 0.4, opacity: 0, rotateY: -90 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <CurrentIcon className={`w-10 h-10 ${phases[phaseIndex].color} drop-shadow-sm`} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Orbiting Satellite */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-16px] rounded-full"
                    >
                        <div className={`w-3 h-3 rounded-full shadow-lg absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isLastPhase ? 'bg-green-500 shadow-green-500/50' : 'bg-blue-500 shadow-blue-500/50'}`} />
                    </motion.div>
                </motion.div>
            </div>

            {/* Text Animations */}
            <div className="mt-10 text-center space-y-3 relative z-10 px-4 h-20 min-w-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phaseIndex}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white">
                            {message || phases[phaseIndex].text}
                        </h3>
                    </motion.div>
                </AnimatePresence>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground font-medium text-sm sm:text-base"
                >
                    {subMessage}
                </motion.p>
            </div>
        </motion.div>
    );
}
