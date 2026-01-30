"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    ArrowRight,
    Sparkles,
    Send,
    RefreshCw,
    Heart,
    Briefcase,
    Zap,
    History,
    Search,
    Trash2,
    Eye,
    Copy,
    MoreHorizontal,
    Loader2
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { EmailType } from "./types";
import { listEmailDrafts } from "@/actions/email/list";
import { deleteEmailDraft } from "@/actions/email/delete";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// UI Data Configuration
const EMAIL_TYPES: {
    id: EmailType;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
}[] = [
        {
            id: 'application',
            title: 'Job Application',
            description: 'Buat Body Email & Cover Letter lengkap untuk melamar kerja.',
            icon: Briefcase,
            color: 'text-red-500',
        },
        {
            id: 'follow_up',
            title: 'Follow Up',
            description: 'Tanya status lamaran dengan sopan & profesional.',
            icon: RefreshCw,
            color: 'text-blue-500',
        },
        {
            id: 'thank_you',
            title: 'Thank You',
            description: 'Ucapkan terima kasih setelah interview.',
            icon: Heart,
            color: 'text-emerald-500',
        },
        {
            id: 'inquiry',
            title: 'Cold Inquiry',
            description: 'Tanya lowongan ke perusahaan incaranmu.',
            icon: Search,
            color: 'text-purple-500',
        },
    ];

interface EmailGeneratorHomeProps {
    onSelectType: (type: EmailType) => void;
    totalEmails?: number;
}

export function EmailGeneratorHome({ onSelectType, totalEmails = 0 }: EmailGeneratorHomeProps) {
    const [drafts, setDrafts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = async () => {
        try {
            const result = await listEmailDrafts();
            if (result.data) {
                setDrafts(result.data);
            }
        } catch (error) {
            console.error("Error loading drafts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Hapus draft ini?")) return;

        try {
            const result = await deleteEmailDraft(id);
            if (result.success) {
                toast.success("Draft dihapus");
                loadDrafts();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Gagal menghapus draft");
        }
    };

    const handleCopy = (text: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        toast.success("Disalin ke clipboard");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const getEmailIcon = (type: string) => {
        const found = EMAIL_TYPES.find(t => t.id === type);
        const Icon = found?.icon || Mail;
        return <Icon className="h-4 w-4" />;
    };

    const getEmailColor = (type: string) => {
        switch (type) {
            case 'application': return "text-red-500 bg-red-500/10 border-red-200 dark:border-red-900";
            case 'follow_up': return "text-blue-500 bg-blue-500/10 border-blue-200 dark:border-blue-900";
            case 'thank_you': return "text-emerald-500 bg-emerald-500/10 border-emerald-200 dark:border-emerald-900";
            case 'inquiry': return "text-purple-500 bg-purple-500/10 border-purple-200 dark:border-purple-900";
            default: return "text-slate-500 bg-slate-500/10 border-slate-200 dark:border-slate-800";
        }
    };

    return (
        <div className="h-full w-full overflow-y-auto bg-slate-50/50 dark:bg-black/95 text-slate-900 dark:text-slate-100 font-sans selection:bg-red-500/30">
            <BackgroundPattern theme="red" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 relative"
                >


                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 leading-tight">
                        Write Like a <span className="text-red-600 dark:text-red-500 relative inline-block">
                            Pro
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-red-400 opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed px-4">
                        Buat Surat Lamaran & Email profesional dalam hitungan detik dengan bantuan AI.
                    </p>
                </motion.div>

                {/* Main Grid Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-20"
                >
                    {/* Featured Card (Application) */}
                    <div className="md:col-span-8 lg:col-span-8">
                        <MagicCard
                            className="h-full bg-gradient-to-br from-slate-900 to-slate-800 dark:from-zinc-900 dark:to-black text-white border-none overflow-hidden relative"
                            onClick={() => onSelectType('application')}
                            gradientFrom="red-600/20"
                            gradientTo="red-900/20"
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                            <div className="p-6 md:p-8 xl:p-10 flex flex-col xl:flex-row items-center h-full gap-6 xl:gap-8 relative z-10">
                                <div className="flex-1 space-y-6 w-full text-center xl:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-300 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-red-500/20 backdrop-blur-sm mx-auto xl:mx-0">
                                        <Sparkles className="h-3 w-3 animate-pulse" />
                                        Most Popular • Job Application
                                    </div>
                                    <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                                        Siap Lamar <br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-600">Kerja Impian?</span>
                                    </h2>
                                    <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto xl:mx-0 leading-relaxed">
                                        Buat <strong>Cover Letter</strong> & Body Email lengkap yang memikat HRD dalam 30 detik.
                                    </p>
                                    <Button className="w-full md:w-auto rounded-xl bg-white text-slate-900 dark:bg-red-600 dark:text-white hover:bg-slate-50 dark:hover:bg-red-700 border-none px-8 py-6 text-base md:text-lg font-bold shadow-xl shadow-red-900/10 dark:shadow-red-900/20 group hover:scale-[1.02] transition-all duration-300">
                                        Tulis Sekarang
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
                                        <div className="absolute inset-0 bg-red-500/20 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative z-10 p-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-xl mb-4 group-hover:scale-110 transition-transform">
                                            <Mail className="h-16 w-16 text-white" strokeWidth={1.5} />
                                        </div>
                                        <div className="text-center">
                                            <div className="w-32 h-2 bg-white/20 rounded-full mx-auto mb-2" />
                                            <div className="w-20 h-2 bg-white/10 rounded-full mx-auto" />
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
                            gradientFrom="red-500/5"
                            gradientTo="red-900/5"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800">
                                        <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Activity</span>
                                </div>

                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="relative inline-block"
                                    >
                                        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                            {totalEmails}
                                        </span>
                                        <span className="absolute -top-2 -right-6 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 backdrop-blur-sm">
                                            +NEW
                                        </span>
                                    </motion.div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Email Digenerate</p>
                                </div>
                            </div>

                            <div className="mt-auto">
                                <div className="w-full bg-slate-100 dark:bg-zinc-800/50 rounded-xl p-4 border border-slate-200 dark:border-zinc-700/50 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-medium text-slate-500">Drafts Saved</span>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{drafts.length}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500 w-[60%] rounded-full" />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-zinc-700 hover:border-red-500/30 dark:hover:border-red-500/30 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 transition-colors" disabled>
                                    View Analytics
                                </Button>
                            </div>
                        </MagicCard>
                    </div>

                    {/* Grid Items for other types */}
                    {EMAIL_TYPES.slice(1).map((type) => (
                        <div key={type.id} className="md:col-span-6 lg:col-span-4">
                            <MagicCard
                                onClick={() => onSelectType(type.id)}
                                className="h-full p-6"
                                gradientFrom="red-500/5"
                                gradientTo="red-900/5"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3.5 rounded-2xl border backdrop-blur-md bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 group-hover:text-red-500 group-hover:border-red-500/20 transition-colors`}>
                                            <type.icon className={`h-6 w-6 ${type.id === 'follow_up' ? 'text-blue-500' : type.id === 'thank_you' ? 'text-emerald-500' : 'text-purple-500'}`} />
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="p-1.5 rounded-full bg-slate-100 dark:bg-zinc-800">
                                                <ArrowRight className="h-4 w-4 text-slate-900 dark:text-white -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
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

                {/* History Section */}
                <div className="mb-20">
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 mb-8">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="p-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400">
                                    <History className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">My Email History</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                                        Draft dan email yang sudah Anda generate sebelumnya.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari surat..."
                                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm transition-all"
                                    />
                                </div>
                                <div className="relative w-full md:w-auto">
                                    <select className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all cursor-pointer">
                                        <option>Semua</option>
                                        <option>Job App</option>
                                        <option>Follow Up</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-zinc-900 animate-pulse" />
                            ))}
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="text-center py-16 rounded-3xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                            <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Belum ada riwayat email.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drafts.map((draft) => (
                                <MagicCard
                                    key={draft.id}
                                    className="group relative flex flex-col justify-between overflow-hidden bg-slate-900 dark:bg-black border-slate-800 dark:border-zinc-800 hover:border-red-500/50 transition-all duration-300 h-full p-6"
                                    gradientFrom="red-600/20"
                                    gradientTo="red-900/20"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-red-500/20 group-hover:border-red-500/30 transition-colors">
                                            {getEmailIcon(draft.type)}
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                            Final
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
                                            {draft.subject || "No Subject"}
                                        </h3>
                                        <p className="text-sm text-zinc-500 font-medium">
                                            {(draft.type || "").replace('_', ' ').toUpperCase()}
                                        </p>
                                        <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg w-fit">
                                            <History className="h-3 w-3" />
                                            {new Date(draft.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/50">
                                        <Button
                                            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl h-10 text-xs font-semibold"
                                            onClick={(e) => handleCopy(draft.content, e)}
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-2" />
                                            Lihat
                                        </Button>
                                        <button
                                            onClick={(e) => handleDelete(draft.id, e)}
                                            className="flex items-center gap-2 px-4 h-10 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors text-xs font-bold"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Hapus
                                        </button>
                                    </div>
                                </MagicCard>
                            ))}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}
