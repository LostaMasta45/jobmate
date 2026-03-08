"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WizardProgress, WizardDay, ChecklistKey, CHECKLIST_STEPS, DEFAULT_CHECKLIST } from "@/actions/job-wizard/types";
import { getWizardProgress, startWizard, completeDayZero, saveDayTarget, markStepDone, markDayComplete, markFollowUpDone } from "@/actions/job-wizard";
import { askAICoach, runSelfAssessment, getTargetAdvice } from "@/actions/job-wizard/ai";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Rocket, ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Lock,
    Calendar, Flame, Trophy, Sparkles, MessageCircle, Send, Loader2,
    Target, FileText, Mail, FileStack, ClipboardList, X, Bot, ChevronDown, ChevronUp, ExternalLink, RotateCcw,
    Zap, AlertCircle, Briefcase, Building2
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

// ════════════════════════════════════════════════════════════════════
// MAIN WIZARD COMPONENT
// ════════════════════════════════════════════════════════════════════
export default function JobWizardClient() {
    const [progress, setProgress] = React.useState<WizardProgress | null>(null);
    const [days, setDays] = React.useState<WizardDay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [viewDay, setViewDay] = React.useState<number | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const loadData = React.useCallback(async () => {
        const result = await getWizardProgress();
        if (result.data) {
            setProgress(result.data);
            setDays(result.days);
            // Default view to current active day
            setViewDay(prev => prev ?? result.data?.current_day ?? 0);
        } else if (result.error) {
            setError(result.error);
        }
        setLoading(false);
    }, []);

    React.useEffect(() => { loadData(); }, [loadData]);

    const handleStart = async () => {
        setLoading(true);
        setError(null);
        const result = await startWizard();
        if (result.data) {
            setProgress(result.data);
            setViewDay(0);
        } else if (result.error) {
            setError(result.error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-xl bg-brand/30 animate-pulse" />
                    <Loader2 className="relative h-12 w-12 animate-spin text-brand" />
                </div>
                <p className="text-muted-foreground animate-pulse font-medium">Memuat ruang kerjamu...</p>
            </div>
        );
    }

    // Not started yet
    if (!progress) {
        return <WizardLanding onStart={handleStart} error={error} />;
    }

    // Wizard active
    return (
        <div className="relative min-h-screen pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-brand/5 via-brand/5 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-[1400px] mx-auto w-full px-4 xl:px-8 pt-4">
                {/* Sidebar */}
                <div className="w-full xl:w-[350px] shrink-0">
                    <WizardSidebar
                        progress={progress}
                        days={days}
                        viewDay={viewDay ?? progress.current_day}
                        onSelectDay={(d) => setViewDay(d)}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={viewDay}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-background/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden"
                        >
                            {/* Inner ambient glow */}
                            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-brand/5 to-transparent rounded-tr-3xl pointer-events-none" />

                            {viewDay === 0 ? (
                                <DayZeroContent
                                    progress={progress}
                                    onComplete={async (profileData, assessment) => {
                                        await completeDayZero(profileData, assessment);
                                        await loadData();
                                        setViewDay(1);
                                    }}
                                />
                            ) : (
                                <DayContent
                                    dayNumber={viewDay ?? 1}
                                    progress={progress}
                                    day={days.find(d => d.day_number === viewDay)}
                                    allDays={days}
                                    isActive={viewDay === progress.current_day}
                                    onUpdate={loadData}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// LANDING PAGE (Not Started)
// ════════════════════════════════════════════════════════════════════
function WizardLanding({ onStart, error }: { onStart: () => void; error?: string | null }) {
    return (
        <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden py-12 px-4">
            {/* Ambient Backgrounds */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 max-w-4xl mx-auto text-center"
            >
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-brand/20 to-emerald-500/20 backdrop-blur-xl border border-white/10 mb-8 shadow-2xl">
                    <Rocket className="h-12 w-12 text-brand drop-shadow-[0_0_15px_rgba(var(--brand),0.5)]" />
                </div>

                <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tight">
                    <span className="bg-gradient-to-r from-brand via-emerald-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-sm">
                        10 Hari Dapat Kerjaan
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed balance-text">
                    Program intensif yang memandu kamu melamar ke <strong className="text-foreground">10 perusahaan top</strong> dalam 10 hari. Dilengkapi AI Coach, tracking otomatis, dan tools generasi pro.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 text-left">
                    {[
                        { icon: <FileText className="h-5 w-5 text-blue-500" />, title: "CV ATS & Lamaran", desc: "Otomatis sesuai target" },
                        { icon: <Mail className="h-5 w-5 text-purple-500" />, title: "Email & WA Pro", desc: "Generate sekali klik" },
                        { icon: <FileStack className="h-5 w-5 text-orange-500" />, title: "PDF Combiner", desc: "Satukan berkas cepat" },
                        { icon: <Target className="h-5 w-5 text-red-500" />, title: "App Tracker", desc: "Pantau status lamaran" },
                        { icon: <Bot className="h-5 w-5 text-brand" />, title: "AI Career Coach", desc: "Teman diskusi 24/7" },
                        { icon: <AlertCircle className="h-5 w-5 text-yellow-500" />, title: "Smart Follow-up", desc: "Pengingat otomatis" },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 + 0.3 }}
                            className="group flex gap-3 p-4 rounded-2xl bg-background/40 backdrop-blur-md border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all duration-300"
                        >
                            <div className="h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-500">
                        {error}
                    </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        size="lg"
                        onClick={onStart}
                        className="h-14 px-10 rounded-full text-lg font-bold bg-gradient-to-r from-brand to-emerald-500 text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] transition-shadow"
                    >
                        Mulai Perjalanan Sekarang
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// SIDEBAR
// ════════════════════════════════════════════════════════════════════
function WizardSidebar({ progress, days, viewDay, onSelectDay }: {
    progress: WizardProgress;
    days: WizardDay[];
    viewDay: number;
    onSelectDay: (day: number) => void;
}) {
    const completedCount = days.filter(d => d.completed).length;
    const progressPct = Math.round((completedCount / 10) * 100);

    return (
        <div className="space-y-6 xl:sticky xl:top-24">
            {/* Progress Card */}
            <div className="relative p-6 rounded-3xl bg-background/40 backdrop-blur-2xl border border-white/10 shadow-xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-[50px] rounded-full group-hover:bg-brand/30 transition-colors" />

                <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-bold tracking-tight">Progress Misi</span>
                        <Badge variant="outline" className="text-xs font-bold border-brand/30 text-brand bg-brand/5 backdrop-blur-md px-3 py-1">
                            {completedCount}/10
                        </Badge>
                    </div>

                    <div className="h-3 rounded-full bg-black/20 dark:bg-white/5 border border-white/5 overflow-hidden shadow-inner">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-brand via-emerald-400 to-emerald-500 relative"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPct}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">{progressPct}% Selesai</span>
                        {progress.streak > 0 && (
                            <motion.div
                                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                className="flex items-center gap-1.5 font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20"
                            >
                                <Flame className="h-4 w-4 fill-orange-500" />
                                {progress.streak} Hari Streak!
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Timeline Menu */}
            <div className="rounded-3xl bg-background/40 backdrop-blur-2xl border border-white/10 shadow-xl p-3">
                <div className="px-4 pt-3 pb-2 mb-2 flex items-center gap-2.5 text-sm font-bold tracking-wide text-muted-foreground uppercase border-b border-white/5">
                    <Calendar className="h-4 w-4" /> Timeline Plan
                </div>

                <div className="space-y-1.5">
                    {/* Day 0 */}
                    <button
                        onClick={() => onSelectDay(0)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all duration-300 relative overflow-hidden",
                            viewDay === 0
                                ? "bg-gradient-to-r from-brand/20 to-transparent border border-brand/30 text-brand shadow-[0_0_20px_rgba(var(--brand),0.1)]"
                                : "hover:bg-white/5 text-muted-foreground hover:text-foreground border border-transparent"
                        )}
                    >
                        {viewDay === 0 && <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />}
                        {progress.current_day > 0 ? (
                            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-500"><Check className="h-4 w-4" /></div>
                        ) : (
                            <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-500 border border-amber-500/30"><div className="h-2 w-2 rounded-full bg-amber-500" /></div>
                        )}
                        <span className="truncate tracking-tight flex-1">0. Persiapan Alat</span>
                    </button>

                    {/* Days 1–10 */}
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(dayNum => {
                        const day = days.find(d => d.day_number === dayNum);
                        const isCompleted = day?.completed;
                        const isCurrent = dayNum === progress.current_day;
                        const isLocked = dayNum > progress.current_day;
                        const isActiveView = viewDay === dayNum;

                        return (
                            <button
                                key={dayNum}
                                onClick={() => !isLocked && onSelectDay(dayNum)}
                                disabled={isLocked}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-300 relative overflow-hidden group",
                                    isActiveView
                                        ? "bg-gradient-to-r from-brand/20 to-transparent border border-brand/30 shadow-[0_0_20px_rgba(var(--brand),0.1)]"
                                        : isLocked
                                            ? "opacity-50 cursor-not-allowed border border-transparent"
                                            : "hover:bg-white/5 border border-transparent shadow-sm"
                                )}
                            >
                                {isActiveView && <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />}

                                <div className={cn(
                                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0 border transition-all",
                                    isCompleted ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500" :
                                        isCurrent ? "bg-brand/10 border-brand/40 text-brand shadow-[0_0_10px_rgba(var(--brand),0.3)]" :
                                            isLocked ? "bg-muted/30 border-white/5 text-muted-foreground/50" :
                                                "bg-background border-white/10 text-muted-foreground group-hover:border-brand/30"
                                )}>
                                    {isCompleted ? <Check className="h-4 w-4" /> :
                                        isLocked ? <Lock className="h-3 w-3" /> :
                                            <span className="text-xs font-bold">{dayNum}</span>}
                                </div>

                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className={cn(
                                        "truncate font-bold tracking-tight",
                                        isActiveView ? "text-brand" : isLocked ? "text-muted-foreground/70" : "text-foreground group-hover:text-brand"
                                    )}>
                                        Hari {dayNum} {isCurrent && <span className="text-[10px] ml-1 bg-brand/20 text-brand px-1.5 py-0.5 rounded uppercase font-black tracking-widest leading-none align-middle inline-block">Aktif</span>}
                                    </span>
                                    {day?.company_name && (
                                        <span className="text-[11px] text-muted-foreground truncate opacity-80 mt-0.5 font-medium">
                                            {day.company_name}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// DAY 0 — PREPARATION
// ════════════════════════════════════════════════════════════════════
function DayZeroContent({ progress, onComplete }: {
    progress: WizardProgress;
    onComplete: (profileData: Record<string, any>, assessment?: Record<string, any>) => Promise<void>;
}) {
    const [profileData, setProfileData] = React.useState({
        full_name: (progress.profile_data as any)?.full_name || '',
        skills: (progress.profile_data as any)?.skills?.join(', ') || '',
        experience: (progress.profile_data as any)?.experience || '',
        education: (progress.profile_data as any)?.education || '',
        interests: '',
    });
    const [assessment, setAssessment] = React.useState<Record<string, any> | null>(null);
    const [loadingAI, setLoadingAI] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const isDone = progress.current_day > 0;

    const handleAssessment = async () => {
        setLoadingAI(true);
        const result = await runSelfAssessment({
            ...profileData,
            skills: profileData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        });
        if (result.assessment) setAssessment(result.assessment);
        setLoadingAI(false);
    };

    const handleComplete = async () => {
        setSaving(true);
        await onComplete({
            ...profileData,
            skills: profileData.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
        }, assessment || undefined);
        setSaving(false);
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-3 pb-6 border-b border-white/10">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-brand/10 text-brand mb-2">
                    <Zap className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Persiapan Senjata</h2>
                <p className="text-muted-foreground text-lg">Siapkan amunisi profilmu. Cukup lakukan ini 1 kali di awal perjalanan.</p>
            </div>

            {isDone ? (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
                        <CheckCircle2 className="h-20 w-20 mx-auto text-emerald-500 mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        <h3 className="text-2xl font-black mb-2 tracking-tight text-foreground">Persiapan Sudah Sempurna!</h3>
                        <p className="text-muted-foreground text-lg mb-8">Pilih Hari 1 di menu samping untuk memulai misimu mencari kerja.</p>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {/* Guide */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                        <h4 className="font-bold flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-2">
                            <Bot className="h-5 w-5" /> Mission Briefing
                        </h4>
                        <p className="text-sm text-blue-900 dark:text-blue-200/80 leading-relaxed">
                            Data ini adalah pondasi. AI Coach akan membaca data ini untuk membantumu membuat **Surat Lamaran**, **Email**, dan tips interview yang sangat personal & mematikan untuk tiap perusahaan tanpa perlu kamu ketik berulang-ulang.
                        </p>
                    </div>

                    {/* Profile Form */}
                    <div className="bg-background/50 p-5 sm:p-6 rounded-3xl border border-white/5 shadow-inner">
                        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                            <div className="space-y-2 lg:col-span-1">
                                <Label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Nama Pahlawan (Lengkap)</Label>
                                <Input value={profileData.full_name} onChange={e => setProfileData(p => ({ ...p, full_name: e.target.value }))}
                                    placeholder="Budi Santoso" className="h-12 bg-background/50 border-white/10 text-sm sm:text-base rounded-xl focus-visible:ring-brand focus-visible:border-brand" />
                            </div>
                            <div className="space-y-2 lg:col-span-1">
                                <Label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Pendidikan Terakhir</Label>
                                <Input value={profileData.education} onChange={e => setProfileData(p => ({ ...p, education: e.target.value }))}
                                    placeholder="S1 Ilmu Komputer" className="h-12 bg-background/50 border-white/10 text-sm sm:text-base rounded-xl focus-visible:ring-brand" />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Skill / Senjata Utama</Label>
                                <Input value={profileData.skills} onChange={e => setProfileData(p => ({ ...p, skills: e.target.value }))}
                                    placeholder="React, Copywriting, Excel (pisahkan koma)" className="h-12 bg-background/50 border-white/10 text-sm sm:text-base rounded-xl focus-visible:ring-brand" />
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <Label className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">Pengalaman Perang Tersebut</Label>
                                <Textarea value={profileData.experience} onChange={e => setProfileData(p => ({ ...p, experience: e.target.value }))}
                                    placeholder="Ceritakan pengalaman kerja, organisasi, dll."
                                    rows={4} className="bg-background/50 border-white/10 text-sm sm:text-base rounded-xl resize-none py-3 focus-visible:ring-brand" />
                            </div>
                        </div>
                    </div>

                    {/* Assessment Result */}
                    <AnimatePresence>
                        {assessment && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                                <div className="p-6 rounded-3xl bg-gradient-to-br from-brand/10 to-emerald-500/5 border border-brand/20 space-y-5 relative">
                                    <div className="absolute -right-10 -top-10 text-brand/5 rotate-12 pointer-events-none">
                                        <Trophy className="w-40 h-40" />
                                    </div>
                                    <h4 className="font-black text-lg text-foreground flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-brand" /> Hasil Analisis Radar AI
                                    </h4>

                                    {assessment.summary && <p className="text-sm text-muted-foreground leading-relaxed font-medium">{assessment.summary}</p>}

                                    <div className="grid lg:grid-cols-2 gap-6">
                                        {assessment.recommended_positions && (
                                            <div className="space-y-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Target Ideal:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {(assessment.recommended_positions as string[]).map((p: string, i: number) => (
                                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-sm">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {assessment.strengths && (
                                            <div className="space-y-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-brand">Kekuatan Tersembunyi:</span>
                                                <ul className="space-y-1.5">
                                                    {(assessment.strengths as string[]).map((s: string, i: number) => (
                                                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                                            <Check className="h-3.5 w-3.5 text-brand shrink-0 mt-0.5" />
                                                            <span className="leading-snug">{s}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row flex-wrap gap-4 pt-4 border-t border-white/5">
                        {!assessment && (
                            <Button onClick={handleAssessment} disabled={loadingAI || !profileData.full_name || !profileData.skills}
                                variant="outline" className="h-14 rounded-2xl gap-2 font-bold w-full md:flex-1 border-white/10 bg-background/50 hover:bg-brand/5 hover:text-brand hover:border-brand/30 transition-all text-sm sm:text-base">
                                {loadingAI ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-amber-500" />}
                                <span className="truncate">{loadingAI ? 'AI Sedang Membaca Pikiranmu...' : 'Jalankan Radar AI'}</span>
                            </Button>
                        )}

                        <Button onClick={handleComplete} disabled={saving || !profileData.full_name}
                            className={cn(
                                "w-full md:flex-[2] md:min-w-[250px] h-14 rounded-2xl gap-2 sm:gap-3 font-black text-sm sm:text-base transition-all shadow-xl",
                                "bg-gradient-to-r from-brand to-emerald-500 text-white hover:from-brand/90 hover:to-emerald-500/90",
                                !profileData.full_name && "opacity-50 cursor-not-allowed grayscale"
                            )}>
                            {saving ? <Loader2 className="h-5 w-5 animate-spin shrink-0" /> : <Rocket className="h-5 w-5 shrink-0" />}
                            <span className="truncate">{assessment ? "Sempurna! Lanjut ke Misi Hari 1" : "Simpan & Lanjut ke Hari 1"}</span>
                            <ArrowRight className="h-5 w-5 opacity-70 ml-1 shrink-0" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// DAY CONTENT (Hari 1–10)
// ════════════════════════════════════════════════════════════════════
function DayContent({ dayNumber, progress, day, allDays, isActive, onUpdate }: {
    dayNumber: number;
    progress: WizardProgress;
    day?: WizardDay;
    allDays: WizardDay[];
    isActive: boolean;
    onUpdate: () => Promise<void>;
}) {
    const [targetForm, setTargetForm] = React.useState({
        company_name: day?.company_name || '',
        position: day?.position || '',
        job_source: day?.job_source || '',
        send_method: day?.send_method || 'email',
    });
    const [saving, setSaving] = React.useState(false);
    const [completing, setCompleting] = React.useState(false);
    const [showCoach, setShowCoach] = React.useState(false);
    const [aiAdvice, setAiAdvice] = React.useState<string>('');
    const [loadingAdvice, setLoadingAdvice] = React.useState(false);
    const checklist = (day?.checklist || DEFAULT_CHECKLIST) as unknown as Record<string, boolean>;
    const isCompleted = day?.completed;

    // Follow-ups: show for days completed 3+ days ago
    const followUpDays = allDays.filter(d =>
        d.completed && d.day_number < dayNumber && d.day_number <= dayNumber - 3 && !d.follow_up_done && d.company_name
    );

    const handleSaveTarget = async () => {
        if (!targetForm.company_name || !targetForm.position) return;
        setSaving(true);
        await saveDayTarget(dayNumber, targetForm);

        // Get AI advice
        setLoadingAdvice(true);
        const result = await getTargetAdvice(targetForm.company_name, targetForm.position, progress.profile_data);
        if (result.advice) setAiAdvice(result.advice);
        setLoadingAdvice(false);

        await onUpdate();
        setSaving(false);
    };

    const handleStepDone = async (key: ChecklistKey) => {
        await markStepDone(dayNumber, key);
        await onUpdate();
    };

    const handleDayComplete = async () => {
        setCompleting(true);
        await markDayComplete(dayNumber);
        if (dayNumber === 10) {
            // Celebration!
            confetti({
                particleCount: 300,
                spread: 120,
                origin: { y: 0.5 },
                colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
            });
        }
        await onUpdate();
        setCompleting(false);
    };

    const handleFollowUpDone = async (followUpDayNum: number) => {
        await markFollowUpDone(followUpDayNum);
        await onUpdate();
    };

    const allStepsDone = CHECKLIST_STEPS.every(s => checklist[s.key]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl font-black tracking-tight">Hari {dayNumber}</h2>
                        {isCompleted && <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/30 font-bold px-3">Misi Selesai</Badge>}
                    </div>
                    <p className="text-muted-foreground font-medium">
                        {isCompleted ? `Resume berhasil mendarat di ${day?.company_name}!` : 'Satu hari, satu perusahaan, satu langkah lebih dekat.'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowCoach(true)}
                    className="gap-2 h-12 rounded-xl bg-gradient-to-r from-brand/10 to-transparent border-brand/30 text-brand font-bold hover:border-brand hover:bg-brand/20 transition-all shadow-[0_0_15px_rgba(var(--brand),0.1)] shrink-0"
                >
                    <Bot className="h-5 w-5" /> Panggil AI Coach
                </Button>
            </div>

            {/* Target Form */}
            {!checklist.target && isActive && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-brand to-emerald-500 rounded-3xl opacity-20 blur-md pointer-events-none" />
                    <div className="relative bg-background/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20">
                                <Target className="h-5 w-5 text-brand" />
                            </div>
                            <h3 className="text-xl font-black">Target Lock-On!</h3>
                        </div>

                        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
                            <div className="space-y-1.5 md:space-y-2 lg:col-span-1">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Perusahaan Sasaran</Label>
                                <Input value={targetForm.company_name} onChange={e => setTargetForm(p => ({ ...p, company_name: e.target.value }))} placeholder="Nama Perusahaan" className="h-10 sm:h-12 bg-background/50 border-white/10 rounded-xl focus-visible:ring-brand font-medium text-sm sm:text-base" />
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Posisi Impian</Label>
                                <Input value={targetForm.position} onChange={e => setTargetForm(p => ({ ...p, position: e.target.value }))} placeholder="Frontend Developer" className="h-10 sm:h-12 bg-background/50 border-white/10 rounded-xl focus-visible:ring-brand font-medium text-sm sm:text-base" />
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ditemukan di</Label>
                                <Input value={targetForm.job_source} onChange={e => setTargetForm(p => ({ ...p, job_source: e.target.value }))} placeholder="LinkedIn, Portal, Teman" className="h-10 sm:h-12 bg-background/50 border-white/10 rounded-xl focus-visible:ring-brand text-sm sm:text-base" />
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Metode Serangan</Label>
                                <select value={targetForm.send_method} onChange={e => setTargetForm(p => ({ ...p, send_method: e.target.value as 'email' | 'whatsapp' | 'portal' | 'other' }))}
                                    className="h-10 sm:h-12 w-full rounded-xl border border-white/10 bg-background/50 px-3 text-sm focus-visible:ring-1 focus-visible:ring-brand outline-none transition-shadow">
                                    <option value="email">Email Profesional</option>
                                    <option value="whatsapp">Direct WhatsApp</option>
                                    <option value="portal">Portal Website (LinkedIn/Jobstreet)</option>
                                    <option value="other">Metode Lainnya</option>
                                </select>
                            </div>
                        </div>

                        <Button onClick={handleSaveTarget} disabled={saving || !targetForm.company_name || !targetForm.position}
                            className="w-full h-12 sm:h-14 rounded-xl gap-2 font-black text-sm sm:text-base bg-gradient-to-r from-brand to-emerald-600 hover:from-brand/90 hover:to-emerald-600/90 shadow-xl transition-all">
                            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Target className="h-5 w-5" />}
                            Kunci Target & Analisis
                        </Button>
                    </div>
                </motion.div>
            )}

            {/* Target Info (if already set) */}
            {checklist.target && day?.company_name && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-background/80 to-transparent backdrop-blur-md border border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-brand/5 to-transparent pointer-events-none" />

                    <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-brand/10 flex items-center justify-center border border-brand/20 shrink-0">
                        <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-brand" />
                    </div>
                    <div className="flex-1">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-brand mb-1 block">Misi Aktif</span>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground leading-none mb-2">{day.company_name}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground font-medium">
                            <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {day.position}</span>
                            <span className="text-white/20 hidden sm:inline">•</span>
                            <span className="flex items-center gap-1.5 capitalize"><Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Via {day.send_method}</span>
                        </div>
                    </div>
                    {isActive && !isCompleted && (
                        <Button variant="ghost" size="sm" onClick={() => setTargetForm({ ...targetForm, company_name: '' })} className="mt-2 sm:mt-0 self-start sm:self-auto text-xs font-semibold sm:hover:text-red-500 sm:opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <RotateCcw className="h-3.5 w-3.5 mr-1" /> Ganti Target
                        </Button>
                    )}
                </div>
            )}

            {/* AI Advice */}
            <AnimatePresence>
                {(aiAdvice || loadingAdvice) && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/20 relative">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                    <Sparkles className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="font-bold text-blue-400 uppercase tracking-widest text-xs">Intel Analyst AI</p>
                                    {loadingAdvice ? (
                                        <div className="flex items-center gap-3 text-muted-foreground font-medium h-6">
                                            <Loader2 className="h-4 w-4 animate-spin text-blue-500" /> Menyusun strategi serangan...
                                        </div>
                                    ) : (
                                        <p className="text-sm text-blue-100/80 leading-relaxed font-medium whitespace-pre-line">{aiAdvice}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Step Checklist */}
            {checklist.target && (
                <div className="space-y-4">
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                        <ClipboardList className="h-6 w-6 text-brand" /> Roadmap Eksekusi
                    </h3>

                    <div className="grid gap-3">
                        {CHECKLIST_STEPS.map((step, index) => {
                            const isDone = checklist[step.key];
                            let toolHref = step.toolHref;
                            if (step.key === 'email_wa') {
                                toolHref = targetForm.send_method === 'whatsapp' ? '/tools/wa-generator' : '/tools/email-generator';
                            }

                            return (
                                <motion.div
                                    key={step.key}
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                    className={cn(
                                        "flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden group",
                                        isDone ? "bg-emerald-500/10 border-emerald-500/30" : "bg-background/40 hover:bg-white/5 border-white/10 hover:border-white/20"
                                    )}
                                >
                                    {isDone && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />}

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => !isDone && isActive && handleStepDone(step.key)}
                                            disabled={isDone || !isActive}
                                            className={cn(
                                                "h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all border-2 z-10",
                                                isDone ? "bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white" :
                                                    isActive ? "border-muted-foreground/30 group-hover:border-brand/50 bg-background text-muted-foreground group-hover:text-brand" : "border-muted-foreground/10 bg-background/50 text-muted-foreground/30"
                                            )}
                                        >
                                            {isDone ? <Check className="h-5 w-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
                                        </button>

                                        <div className="flex-1 min-w-0 z-10 sm:hidden">
                                            <h4 className={cn("text-base font-bold flex items-center gap-2", isDone ? "text-emerald-500" : "text-foreground")}>
                                                <span className="opacity-80">{step.icon}</span> {step.label}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0 z-10 hidden sm:block">
                                        <h4 className={cn("text-base font-bold flex items-center gap-2", isDone ? "text-emerald-500" : "text-foreground")}>
                                            <span className="opacity-80">{step.icon}</span> {step.label}
                                        </h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                                    </div>

                                    <p className="text-xs text-muted-foreground mt-1 sm:hidden z-10 pl-[52px]">{step.description}</p>

                                    {toolHref && !isDone && isActive && (
                                        <Link href={toolHref} className="z-10 w-full sm:w-auto mt-2 sm:mt-0 pl-[52px] sm:pl-0 shrink-0">
                                            <Button size="sm" variant="secondary" className="w-full sm:w-auto gap-2 h-9 rounded-xl font-bold hover:bg-brand hover:text-white transition-colors">
                                                Go <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Follow-Up Section (Day 4+) */}
            {followUpDays.length > 0 && isActive && (
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><AlertCircle className="w-32 h-32 text-amber-500" /></div>

                    <h3 className="text-sm sm:text-lg font-black text-amber-500 flex items-center gap-2 mb-4 relative z-10">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> Misi Follow-up Tertunda
                    </h3>

                    <div className="grid gap-3 relative z-10">
                        {followUpDays.map(fDay => (
                            <div key={fDay.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-2xl bg-background/80 backdrop-blur-md border border-amber-500/20 shadow-sm">
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                                        <Building2 className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 sm:hidden">
                                        <span className="text-base font-bold block truncate">{fDay.company_name}</span>
                                        <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Lamaran Hari {fDay.day_number} &bull; <span className="text-amber-500">{Math.round((Date.now() - new Date(fDay.completed_at!).getTime()) / (1000 * 60 * 60 * 24))} hari lalu</span></span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 hidden sm:block">
                                    <span className="text-base font-bold block truncate">{fDay.company_name}</span>
                                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">Lamaran Hari {fDay.day_number} &bull; <span className="text-amber-500">{Math.round((Date.now() - new Date(fDay.completed_at!).getTime()) / (1000 * 60 * 60 * 24))} hari lalu</span></span>
                                </div>
                                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto pl-[52px] sm:pl-0 shrink-0">
                                    <Link href="/tools/email-generator" className="flex-1 sm:flex-none">
                                        <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs h-9 rounded-xl font-bold border-amber-500/30 hover:bg-amber-500/10 text-amber-500">Buat Teks</Button>
                                    </Link>
                                    <Button size="sm" variant="default" onClick={() => handleFollowUpDone(fDay.day_number)} className="h-9 w-9 p-0 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex-shrink-0">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Complete Day Button */}
            {isActive && checklist.target && !isCompleted && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="pt-4">
                    <Button
                        onClick={handleDayComplete}
                        disabled={completing || !allStepsDone}
                        className={cn(
                            "w-full h-16 rounded-2xl gap-3 text-lg font-black transition-all shadow-xl",
                            allStepsDone
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02]"
                                : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
                        )}
                    >
                        {completing ? <Loader2 className="h-6 w-6 animate-spin" /> : <CheckCircle2 className="h-6 w-6" />}
                        {dayNumber === 10 ? 'MARK AS MISSION ACCOMPLISHED! 🎉' : `Akhiri Misi Hari ${dayNumber} Dengan Sukses`}
                    </Button>
                    {!allStepsDone && <p className="text-center text-xs text-muted-foreground mt-3 font-medium">Selesaikan semua item di roadmap untuk mengakhiri hari ini.</p>}
                </motion.div>
            )}

            {/* Completion Celebration for Day 10 */}
            {isCompleted && dayNumber === 10 && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div className="p-10 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20 border border-amber-500/30 text-center relative overflow-hidden backdrop-blur-xl shadow-2xl">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="inline-block relative z-10 text-7xl drop-shadow-2xl mb-6">🏆</motion.div>
                        <h3 className="text-4xl font-black mb-3 tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent relative z-10">TUGAS SELESAI, PAHLAWAN!</h3>
                        <p className="text-lg text-amber-100/80 font-medium relative z-10 max-w-lg mx-auto">
                            10 lamaran berkualitas tinggi berhasil diluncurkan. Kamu telah membuktikan dedikasi yang luar biasa. Sekarang biarkan semesta (dan HRD) bekerja!
                        </p>
                    </div>
                </motion.div>
            )}

            {/* AI Coach Modal */}
            <AnimatePresence>
                {showCoach && (
                    <AICoachModal
                        currentDay={dayNumber}
                        companyName={day?.company_name}
                        position={day?.position}
                        profileData={progress.profile_data as Record<string, any>}
                        onClose={() => setShowCoach(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ════════════════════════════════════════════════════════════════════
// AI COACH MODAL
// ════════════════════════════════════════════════════════════════════
function AICoachModal({ currentDay, companyName, position, profileData, onClose }: {
    currentDay: number;
    companyName?: string;
    position?: string;
    profileData?: Record<string, any>;
    onClose: () => void;
}) {
    const [messages, setMessages] = React.useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: `Halo komandan! 🫡 Aku AI Coach-mu. ${companyName ? `Misi kita hari ini tembus ke ${companyName}. ` : ''}Ada yang bisa kubantu? Strategi, tips CV, atau cara nego gaji?` }
    ]);
    const [input, setInput] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        const question = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        setLoading(true);

        const result = await askAICoach(question, { currentDay, companyName, position, profileData });
        setMessages(prev => [...prev, { role: 'ai', content: result.answer || 'Maaf sistem komunikasi terputus sesaat. Coba lagi.' }]);
        setLoading(false);
    };

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full sm:max-w-xl bg-background/90 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh] relative z-10 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-brand/20 flex items-center justify-center shadow-[0_0_15px_rgba(var(--brand),0.3)]">
                            <Bot className="h-5 w-5 text-brand" />
                        </div>
                        <div>
                            <span className="font-black text-base leading-none block">AI Career Coach</span>
                            <span className="text-xs text-brand font-medium flex items-center gap-1 mt-0.5"><div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> Online</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10 h-10 w-10"><X className="h-5 w-5" /></Button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[300px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {messages.map((msg, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={cn(
                                "max-w-[85%] p-4 text-sm leading-relaxed font-medium shadow-sm",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-brand to-emerald-600 text-white rounded-2xl rounded-tr-sm"
                                    : "bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm text-foreground"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-sm w-16 flex items-center justify-center">
                                <span className="flex gap-1">
                                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-brand rounded-full block" />
                                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-brand rounded-full block" />
                                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-brand rounded-full block" />
                                </span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-2" />
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 border-t border-white/10 bg-background/50">
                    <div className="flex gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 sm:p-1.5 focus-within:ring-2 focus-within:ring-brand/50 focus-within:border-brand transition-all">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Ketik pertanyaan untuk pelatih..."
                            className="flex-1 h-10 sm:h-12 border-0 bg-transparent shadow-none focus-visible:ring-0 px-3 sm:px-4 text-sm sm:text-base"
                            disabled={loading}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-brand hover:bg-brand/90 text-white shadow-md shrink-0 p-0"
                        >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5 sm:ml-1" />
                        </Button>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-2 font-medium">✨ Coach AI ditenagai oleh SumoPod Intelligence</p>
                </div>
            </motion.div>
        </div>
    );
}
