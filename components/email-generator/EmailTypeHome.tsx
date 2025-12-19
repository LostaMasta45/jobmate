"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    RefreshCw,
    Heart,
    HelpCircle,
    History,
    ArrowRight,
    Sparkles,
    Loader2,
    Zap,
    Mail,
    Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { EmailType } from "./types";
import { getEmailStats } from "@/actions/email/stats";

// UI Data Configuration theme: Gmail Colors
const EMAIL_TYPES: {
    id: EmailType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    gradient: string;
    popular?: boolean;
    theme: 'red' | 'blue' | 'green' | 'yellow';
}[] = [
        {
            id: 'application',
            title: 'Lamaran Kerja',
            description: 'Buat email lamaran formal yang memikat hati HRD secara instan.',
            icon: Briefcase,
            color: 'text-red-500',
            gradient: 'from-red-400 to-rose-600',
            popular: true,
            theme: 'red',
        },
        {
            id: 'follow_up',
            title: 'Follow Up',
            description: 'Tanyakan status lamaran tanpa terlihat putus asa.',
            icon: RefreshCw,
            color: 'text-blue-500',
            gradient: 'from-blue-400 to-indigo-600',
            theme: 'blue',
        },
        {
            id: 'thank_you',
            title: 'Terima Kasih',
            description: 'Tinggalkan kesan positif setelah sesi wawancara.',
            icon: Heart,
            color: 'text-green-500',
            gradient: 'from-green-400 to-emerald-600',
            theme: 'green',
        },
        {
            id: 'inquiry',
            title: 'Inquiry',
            description: 'Tanyakan peluang kerja dengan sopan dan profesional.',
            icon: HelpCircle,
            color: 'text-yellow-500',
            gradient: 'from-yellow-400 to-amber-600',
            theme: 'yellow',
        },
    ];

// Custom 3D Card Component
const MagicCard = ({ children, className, onClick }: { children: React.ReactNode; className?: string, onClick?: () => void }) => {
    return (
        <motion.div
            className={`cursor-pointer relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out group ${className}`}
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-zinc-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

// Background Pattern with Gmail Colors
const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/40 via-transparent to-transparent dark:from-zinc-900/20" />
        {/* Red/Blue Glows for Gmail Feel */}
        <div className="absolute right-0 top-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal" />
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-normal" />

        {/* Floating Icons Decoration */}
        <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[10%] w-16 h-16 rounded-2xl rounded-tr-none bg-red-500/10 border border-red-500/20 backdrop-blur-sm rotate-12 flex items-center justify-center"
        >
            <Mail className="h-6 w-6 text-red-500/40" />
        </motion.div>

        <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 left-[10%] w-12 h-12 rounded-2xl rounded-tl-none bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm -rotate-12 flex items-center justify-center"
        >
            <Send className="h-5 w-5 text-blue-500/40" />
        </motion.div>
    </div>
);

interface EmailTypeHomeProps {
    userName: string;
    onSelectType: (type: EmailType) => void;
}

interface EmailStats {
    application: number;
    follow_up: number;
    thank_you: number;
    inquiry: number;
    total: number;
}

export function EmailTypeHome({ userName, onSelectType }: EmailTypeHomeProps) {
    const [stats, setStats] = useState<EmailStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getEmailStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch Email stats:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/50 dark:bg-black/95 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-500/30">
            <BackgroundPattern />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 relative"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700 backdrop-blur-md mb-6 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Email Generator V2.0</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 leading-tight">
                        Kirim Email <span className="text-red-600 dark:text-red-500 relative inline-block">
                            Profesional
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Asisten AI pribadi yang membantu Anda menyusun email lamaran kerja, follow-up, dan networking dengan tone yang tepat.
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20"
                >
                    {/* Featured Card (Application) - Using XL breakpoint for side-by-side like WA Generator */}
                    <div className="md:col-span-12 lg:col-span-8">
                        <MagicCard
                            className="h-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-900 dark:to-black text-white border-none overflow-hidden relative"
                            onClick={() => onSelectType('application')}
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="p-6 md:p-8 xl:p-10 flex flex-col xl:flex-row items-center h-full gap-6 xl:gap-8 relative z-10">
                                <div className="flex-1 space-y-6 w-full text-center xl:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-red-500/20 backdrop-blur-sm mx-auto xl:mx-0">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Recommended • Email Lamaran
                                    </div>
                                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                                        Siap Lamar <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-600">Kerja Impian?</span>
                                    </h2>
                                    <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto xl:mx-0 leading-relaxed">
                                        Buat <strong>Cover Letter</strong> & email lamaran yang standout di inbox HRD. 30 detik untuk mengubah karir Anda.
                                    </p>
                                    <Button className="w-full md:w-auto rounded-xl bg-white text-slate-900 dark:bg-red-600 dark:text-white hover:bg-slate-50 dark:hover:bg-red-700 border-none px-8 py-6 text-base md:text-lg font-bold shadow-xl shadow-red-900/10 dark:shadow-red-900/20 group hover:scale-[1.02] transition-all duration-300">
                                        Buat Email Lamaran
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                {/* Featured Visual - Email Theme */}
                                <div className="relative w-full max-w-[280px] md:max-w-[320px] xl:max-w-none xl:w-64 h-64 md:h-72 xl:h-64 flex-shrink-0 perspective-1000 block mt-4 xl:mt-0">
                                    <motion.div
                                        animate={{ rotateY: [-10, 10, -10], rotateX: [5, -5, 5] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl flex flex-col gap-3 transform-style-3d"
                                    >
                                        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                                                <Mail className="h-4 w-4 text-white" />
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="w-24 h-2 bg-white/20 rounded-full" />
                                                <div className="w-12 h-1.5 bg-white/10 rounded-full mt-1.5" />
                                            </div>
                                        </div>
                                        <div className="space-y-3 mt-2 flex-1 relative">
                                            {/* Dummy Lines */}
                                            <div className="w-full h-2 bg-white/10 rounded-full" />
                                            <div className="w-3/4 h-2 bg-white/10 rounded-full" />
                                            <div className="w-5/6 h-2 bg-white/10 rounded-full" />

                                            {/* Accent Card */}
                                            <div className="absolute bottom-0 left-0 right-0 h-20 rounded-xl bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-white/5 flex items-center justify-center">
                                                <Sparkles className="h-6 w-6 text-red-200 animate-pulse" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </MagicCard>
                    </div>

                    {/* Stats Widget */}
                    <div className="md:col-span-12 lg:col-span-4">
                        <MagicCard className="h-full bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between group">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800">
                                        <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Activity</span>
                                </div>

                                <div className="text-center py-8">
                                    {isLoadingStats ? (
                                        <Loader2 className="h-10 w-10 animate-spin text-red-500 mx-auto" />
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative inline-block"
                                        >
                                            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                {stats?.total || 0}
                                            </span>
                                            <span className="absolute -top-2 -right-6 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 backdrop-blur-sm">
                                                +NEW
                                            </span>
                                        </motion.div>
                                    )}
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Email Digenerate</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{stats?.application || 0}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Job</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/30 border border-slate-100 dark:border-zinc-700/50 text-center">
                                        <div className="text-lg font-bold text-slate-900 dark:text-white">{stats?.follow_up || 0}</div>
                                        <div className="text-[10px] text-slate-400 uppercase font-semibold tracking-wide">Follow</div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-zinc-700 hover:border-red-500/30 dark:hover:border-red-500/30 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors" onClick={(e) => { e.stopPropagation(); window.location.href = '/tools/email-generator2/history'; }}>
                                    View History
                                </Button>
                            </div>
                        </MagicCard>
                    </div>

                    {/* Grid Items for other types */}
                    {EMAIL_TYPES.slice(1).map((type) => (
                        <div key={type.id} className="md:col-span-4 lg:col-span-4">
                            <MagicCard onClick={() => onSelectType(type.id)} className="h-full p-6">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3.5 rounded-2xl border backdrop-blur-md ${type.theme === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400' :
                                            type.theme === 'green' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' :
                                                type.theme === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                                    'bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400'
                                            }`}>
                                            <type.icon className={`h-6 w-6`} />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800">
                                                <ArrowRight className="h-4 w-4 text-slate-900 dark:text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-2">
                                        <h3 className={`text-xl font-bold text-slate-900 dark:text-white transition-colors ${type.theme === 'blue' ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' :
                                            type.theme === 'green' ? 'group-hover:text-green-600 dark:group-hover:text-green-400' :
                                                type.theme === 'yellow' ? 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400' : ''
                                            }`}>
                                            {type.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {type.description}
                                        </p>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>
                    ))}
                </motion.div>

                <div className="flex justify-center pb-8">
                    <p className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/50 dark:bg-zinc-900/50 px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 backdrop-blur-sm">
                        <Zap className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>Powered by JobMate AI Engine</span>
                    </p>
                </div>

            </div>
        </div>
    );
}

