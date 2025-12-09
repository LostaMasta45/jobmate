"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    FileText,
    RefreshCw,
    Heart,
    HelpCircle,
    History,
    Sparkles,
    Loader2,
    ArrowRight,
    Mail
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { EmailType } from "./types";

// Re-export for backward compatibility
export type { EmailType } from "./types";

interface EmailTypeOption {
    id: EmailType;
    title: string;
    description: string;
    icon: React.ReactNode;
    // Styling classes
    bgLight: string;
    bgDark: string;
    textLight: string;
    textDark: string;
    borderLight: string;
    iconBgLight: string;
    iconBgDark: string;
    popular?: boolean;
}

interface EmailStats {
    application: number;
    follow_up: number;
    thank_you: number;
    inquiry: number;
    total: number;
}

const EMAIL_TYPES: EmailTypeOption[] = [
    {
        id: 'application',
        title: 'Lamaran Kerja',
        description: 'Buat email lamaran profesional yang memikat HRD.',
        icon: <FileText className="h-7 w-7" />,
        // Violet Theme
        bgLight: 'bg-white',
        bgDark: 'dark:bg-zinc-900',
        textLight: 'text-violet-600',
        textDark: 'dark:text-violet-400',
        borderLight: 'hover:border-violet-500',
        iconBgLight: 'bg-violet-50 text-violet-600',
        iconBgDark: 'dark:bg-violet-900/30 dark:text-violet-400',
        popular: true,
    },
    {
        id: 'follow_up',
        title: 'Follow Up',
        description: 'Ingatkan rekruter tentang lamaranmu dengan sopan.',
        icon: <RefreshCw className="h-7 w-7" />,
        // Sky Blue Theme
        bgLight: 'bg-white',
        bgDark: 'dark:bg-zinc-900',
        textLight: 'text-sky-600',
        textDark: 'dark:text-sky-400',
        borderLight: 'hover:border-sky-500',
        iconBgLight: 'bg-sky-50 text-sky-600',
        iconBgDark: 'dark:bg-sky-900/30 dark:text-sky-400',
    },
    {
        id: 'thank_you',
        title: 'Terima Kasih',
        description: 'Berikan kesan positif setelah interview selesai.',
        icon: <Heart className="h-7 w-7" />,
        // Rose/Pink Theme
        bgLight: 'bg-white',
        bgDark: 'dark:bg-zinc-900',
        textLight: 'text-rose-600',
        textDark: 'dark:text-rose-400',
        borderLight: 'hover:border-rose-500',
        iconBgLight: 'bg-rose-50 text-rose-600',
        iconBgDark: 'dark:bg-rose-900/30 dark:text-rose-400',
    },
    {
        id: 'inquiry',
        title: 'Inquiry',
        description: 'Tanyakan peluang kerja atau informasi lowongan.',
        icon: <HelpCircle className="h-7 w-7" />,
        // Emerald/Teal Theme
        bgLight: 'bg-white',
        bgDark: 'dark:bg-zinc-900',
        textLight: 'text-emerald-600',
        textDark: 'dark:text-emerald-400',
        borderLight: 'hover:border-emerald-500',
        iconBgLight: 'bg-emerald-50 text-emerald-600',
        iconBgDark: 'dark:bg-emerald-900/30 dark:text-emerald-400',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

interface EmailTypeHomeProps {
    userName: string;
    onSelectType: (type: EmailType) => void;
}

import { getEmailStats } from "@/actions/email/stats";

// ... existing imports ...

export function EmailTypeHome({ userName, onSelectType }: EmailTypeHomeProps) {
    const [stats, setStats] = useState<EmailStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getEmailStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center py-8">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10"
            >
                {/* FRESH HERO CARD (High Contrast Gradient) */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 sm:p-12 mb-12 shadow-2xl shadow-indigo-500/20 text-white group"
                >
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold shadow-lg">
                            <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                            <span>AI POWERED V2</span>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-inner relative">
                            <Mail className="h-12 w-12 text-white" />
                            <div className="absolute -top-1 -right-1">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                            </div>
                        </div>

                        <div className="max-w-2xl space-y-3">
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
                                Buat Email Profesional
                            </h1>
                            <p className="text-purple-100 text-base sm:text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
                                Pilih jenis email, isi detailnya, dan biarkan AI menuliskan kata-kata terbaik untuk karirmu.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* FRESH CARDS (Clean White Surface for Light Mode) */}
                <div className="
                    flex overflow-x-auto snap-x snap-mandatory gap-5 pb-10 -mx-6 px-6 
                    md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:pb-16 md:mx-0 md:px-0 md:overflow-visible
                    [&::-webkit-scrollbar]:hidden
                ">
                    {EMAIL_TYPES.map((type) => (
                        <motion.div
                            key={type.id}
                            variants={itemVariants}
                            className="group h-full min-w-[85vw] md:min-w-0 snap-center"
                        >
                            <div
                                onClick={() => onSelectType(type.id)}
                                className={`
                                    relative h-full flex flex-col p-6 cursor-pointer
                                    bg-white dark:bg-zinc-900 
                                    border-2 border-transparent ${type.borderLight} dark:border-zinc-800
                                    rounded-[2rem] transition-all duration-300
                                    shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1
                                    active:scale-[0.98]
                                `}
                            >
                                {type.popular && (
                                    <div className="absolute top-5 right-5 z-10">
                                        <span className="bg-yellow-400 text-yellow-950 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                            POPULAR
                                        </span>
                                    </div>
                                )}

                                <div className={`
                                    w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                                    ${type.iconBgLight} ${type.iconBgDark}
                                    group-hover:scale-110 transition-transform duration-300
                                `}>
                                    {type.icon}
                                </div>

                                <div className="flex-1 space-y-2 mb-6">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                        {type.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                                        {type.description}
                                    </p>
                                </div>

                                <div className={`
                                    w-full py-3 px-4 rounded-xl flex items-center justify-between
                                    bg-slate-50 dark:bg-zinc-800/50 
                                    group-hover:bg-slate-900 group-hover:text-white
                                    dark:group-hover:bg-white dark:group-hover:text-black
                                    transition-all duration-300
                                `}>
                                    <span className="text-sm font-bold">Buat Sekarang</span>
                                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CLEAN STATS SECTION */}
                <motion.div className="max-w-4xl mx-auto mt-2 space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-4 px-4 sm:px-0">
                        <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <History className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">Statistik Emailmu</h3>
                    </div>

                    <div className="rounded-[2.5rem] bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 sm:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">

                            {/* Total - Highlighted */}
                            <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-zinc-700 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-zinc-800 dark:to-zinc-900" />
                                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 dark:bg-zinc-700 rounded-full blur-2xl -mr-8 -mt-8" />

                                <div className="relative z-10 text-center">
                                    {isLoadingStats ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto" />
                                    ) : (
                                        <div className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tighter group-hover:scale-110 transition-transform duration-300">
                                            {stats?.total || 0}
                                        </div>
                                    )}
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Total</div>
                                </div>
                            </div>

                            {/* Detailed Stats Grid - Colored */}
                            <div className="col-span-2 md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div className="flex flex-col items-center p-4 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30 transition-transform hover:-translate-y-1">
                                    <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">{stats?.application || 0}</span>
                                    <span className="text-[10px] text-violet-600/70 dark:text-violet-300 font-bold uppercase tracking-wide mt-1">Lamaran</span>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900/30 transition-transform hover:-translate-y-1">
                                    <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats?.follow_up || 0}</span>
                                    <span className="text-[10px] text-sky-600/70 dark:text-sky-300 font-bold uppercase tracking-wide mt-1">Follow Up</span>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 transition-transform hover:-translate-y-1">
                                    <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats?.thank_you || 0}</span>
                                    <span className="text-[10px] text-rose-600/70 dark:text-rose-300 font-bold uppercase tracking-wide mt-1">Thank You</span>
                                </div>
                                <div className="flex flex-col items-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 transition-transform hover:-translate-y-1">
                                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats?.inquiry || 0}</span>
                                    <span className="text-[10px] text-emerald-600/70 dark:text-emerald-300 font-bold uppercase tracking-wide mt-1">Inquiry</span>
                                </div>
                            </div>
                        </div>

                        {/* Link Button */}
                        <div className="mt-8 flex justify-center">
                            <Link href="/tools/email-generator2/history" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto rounded-full h-12 px-10 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 shadow-lg hover:shadow-xl transition-all">
                                    Lihat Riwayat Lengkap <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <motion.p variants={itemVariants} className="text-center text-xs font-medium text-slate-400 mt-12">
                    Powered by OpenAI GPT-4o & JobMate AI Engine
                </motion.p>
            </motion.div>
        </div>
    );
}
