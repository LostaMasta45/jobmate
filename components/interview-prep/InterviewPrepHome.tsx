"use client";

import { motion } from "framer-motion";
import {
    History,
    ArrowRight,
    Sparkles,
    Briefcase,
    Target,
    Zap,
    FileText,
    CheckCircle2,
    Users
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { Button } from "@/components/ui/button";
import { HistoryCard } from "@/components/tools/HistoryCard";

interface InterviewPrepHomeProps {
    onSelectView: (view: 'wizard' | 'history') => void;
    totalSessions?: number;
}

export function InterviewPrepHome({ onSelectView, totalSessions = 0 }: InterviewPrepHomeProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/50 dark:bg-black/95 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30">
            <BackgroundPattern theme="blue" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 relative"
                >


                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 leading-tight">
                        Master Your <span className="text-blue-600 dark:text-blue-500 relative inline-block">
                            Interview
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Dapatkan <span className="font-bold text-slate-900 dark:text-white">pertanyaan prediksi</span> yang dipersonalisasi berdasarkan CV dan Job Description. Latihan jawaban metode STAR.
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20"
                >
                    {/* Featured Create Tool Spans 8 Cols */}
                    <div className="md:col-span-8 lg:col-span-8">
                        <MagicCard
                            className="h-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-900 dark:to-black text-white border-none overflow-hidden relative"
                            onClick={() => onSelectView('wizard')}
                            gradientFrom="blue-600/20"
                            gradientTo="blue-900/20"
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="p-6 md:p-8 xl:p-10 flex flex-col xl:flex-row items-center h-full gap-6 xl:gap-8 relative z-10">
                                <div className="flex-1 space-y-6 w-full text-center xl:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-blue-500/20 backdrop-blur-sm mx-auto xl:mx-0">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Personalized • Gap Analysis
                                    </div>
                                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                                        Mulai Simulasi <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-600">Interview Baru.</span>
                                    </h2>
                                    <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto xl:mx-0 leading-relaxed">
                                        Upload CV & Job Poster. AI akan berikan <span className="text-blue-400 font-semibold">30-40 pertanyaan</span> spesifik untuk posisi tersebut.
                                    </p>
                                    <Button className="w-full md:w-auto rounded-xl bg-white text-slate-900 dark:bg-blue-600 dark:text-white hover:bg-slate-50 dark:hover:bg-blue-700 border-none px-8 py-6 text-base md:text-lg font-bold shadow-xl shadow-blue-900/10 dark:shadow-blue-900/20 group hover:scale-[1.02] transition-all duration-300">
                                        Mulai Sekarang
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                {/* Featured Visual */}
                                <div className="relative w-full max-w-[280px] md:max-w-[320px] xl:max-w-none xl:w-64 h-64 md:h-72 xl:h-64 flex-shrink-0 perspective-1000 block mt-4 xl:mt-0">
                                    <motion.div
                                        animate={{ rotateY: [-10, 10, -10], rotateX: [5, -5, 5] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3 transform-style-3d items-center justify-center relative"
                                    >
                                        <div className="absolute inset-0 bg-blue-500/20 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative z-10 p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-xl mb-4 group-hover:rotate-6 transition-transform duration-500">
                                            <Target className="h-16 w-16 text-white" strokeWidth={1.5} />
                                        </div>
                                        <div className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 animate-bounce delay-700">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>

                    {/* Stats Widget */}
                    <div className="md:col-span-4 lg:col-span-4">
                        <MagicCard
                            className="h-full bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between group"
                            gradientFrom="blue-500/5"
                            gradientTo="blue-900/5"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800">
                                        <Users className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Practice</span>
                                </div>

                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="relative inline-block"
                                    >
                                        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {totalSessions}
                                        </span>
                                        <span className="absolute -top-2 -right-6 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                                            SESSIONS
                                        </span>
                                    </motion.div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Completed Sessions</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">STAR</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Method</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">AI</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Analysis</div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-zinc-700 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors" disabled>
                                    Lihat Progress
                                </Button>
                            </div>
                        </MagicCard>
                    </div>

                    {/* History / Secondary Card */}
                    <div className="md:col-span-12">
                        <HistoryCard
                            title="Riwayat Interview"
                            description="Lihat kembali pertanyaan dan latihan jawaban Anda sebelumnya."
                            icon={History}
                            onClick={() => onSelectView('history')}
                            buttonText="Buka Riwayat"
                            gradientFrom="#3b82f6" // blue-500
                            gradientTo="#1d4ed8"   // blue-700
                        />
                    </div>
                </motion.div>


            </div>
        </div>
    );
}
