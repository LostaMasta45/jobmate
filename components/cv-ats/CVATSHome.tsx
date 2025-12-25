"use client";

import { motion } from "framer-motion";
import {
    History,
    ArrowRight,
    Sparkles,
    Users,
    Crown,
    Zap,
    FileText,
    CheckCircle2,
    LayoutTemplate
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BackgroundPattern } from "@/components/ui/background-pattern";

interface CVATSHomeProps {
    onSelectView: (view: 'wizard' | 'history') => void;
    totalResumes?: number;
}

export function CVATSHome({ onSelectView, totalResumes = 0 }: CVATSHomeProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="h-full w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 relative transition-colors duration-500 flex flex-col overflow-y-auto lg:overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <BackgroundPattern theme="blue" />

            <div className="flex-1 w-full px-4 md:px-8 lg:px-12 py-6 md:py-10 flex flex-col justify-start lg:justify-center relative z-10 min-h-full">

                {/* Main Grid Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-[1600px] mx-auto items-center">

                    {/* Left Side: Hero Section */}
                    <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left mb-8 lg:mb-0 pt-24 lg:pt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-xl mb-8 shadow-sm dark:shadow-2xl hover:bg-white/60 dark:hover:bg-zinc-800/50 transition-all cursor-default mx-auto lg:mx-0 group w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">CV Engine 3.0</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter mb-6 leading-[1.05] md:leading-[0.95] drop-shadow-sm dark:drop-shadow-2xl text-slate-900 dark:text-white">
                                Build Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-300 dark:via-white dark:to-indigo-300 relative">
                                    Future.
                                </span>
                            </h1>

                            <p className="text-sm md:text-lg text-slate-600 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mb-8">
                                Buat CV <span className="text-slate-900 dark:text-white font-medium">ATS-friendly</span> profesional dalam hitungan menit. Tanpa ribet formatting, fokus pada konten terbaikmu.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-zinc-600 cursor-default justify-center lg:justify-start mt-8 lg:mt-0">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Crown className="h-3 w-3 text-amber-500" />
                                    Premium Export
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Zap className="h-3 w-3 text-blue-500" />
                                    Instant Parsers
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <LayoutTemplate className="h-3 w-3 text-emerald-500" />
                                    ATS Clean Layout
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Bento Grid Tools */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full pb-20 lg:pb-0"
                    >
                        {/* CREATE TOOL - Primary - Spans 2 cols on Desktop */}
                        <div className="md:col-span-2 group min-h-[280px]">
                            <MagicCard
                                onClick={() => onSelectView('wizard')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-400/50 backdrop-blur-md transition-all duration-500 shadow-xl shadow-slate-200/40 dark:shadow-none dark:hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)]"
                                gradientFrom="purple-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex flex-col md:flex-row h-full p-6 md:p-10 relative z-10 items-center gap-8">
                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                                            <Sparkles className="h-3 w-3" />
                                            Most Popular
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors tracking-tight">
                                            Buat CV Baru
                                        </h3>
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
                                            Wizard 6 langkah pintar. Optimasi keyword otomatis. <span className="text-purple-600 dark:text-purple-400 font-semibold">10x lebih cepat</span> dari manual.
                                        </p>

                                        <div className="pt-4 flex justify-center md:justify-start">
                                            <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-purple-500/25">
                                                Mulai Sekarang <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Visual Decoration */}
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                        <div className="absolute inset-0 bg-purple-500/20 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2rem] flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-700 shadow-2xl border border-white/20">
                                            <FileText className="h-16 w-16 text-white/90" strokeWidth={1.5} />
                                        </div>
                                        {/* Floating Elements */}
                                        <div className="absolute -top-4 -right-4 bg-white dark:bg-zinc-800 p-2 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 animate-bounce delay-700">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* HISTORY TOOL */}
                        <div className="h-[260px] group">
                            <MagicCard
                                onClick={() => onSelectView('history')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 backdrop-blur-md transition-all duration-500 shadow-lg dark:hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
                                gradientFrom="blue-500/20"
                            >
                                <div className="flex flex-col h-full p-8 relative z-10">
                                    <div className="mb-auto">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                                            <History className="h-6 w-6" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            My History
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">
                                            Akses & edit CV yang sudah dibuat.
                                        </p>
                                    </div>

                                    <div className="flex items-center text-[10px] font-bold text-slate-400 dark:text-zinc-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-widest mt-6">
                                        Open Library <ArrowRight className="ml-auto h-3 w-3 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* STATS WIDGET */}
                        <div className="h-[260px] group col-span-1">
                            <MagicCard className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 backdrop-blur-md hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-500 shadow-lg dark:hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] group-hover:scale-[1.02]">
                                {/* Animated Grid Background */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors duration-500" />

                                <div className="flex flex-col h-full p-8 relative z-10 justify-between">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
                                                Live Impact
                                            </span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:rotate-12 group-hover:bg-emerald-500/20 transition-all duration-500">
                                            <Users className="h-5 w-5" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-end gap-2 mb-4">
                                            <motion.span
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none"
                                            >
                                                {totalResumes}
                                            </motion.span>
                                            <span className="text-sm font-bold text-slate-400 dark:text-zinc-500 mb-2 uppercase tracking-wider pb-1">
                                                Resumes
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "65%" }}
                                                    transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                                                </motion.div>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-medium">
                                                <span className="text-slate-500 dark:text-zinc-500">Generated & Downloaded</span>
                                                <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
