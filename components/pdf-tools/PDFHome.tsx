"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    Minimize2,
    FileImage,
    History,
    ArrowRight,
    Zap,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/ui/magic-card";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { PDFStats, getPDFStats } from "@/actions/pdf/stats";

interface PDFHomeProps {
    onSelectTool: (tool: 'merge' | 'compress' | 'convert' | 'history') => void;
}

export function PDFHome({ onSelectTool }: PDFHomeProps) {
    const [stats, setStats] = useState<PDFStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getPDFStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch PDF stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-full w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-red-500/30 overflow-x-hidden relative transition-colors duration-500 flex flex-col">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 dark:bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <BackgroundPattern theme="red" />

            <div className="flex-1 w-full px-4 md:px-8 lg:px-12 py-8 md:py-12 flex flex-col justify-center relative z-10">

                {/* Header & Content Wrapper - Fluid Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full items-start">

                    {/* Left Side: Hero Section (Takes up 4 cols on large screens) */}
                    <div className="xl:col-span-4 xl:sticky xl:top-24 flex flex-col justify-center xl:min-h-[60vh] text-center xl:text-left mb-12 xl:mb-0">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl mb-8 shadow-sm dark:shadow-2xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors cursor-default mx-auto xl:mx-0">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400">PDF Tools Pro</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black tracking-tighter mb-6 leading-[0.9] drop-shadow-sm dark:drop-shadow-2xl text-slate-900 dark:text-white">
                                Dokumen <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-white dark:via-white dark:to-zinc-500 relative">
                                    Level Up.
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 dark:text-zinc-400 max-w-lg mx-auto xl:mx-0 leading-relaxed font-light mb-8">
                                Optimalkan proses lamaran kerjamu. Gabung, kompres, dan konversi dokumen dalam satu dashboard yang <span className="text-slate-900 dark:text-zinc-200 font-medium">cepat dan aman</span>.
                            </p>

                            <div className="hidden xl:flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-zinc-600 cursor-default">
                                <Zap className="h-3 w-3 fill-slate-300 dark:fill-white/10" />
                                JobMate PDF Engine v2.1
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Bento Grid Tools (Takes up 8 cols on large screens) */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"
                    >
                        {/* Merge Tool - Critical Priority - Spans 2 cols */}
                        <div className="md:col-span-2 lg:col-span-2 row-span-2 aspect-[4/3] md:aspect-auto">
                            <MagicCard
                                onClick={() => onSelectTool('merge')}
                                className="h-full group bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/5 hover:border-red-500/50 backdrop-blur-md transition-all duration-500 shadow-sm hover:shadow-xl dark:shadow-none hover:bg-white/80 dark:hover:bg-zinc-900/60"
                                gradientFrom="red-500/20"
                            >
                                <div className="flex flex-col h-full p-8 md:p-10 relative overflow-hidden">
                                    <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-500/10 dark:bg-red-500/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-red-500/20 dark:group-hover:bg-red-500/30 transition-all duration-500" />

                                    <div className="flex items-start justify-between mb-auto z-10">
                                        <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/20 group-hover:scale-110 transition-transform duration-500 text-red-600 dark:text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)] dark:shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                            <FileText className="h-10 w-10" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-red-500 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-red-500/20 border border-red-400">
                                            Popular
                                        </div>
                                    </div>

                                    <div className="z-10 mt-12 md:mt-auto">
                                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">Gabung PDF</h3>
                                        <p className="text-slate-500 dark:text-zinc-400 text-base md:text-lg mb-8 max-w-sm font-normal dark:font-light">Gabungkan banyak file lamaran menjadi satu dokumen yang rapi.</p>

                                        <div className="flex items-center text-sm font-bold text-slate-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-white transition-colors">
                                            Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* Stats Widget - Vertical */}
                        <div className="md:col-span-1 lg:col-span-1 row-span-1 md:row-span-2 min-h-[300px]">
                            <MagicCard className="h-full bg-white/60 dark:bg-zinc-900/30 border-slate-200/60 dark:border-white/5 backdrop-blur-xl p-0 overflow-hidden hover:border-slate-300 dark:hover:border-white/10 transition-colors shadow-sm hover:shadow-lg dark:shadow-none">
                                <div className="h-full flex flex-col p-6 relative">
                                    <div className="relative z-10 flex items-center justify-between mb-8">
                                        <span className="text-xs font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-wider flex items-center gap-2">
                                            <History className="w-3 h-3" />
                                            Stats
                                        </span>
                                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    </div>

                                    <div className="relative z-10 my-auto">
                                        <div className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 break-all">
                                            {isLoadingStats ? (
                                                <Loader2 className="h-10 w-10 animate-spin text-slate-300 dark:text-zinc-800" />
                                            ) : (
                                                stats?.total || 0
                                            )}
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-[0.2em]">Processed</p>
                                    </div>

                                    <div className="relative z-10 mt-auto pt-8 space-y-3">
                                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-white/5 pb-2">
                                            <span>Merge</span>
                                            <span className="font-mono">{stats?.merge || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-white/5 pb-2">
                                            <span>Size</span>
                                            <span className="font-mono">{stats?.compress || 0}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onSelectTool('history'); }}
                                            className="w-full mt-2 text-xs h-8 px-0 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                        >
                                            View History <ArrowRight className="ml-2 h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* Compress Tool */}
                        <div className="md:col-span-1 lg:col-span-1 min-h-[200px]">
                            <MagicCard
                                onClick={() => onSelectTool('compress')}
                                className="h-full group bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/5 hover:border-orange-500/50 backdrop-blur-md transition-all duration-500 shadow-sm hover:shadow-lg dark:shadow-none"
                                gradientFrom="orange-500/20"
                            >
                                <div className="flex flex-col h-full p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-16 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-orange-500/20 transition-all" />
                                    <div className="mb-4 relative z-10">
                                        <div className="p-3 w-fit rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                                            <Minimize2 className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors relative z-10">Kompres</h3>
                                    <p className="text-xs text-slate-500 dark:text-zinc-500 relative z-10">Kecilkan size file.</p>
                                </div>
                            </MagicCard>
                        </div>

                        {/* Convert Tool */}
                        <div className="md:col-span-1 lg:col-span-1 min-h-[200px] lg:col-span-2 xl:col-span-2">
                            <MagicCard
                                onClick={() => onSelectTool('convert')}
                                className="h-full group bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/5 hover:border-blue-500/50 backdrop-blur-md transition-all duration-500 shadow-sm hover:shadow-lg dark:shadow-none"
                                gradientFrom="blue-500/20"
                            >
                                <div className="flex flex-col h-full p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-16 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />
                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        <div className="p-3 w-fit rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                                            <FileImage className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">Convert</h3>
                                            <p className="text-xs text-slate-500 dark:text-zinc-500">Word / JPG to PDF</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex items-center text-xs font-bold text-slate-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                                        Mulai <ArrowRight className="ml-2 h-4 w-4" />
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
