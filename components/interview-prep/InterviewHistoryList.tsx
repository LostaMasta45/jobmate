"use client";

import React from "react";
import Link from "next/link";
import {
    History,
    Search,
    ArrowLeft,
    Briefcase,
    Calendar,
    Target,
    ArrowRight,
    TrendingUp,
    PlayCircle,
    CheckCircle2,
    Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { InterviewPrepSession } from "@/types/interview-prep";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InterviewHistoryListProps {
    sessions: InterviewPrepSession[];
    onBack?: () => void;
}

export function InterviewHistoryList({ sessions, onBack }: InterviewHistoryListProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (sessions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                    <div className="relative bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-blue-100 dark:border-blue-900/50">
                        <Target className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Belum ada Sesi Interview</h3>
                <p className="text-muted-foreground text-center max-w-xs mb-8">
                    Mulai latihan interview pertamamu untuk meningkatkan peluang diterima kerja.
                </p>
                {onBack && (
                    <Button
                        size="lg"
                        onClick={onBack}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Mulai Interview Baru
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 p-6 md:p-8 mb-8">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        {onBack && (
                            <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-10 w-10 bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/20">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        )}
                        <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                            <History className="h-8 w-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">My Interview History</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                                Lihat progress dan latihan ulang pertanyaan interview Anda.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari Posisi / Perusahaan..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Add New Card */}
                {onBack && (
                    <div onClick={onBack} className="cursor-pointer group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all h-full min-h-[300px]">
                        <div className="rounded-full bg-white dark:bg-slate-800 p-4 shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md">
                            <Plus className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Buat Sesi Baru</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                            Simulasi Interview AI
                        </p>
                    </div>
                )}

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 dark:border-zinc-800 hover:border-blue-500/50 transition-all duration-300 p-6 min-h-[300px] shadow-lg"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="relative z-10 w-full mb-4">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                                    <Briefcase className="h-6 w-6 text-blue-500" />
                                </div>
                                <Badge variant={session.status === 'completed' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                                    {session.status}
                                </Badge>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors" title={session.position}>
                                    {session.position || "Unknown Position"}
                                </h3>
                                <div className="flex items-center gap-1 text-sm text-zinc-500 font-medium">
                                    <Briefcase className="h-3 w-3" />
                                    <span className="truncate max-w-[150px]" title={session.company_name}>{session.company_name || "Unknown Company"}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-medium bg-zinc-900/50 py-2 px-3 rounded-lg w-fit">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(session.created_at)}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="bg-zinc-800/30 p-2 rounded-lg text-center">
                                    <div className="text-xs text-zinc-500">Match</div>
                                    <div className="font-bold text-blue-400">{session.match_score}%</div>
                                </div>
                                <div className="bg-zinc-800/30 p-2 rounded-lg text-center">
                                    <div className="text-xs text-zinc-500">Questions</div>
                                    <div className="font-bold text-white">{session.questions?.length || 0}</div>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {session.preparation_progress > 0 && (
                            <div className="space-y-1 mb-4 relative z-10">
                                <div className="flex items-center justify-between text-xs text-zinc-500">
                                    <span>Progress</span>
                                    <span>{Math.round(session.preparation_progress)}%</span>
                                </div>
                                <Progress value={session.preparation_progress} className="h-1 bg-zinc-800 [&>div]:bg-blue-500" />
                            </div>
                        )}


                        <div className="pt-4 border-t border-zinc-800/50 relative z-10 mt-auto">
                            <Link href={`/tools/interview-prep/session/${session.id}`} className="w-full">
                                <Button
                                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 rounded-xl h-10 text-xs font-semibold"
                                >
                                    <PlayCircle className="h-3.5 w-3.5 mr-2" />
                                    Lanjut Latihan
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
