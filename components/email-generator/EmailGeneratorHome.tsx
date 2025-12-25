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
    MoreHorizontal
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
        switch (type) {
            case 'application': return <Briefcase className="h-4 w-4" />;
            case 'follow_up': return <RefreshCw className="h-4 w-4" />;
            case 'thank_you': return <Heart className="h-4 w-4" />;
            case 'inquiry': return <Search className="h-4 w-4" />;
            default: return <Mail className="h-4 w-4" />;
        }
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
        <div className="h-full w-full bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white font-sans selection:bg-red-500/30 relative transition-colors duration-500 flex flex-col overflow-y-auto lg:overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-600/10 dark:bg-red-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 dark:bg-orange-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-100 fixed" />
            <BackgroundPattern theme="red" />

            <div className="flex-1 w-full px-4 md:px-8 lg:px-12 py-6 md:py-10 flex flex-col justify-start relative z-10 min-h-full">

                {/* Main Grid Wrapper */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full max-w-[1600px] mx-auto items-start mb-20">

                    {/* Left Side: Hero Section */}
                    <div className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left mb-8 lg:mb-0 pt-12 lg:pt-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 backdrop-blur-xl mb-8 shadow-sm dark:shadow-2xl hover:bg-white/60 dark:hover:bg-zinc-800/50 transition-all cursor-default mx-auto lg:mx-0 group w-fit">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Smart Email AI</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter mb-6 leading-[1.05] md:leading-[0.95] drop-shadow-sm dark:drop-shadow-2xl text-slate-900 dark:text-white">
                                Write Like a <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:via-white dark:to-orange-400 relative">
                                    Pro.
                                </span>
                            </h1>

                            <p className="text-sm md:text-lg text-slate-600 dark:text-zinc-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light mb-8">
                                Buat <span className="text-slate-900 dark:text-white font-medium">Surat Lamaran & Email</span> profesional dalam hitungan detik. Pilih template di samping untuk memulai.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-zinc-600 cursor-default justify-center lg:justify-start mt-8 lg:mt-0">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Briefcase className="h-3 w-3 text-red-500" />
                                    Job Application
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Zap className="h-3 w-3 text-orange-500" />
                                    Instant Tone
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                                    <Send className="h-3 w-3 text-blue-500" />
                                    Ready to Send
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Bento Grid Tools */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full"
                    >
                        {/* 1. APPLICATION TOOL - Primary - Spans 2 cols */}
                        <div className="md:col-span-2 group min-h-[260px]">
                            <MagicCard
                                onClick={() => onSelectType('application')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-red-500/50 dark:hover:border-red-400/50 backdrop-blur-md transition-all duration-500 shadow-xl shadow-slate-200/40 dark:shadow-none dark:hover:shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]"
                                gradientFrom="red-500/20"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex flex-col md:flex-row h-full p-6 md:p-10 relative z-10 items-center gap-8">
                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                                            <Sparkles className="h-3 w-3" />
                                            Most Popular
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors tracking-tight">
                                            Job Application
                                        </h3>
                                        <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto md:mx-0">
                                            Buat Body Email & Cover Letter lengkap untuk melamar kerja.
                                        </p>

                                        <div className="pt-4 flex justify-center md:justify-start">
                                            <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-red-500/25">
                                                Tulis Sekarang <ArrowRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Visual Decoration */}
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                        <div className="absolute inset-0 bg-red-500/20 blur-[40px] rounded-full animate-pulse" />
                                        <div className="relative h-full w-full bg-gradient-to-br from-red-500 to-orange-600 rounded-[2rem] flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-700 shadow-2xl border border-white/20">
                                            <Mail className="h-16 w-16 text-white/90" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* 2. FOLLOW UP TOOL */}
                        <div className="h-[200px] group col-span-1">
                            <MagicCard
                                onClick={() => onSelectType('follow_up')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-400/50 backdrop-blur-md transition-all duration-500 shadow-lg"
                                gradientFrom="blue-500/20"
                            >
                                <div className="flex flex-col h-full p-6 relative z-10 justify-between">
                                    <div>
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                                            <RefreshCw className="h-5 w-5" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Follow Up
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                                            Tanya status lamaran dengan sopan & profesional.
                                        </p>
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase tracking-widest">
                                        Create <ArrowRight className="ml-auto h-3 w-3" />
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* 3. THANK YOU TOOL */}
                        <div className="h-[200px] group col-span-1">
                            <MagicCard
                                onClick={() => onSelectType('thank_you')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 backdrop-blur-md transition-all duration-500 shadow-lg"
                                gradientFrom="emerald-500/20"
                            >
                                <div className="flex flex-col h-full p-6 relative z-10 justify-between">
                                    <div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
                                            <Heart className="h-5 w-5" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Thank You
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                                            Ucapkan terima kasih setelah interview.
                                        </p>
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 uppercase tracking-widest">
                                        Create <ArrowRight className="ml-auto h-3 w-3" />
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* 4. COLD INQUIRY TOOL */}
                        <div className="h-[200px] group col-span-1">
                            <MagicCard
                                onClick={() => onSelectType('inquiry')}
                                className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-400/50 backdrop-blur-md transition-all duration-500 shadow-lg"
                                gradientFrom="purple-500/20"
                            >
                                <div className="flex flex-col h-full p-6 relative z-10 justify-between">
                                    <div>
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                                            <Search className="h-5 w-5" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Cold Inquiry
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
                                            Tanya lowongan ke perusahaan incaranmu.
                                        </p>
                                    </div>
                                    <div className="flex items-center text-[10px] font-bold text-slate-400 group-hover:text-purple-600 uppercase tracking-widest">
                                        Create <ArrowRight className="ml-auto h-3 w-3" />
                                    </div>
                                </div>
                            </MagicCard>
                        </div>

                        {/* 5. STATS WIDGET */}
                        <div className="h-[200px] group col-span-1">
                            <MagicCard className="h-full relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 backdrop-blur-md hover:border-red-500/50 dark:hover:border-red-500/50 transition-all duration-500 shadow-lg group-hover:scale-[1.02]">
                                {/* Animated Grid Background */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="flex flex-col h-full p-6 relative z-10 justify-between">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 tracking-widest">
                                                Stats
                                            </span>
                                        </div>
                                        <div className="text-red-500 opacity-50">
                                            <History className="h-4 w-4" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-end gap-2 mb-2">
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none"
                                            >
                                                {totalEmails}
                                            </motion.span>
                                            <span className="text-xs font-bold text-slate-400 mb-1 uppercase">
                                                Generated
                                            </span>
                                        </div>

                                        <div className="h-1 w-full bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "85%" }}
                                                transition={{ duration: 1.5, ease: "circOut", delay: 0.4 }}
                                                className="h-full bg-gradient-to-r from-red-500 to-orange-400 relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        </div>
                    </motion.div>
                </div>

                {/* History Section */}
                <div className="w-full max-w-[1600px] mx-auto pb-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                            <History className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Email Terakhir</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 rounded-2xl bg-slate-200 dark:bg-zinc-900 animate-pulse" />
                            ))}
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                            <Mail className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Belum ada riwayat email.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drafts.map((draft, idx) => (
                                <MagicCard
                                    key={draft.id}
                                    className="group relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all p-4"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getEmailColor(draft.type)}`}>
                                            <span className="flex items-center gap-1.5">
                                                {getEmailIcon(draft.type)}
                                                {draft.type.replace('_', ' ')}
                                            </span>
                                        </span>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => handleDelete(draft.id, e)} className="text-red-600 focus:text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                                        {draft.subject}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-zinc-500 line-clamp-2 mb-4 h-8">
                                        {draft.content.replace(/<[^>]*>?/gm, "")}
                                    </p>

                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-white/5">
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(draft.created_at).toLocaleDateString()}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 text-xs gap-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
                                            onClick={(e) => handleCopy(draft.content, e)}
                                        >
                                            <Copy className="h-3 w-3" />
                                            Salin
                                        </Button>
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
