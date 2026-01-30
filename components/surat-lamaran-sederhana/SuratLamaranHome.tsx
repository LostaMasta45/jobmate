"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FileText,
    History,
    Sparkles,
    Plus,
    ArrowRight,
    Loader2,
    CheckCircle2,
    FileEdit,
    PenTool
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { Button } from "@/components/ui/button";
import { getSuratLamaranStats } from "@/actions/surat-lamaran-sederhana/list";

interface SuratLamaranHomeProps {
    onSelectView: (view: 'home' | 'create' | 'history') => void;
}

interface Stats {
    total: number;
    draft: number;
    final: number;
}

export function SuratLamaranHome({ onSelectView }: SuratLamaranHomeProps) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const result = await getSuratLamaranStats();
                if (!result.error) {
                    setStats(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
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
        <div className="h-full w-full overflow-y-auto bg-slate-50/50 dark:bg-black/95 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/30">
            <BackgroundPattern theme="green" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 relative"
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 leading-tight">
                        Surat Lamaran <span className="text-emerald-600 dark:text-emerald-500 relative inline-block">
                            Profesional
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Buat surat lamaran kerja yang memikat HRD dalam hitungan menit. Pilih template, isi data, dan download.
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20"
                >
                    {/* Featured Card (Create New) */}
                    <div className="md:col-span-8 lg:col-span-8">
                        <MagicCard
                            className="h-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-900 dark:to-black text-white border-none overflow-hidden relative"
                            onClick={() => onSelectView('create')}
                            gradientFrom="emerald-600/20"
                            gradientTo="emerald-900/20"
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="p-6 md:p-8 xl:p-10 flex flex-col xl:flex-row items-center h-full gap-6 xl:gap-8 relative z-10">
                                <div className="flex-1 space-y-6 w-full text-center xl:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-emerald-500/20 backdrop-blur-sm mx-auto xl:mx-0">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Recommended • 20+ Template
                                    </div>
                                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                                        Buat Surat <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Lamaran Baru</span>
                                    </h2>
                                    <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto xl:mx-0 leading-relaxed">
                                        Gunakan <strong>AI Generator</strong> atau tulis manual dengan panduan template profesional kami.
                                    </p>
                                    <Button className="w-full md:w-auto rounded-xl bg-white text-slate-900 dark:bg-emerald-600 dark:text-white hover:bg-slate-50 dark:hover:bg-emerald-700 border-none px-8 py-6 text-base md:text-lg font-bold shadow-xl shadow-emerald-900/10 dark:shadow-emerald-900/20 group hover:scale-[1.02] transition-all duration-300">
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
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative z-10 p-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                                            <PenTool className="h-16 w-16 text-white" strokeWidth={1.5} />
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
                            gradientFrom="emerald-500/5"
                            gradientTo="emerald-900/5"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800">
                                        <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Activity</span>
                                </div>

                                <div className="text-center py-8">
                                    {isLoadingStats ? (
                                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative inline-block"
                                        >
                                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                {stats?.total || 0}
                                            </span>
                                            <span className="absolute -top-2 -right-6 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-sm">
                                                TOTAL
                                            </span>
                                        </motion.div>
                                    )}
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Surat Dibuat</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{stats?.final || 0}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide flex items-center justify-center gap-1">
                                            <CheckCircle2 className="h-3 w-3" /> Final
                                        </div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{stats?.draft || 0}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide flex items-center justify-center gap-1">
                                            <FileEdit className="h-3 w-3" /> Draft
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-zinc-700 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors" onClick={() => onSelectView('history')}>
                                    Lihat History
                                </Button>
                            </div>
                        </MagicCard>
                    </div>

                </motion.div>

                {/* History Section */}
                <div className="mb-20">
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 mb-8">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                    <History className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">Riwayat Surat</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                                        Kelola semua surat lamaran yang pernah Anda buat.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <SuratLamaranHistoryList />
                </div>

            </div>
        </div>
    );
}

// Internal History List Component for Home Page
function SuratLamaranHistoryList() {
    const [suratList, setSuratList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSuratList();
    }, []);

    const loadSuratList = async () => {
        try {
            const { getSuratLamaranList } = await import("@/actions/surat-lamaran-sederhana/list");
            const result = await getSuratLamaranList({ limit: 6 });
            if (result.data) {
                setSuratList(result.data);
            }
        } catch (error) {
            console.error("Error loading history:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-zinc-900 animate-pulse" />
                ))}
            </div>
        );
    }

    if (suratList.length === 0) {
        return (
            <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Belum ada riwayat surat lamaran.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suratList.map((surat) => (
                <MagicCard
                    key={surat.id}
                    className="group relative flex flex-col justify-between overflow-hidden bg-slate-900 dark:bg-black border-slate-800 dark:border-zinc-800 hover:border-emerald-500/50 transition-all duration-300 h-full p-6"
                    gradientFrom="emerald-600/20"
                    gradientTo="emerald-900/20"
                    onClick={() => window.location.href = `/surat-lamaran-sederhana/view?id=${surat.id}`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 transition-colors">
                            <FileText className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${surat.status === 'final'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            }`}>
                            {surat.status}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                            {surat.nama_perusahaan || "Tanpa Nama Perusahaan"}
                        </h3>
                        <p className="text-sm text-zinc-500 font-medium">
                            {surat.posisi_lowongan || "Posisi tidak ditentukan"}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg w-fit">
                            <History className="h-3 w-3" />
                            {new Date(surat.created_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
                        <Button
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl h-10 text-xs font-semibold"
                        >
                            <ArrowRight className="h-3.5 w-3.5 mr-2" />
                            Lihat Detail
                        </Button>
                    </div>
                </MagicCard>
            ))}
        </div>
    );
}
