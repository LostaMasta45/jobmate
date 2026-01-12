"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Copy, Check, Mail, Save, RefreshCw, Loader2,
    Edit3, X, Sparkles, ExternalLink, CheckCircle2,
    Lightbulb, AlertCircle, Quote
} from "lucide-react";
import { toast } from "sonner";
import type { EmailFormDataV2 } from "./EmailWizardV2";
import { EmailVariationsV2 } from "./EmailVariationsV2";

interface StepPreviewProps {
    formData: Partial<EmailFormDataV2> & { generatedEmail: string; subjectLine: string; position: string; companyName: string; fullName: string };
    updateFormData: (data: Partial<EmailFormDataV2>) => void;
    onRegenerate: () => Promise<void>;
    onReset?: () => void;
    isGenerating: boolean;
    emailType?: 'application' | 'follow_up' | 'thank_you' | 'inquiry';
}

export function StepPreview({
    formData,
    updateFormData,
    onRegenerate,
    onReset,
    isGenerating,
    emailType = 'application'
}: StepPreviewProps) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [editedBody, setEditedBody] = useState(formData.generatedEmail);
    const [editedSubject, setEditedSubject] = useState(formData.subjectLine);

    const handleCopy = async () => {
        const fullEmail = `Subject: ${formData.subjectLine}\n\n${formData.generatedEmail}`;
        try {
            await navigator.clipboard.writeText(fullEmail);
            setCopied(true);
            toast.success("Email dicopy ke clipboard!");
            setTimeout(() => setCopied(false), 2000);

            // Track copy usage
            try {
                const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
                await logToolUsageWithNotification("Email Template Copy", `${formData.position} at ${formData.companyName}`);
            } catch (e) { console.error("[Tracking] Failed:", e); }
        } catch {
            toast.error("Gagal copy email");
        }
    };

    const handleOpenEmail = () => {
        const subject = encodeURIComponent(formData.subjectLine);
        const body = encodeURIComponent(formData.generatedEmail);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { saveEmailDraft } = await import("@/actions/email/save");

            const result = await saveEmailDraft({
                emailType: emailType,
                position: formData.position || '',
                companyName: formData.companyName || '',
                hrdName: formData.hrdName || '',
                toneStyle: 'semi-formal', // Ideally these should come from formData if available
                personality: 'balanced',
                lengthType: 'medium',
                subjectLine: formData.subjectLine,
                bodyContent: formData.generatedEmail,
                highlightSkills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
                achievements: '',
                includeWhyCompany: false,
                includeWhyYou: true,
                hasAttachment: true,
                status: 'draft',
            });

            if (result.error) {
                toast.error("Gagal menyimpan: " + result.error);
                return;
            }

            setIsSaved(true);
            toast.success("Email tersimpan ke riwayat!");
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRegenerate = async () => {
        setIsSaved(false);
        await onRegenerate();
    };

    const handleStartEdit = () => {
        setEditedBody(formData.generatedEmail);
        setEditedSubject(formData.subjectLine);
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        updateFormData({
            generatedEmail: editedBody,
            subjectLine: editedSubject
        });
        setIsEditing(false);
        setIsSaved(false);
        toast.success("Perubahan disimpan!");
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedBody(formData.generatedEmail);
        setEditedSubject(formData.subjectLine);
    };

    const wordCount = formData.generatedEmail.split(/\s+/).filter(Boolean).length;

    return (
        <div className="space-y-6">
            {/* Email Preview Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="overflow-hidden shadow-xl border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gmail-red-500/10 via-gmail-red-500/5 to-transparent p-4 border-b border-gmail-red-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <span className="font-semibold text-foreground">Preview Email</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">{wordCount} kata</span>
                            {!isEditing && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleStartEdit}
                                    className="h-8 hover:bg-gmail-red-50 dark:hover:bg-gmail-red-900/20 hover:text-gmail-red-600 transition-colors"
                                >
                                    <Edit3 className="h-4 w-4 mr-1.5" />
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-8 space-y-6">
                        {isEditing ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-4"
                            >
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-gmail-red-600 dark:text-gmail-red-400">Subject</Label>
                                    <Input
                                        value={editedSubject}
                                        onChange={(e) => setEditedSubject(e.target.value)}
                                        className="font-medium text-lg h-12 bg-background/50 border-gmail-red-200 focus:border-gmail-red-500 transition-all rounded-xl"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-gmail-red-600 dark:text-gmail-red-400">Body Email</Label>
                                    <Textarea
                                        value={editedBody}
                                        onChange={(e) => setEditedBody(e.target.value)}
                                        className="min-h-[350px] font-mono text-sm leading-relaxed bg-background/50 border-gmail-red-200 focus:border-gmail-red-500 transition-all rounded-xl p-4 resize-y"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end pt-2">
                                    <Button variant="outline" onClick={handleCancelEdit} className="rounded-xl border-muted-foreground/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30">
                                        <X className="h-4 w-4 mr-2" />
                                        Batal
                                    </Button>
                                    <Button onClick={handleSaveEdit} className="rounded-xl bg-gmail-red-600 hover:bg-gmail-red-700 text-white shadow-lg shadow-gmail-red-500/20">
                                        <Check className="h-4 w-4 mr-2" />
                                        Simpan Perubahan
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-6"
                            >
                                {/* Subject View */}
                                <div className="space-y-1.5">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Subject</div>
                                    <div className="font-semibold text-lg text-foreground border-b border-border/50 pb-2">
                                        {formData.subjectLine}
                                    </div>
                                </div>

                                {/* Body View */}
                                <div className="space-y-1.5">
                                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Body</div>
                                    <div className="whitespace-pre-wrap text-foreground leading-loose text-[15px] font-normal text-slate-700 dark:text-slate-200 font-sans p-4 rounded-xl bg-background/30 border border-white/10">
                                        {formData.generatedEmail}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </Card>
            </motion.div>

            {/* Action Buttons */}
            {!isEditing && (
                <Card className="p-4 sm:p-5 shadow-xl border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur rounded-2xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <Button
                            onClick={handleCopy}
                            variant="outline"
                            className="h-12 sm:h-14 gap-2.5 rounded-xl border-muted-foreground/20 hover:bg-gmail-red-50 hover:text-gmail-red-600 hover:border-gmail-red-200 dark:hover:bg-gmail-red-900/20 transition-all active:scale-95"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-5 w-5" />
                                    <span className="font-medium">Copy</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving || isSaved}
                            variant="outline"
                            className="h-12 sm:h-14 gap-2.5 rounded-xl border-muted-foreground/20 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/20 transition-all active:scale-95"
                        >
                            {isSaving ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : isSaved ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">Saved</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span className="font-medium">Simpan</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleRegenerate}
                            disabled={isGenerating}
                            variant="outline"
                            className="h-12 sm:h-14 gap-2.5 rounded-xl border-muted-foreground/20 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-900/20 transition-all active:scale-95"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <RefreshCw className="h-5 w-5" />
                                    <span className="font-medium">Generate Ulang</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={handleOpenEmail}
                            className="h-12 sm:h-14 gap-2.5 rounded-xl bg-gradient-to-br from-gmail-red-600 to-gmail-red-500 hover:from-gmail-red-700 hover:to-gmail-red-600 text-white shadow-lg shadow-gmail-red-500/20 transition-all active:scale-95 hover:translate-y-[-2px]"
                        >
                            <ExternalLink className="h-5 w-5" />
                            <span className="font-semibold">Kirim Email</span>
                        </Button>
                    </div>

                    {/* New Email Button */}
                    <div className="mt-4 pt-3 border-t border-border/50 flex justify-center">
                        <Button
                            onClick={onReset}
                            variant="ghost"
                            className="gap-2 text-muted-foreground hover:text-gmail-red-500 hover:bg-gmail-red-50/50 rounded-full px-6 transition-all"
                        >
                            <Sparkles className="h-4 w-4" />
                            Buat Email Baru
                        </Button>
                    </div>
                </Card>
            )}

            {/* 3 Email Variations - Available for all email types */}
            {!isEditing && (
                <EmailVariationsV2
                    formData={formData}
                    emailType={emailType}
                    onSelectVariation={(subject, body) => {
                        updateFormData({
                            generatedEmail: body,
                            subjectLine: subject
                        });
                        setIsSaved(false);
                    }}
                />
            )}

            {/* Tips & Tutorial Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                {/* Before Sending Checklist - Expanded for better visibility */}
                <Card className="p-5 bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-950/30 dark:to-green-900/20 border-emerald-100 dark:border-emerald-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle2 className="w-24 h-24 text-emerald-600" />
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <div className="p-3 bg-emerald-100 rounded-xl h-fit text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-emerald-900 dark:text-emerald-100">Checklist Sebelum Kirim</h4>
                            <ul className="text-sm text-emerald-800 dark:text-emerald-200/80 space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Cek <strong>nama perusahaan & posisi</strong> sudah benar</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Pastikan tidak ada <strong>typo</strong> yang fatal</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Lampirkan <strong>CV (PDF)</strong> maks 2MB</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                    <span>Subject email <strong>jelas & to the point</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* Pro Tips */}
                <Card className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-950/30 dark:to-yellow-900/20 border-amber-100 dark:border-amber-800/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lightbulb className="w-24 h-24 text-amber-600" />
                    </div>
                    <div className="relative z-10 flex gap-4">
                        <div className="p-3 bg-amber-100 rounded-xl h-fit text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-bold text-amber-900 dark:text-amber-100">Pro Tips HRD</h4>
                            <ul className="text-sm text-amber-800 dark:text-amber-200/80 space-y-2 list-none">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Kirim di jam kerja <strong>(09.00 - 15.00)</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Simpan email ini untuk <strong>tracking lamaran</strong></span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Kirim <strong>follow-up</strong> setelah 2 minggu no respon</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
