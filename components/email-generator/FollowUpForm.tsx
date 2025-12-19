"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
    User, Briefcase, Building2, UserCircle, Calendar, Clock,
    Phone, MessageSquare, Loader2, Sparkles, ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "./LoadingOverlay";

interface FollowUpFormData {
    fullName: string;
    position: string;
    companyName: string;
    hrdName: string;
    lastStage: 'sent_application' | 'test' | 'interview';
    lastInteractionDate: string;
    promisedFollowUp: string;
    phoneNumber: string;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}

const INITIAL_DATA: FollowUpFormData = {
    fullName: '',
    position: '',
    companyName: '',
    hrdName: '',
    lastStage: 'sent_application',
    lastInteractionDate: '',
    promisedFollowUp: '',
    phoneNumber: '',
    emailTone: 'semi_formal',
};

interface FollowUpFormProps {
    userName: string;
    onGenerate: (data: FollowUpFormData) => Promise<void>;
    isGenerating: boolean;
    onBack?: () => void;
}

export function FollowUpForm({ userName, onGenerate, isGenerating, onBack }: FollowUpFormProps) {
    const [formData, setFormData] = useState<FollowUpFormData>({
        ...INITIAL_DATA,
        fullName: userName,
    });

    const updateFormData = (data: Partial<FollowUpFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = formData.fullName && formData.position && formData.companyName && formData.lastInteractionDate;

    // Calculate days since last interaction
    const getDaysSince = () => {
        if (!formData.lastInteractionDate) return null;
        const lastDate = new Date(formData.lastInteractionDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const daysSince = getDaysSince();

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gmail-red-50/50 via-background to-gmail-blue-50/30 dark:from-red-950/20 dark:via-background dark:to-blue-950/20 overflow-hidden relative">
            <AnimatePresence>
                <LoadingOverlay isVisible={isGenerating} type="follow_up" />
            </AnimatePresence>

            {/* Header Bar - Fixed Flex Item */}
            <div className="flex-none z-20 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-muted">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gmail-red-600 to-gmail-red-500">
                                Email Follow-Up
                            </h1>
                            <p className="text-sm text-muted-foreground">Tindak lanjuti lamaranmu secara profesional</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <div className="max-w-3xl mx-auto px-4 py-8 min-h-full pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Main Form */}
                        <Card className="p-6 sm:p-8 space-y-8 shadow-xl border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl relative overflow-hidden">
                            {/* Decorative gradients */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gmail-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gmail-red-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <User className="h-4 w-4 text-gmail-red-500" />
                                            Nama Lengkap <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            placeholder="Contoh: Dewi Anggraini"
                                            value={formData.fullName}
                                            onChange={(e) => updateFormData({ fullName: e.target.value })}
                                            className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                        />
                                    </div>

                                    {/* Title/Position */}
                                    <div className="space-y-2">
                                        <Label htmlFor="position" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-gmail-red-500" />
                                            Posisi yang Dilamar <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="position"
                                            placeholder="Contoh: Admin Staff"
                                            value={formData.position}
                                            onChange={(e) => updateFormData({ position: e.target.value })}
                                            className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Company Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-gmail-red-500" />
                                            Nama Perusahaan <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="companyName"
                                            placeholder="Contoh: PT ABC Indonesia"
                                            value={formData.companyName}
                                            onChange={(e) => updateFormData({ companyName: e.target.value })}
                                            className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                        />
                                    </div>

                                    {/* HRD Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="hrdName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <UserCircle className="h-4 w-4 text-gmail-red-500" />
                                            Nama HRD / Interviewer <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                                        </Label>
                                        <Input
                                            id="hrdName"
                                            placeholder="Contoh: Ibu Sarah"
                                            value={formData.hrdName}
                                            onChange={(e) => updateFormData({ hrdName: e.target.value })}
                                            className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-gmail-red-100 dark:border-white/10 pt-4" />

                                {/* Last Stage */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gmail-red-500" />
                                        Tahapan Terakhir <span className="text-destructive">*</span>
                                    </Label>
                                    <RadioGroup
                                        value={formData.lastStage}
                                        onValueChange={(value) => updateFormData({ lastStage: value as FollowUpFormData['lastStage'] })}
                                        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                    >
                                        {[
                                            { value: 'sent_application', label: 'Kirim Lamaran', icon: '📧', desc: 'Baru kirim email' },
                                            { value: 'test', label: 'Tahap Tes', icon: '📝', desc: 'Sudah psikotes/teknis' },
                                            { value: 'interview', label: 'Interview', icon: '🗣️', desc: 'Sudah wawancara' },
                                        ].map((option) => (
                                            <Label
                                                key={option.value}
                                                htmlFor={option.value}
                                                className={`
                                                    flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                                                    hover:shadow-md
                                                    ${formData.lastStage === option.value
                                                        ? 'border-gmail-red-500 bg-gmail-red-50 dark:bg-gmail-red-900/20'
                                                        : 'border-muted hover:border-gmail-red-200 bg-background/50'}
                                                `}
                                            >
                                                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                                                <span className="text-2xl mb-2 filter drop-shadow-sm">{option.icon}</span>
                                                <span className="font-semibold text-foreground">{option.label}</span>
                                                <span className="text-xs text-muted-foreground mt-1">{option.desc}</span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Last Interaction Date */}
                                    <div className="space-y-2">
                                        <Label htmlFor="lastInteractionDate" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gmail-red-500" />
                                            Tanggal Terakhir Interaksi <span className="text-destructive">*</span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="lastInteractionDate"
                                                type="date"
                                                value={formData.lastInteractionDate}
                                                onChange={(e) => updateFormData({ lastInteractionDate: e.target.value })}
                                                className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all block w-full"
                                            />
                                        </div>
                                        {daysSince !== null && (
                                            <div className={`text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${daysSince < 5 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{daysSince} hari yang lalu</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gmail-red-500" />
                                            Nomor HP / WA <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                                        </Label>
                                        <Input
                                            id="phoneNumber"
                                            placeholder="08123456789 (untuk dicantumkan di email)"
                                            value={formData.phoneNumber}
                                            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                                            className="h-12 text-base bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Promised Follow Up */}
                                <div className="space-y-2">
                                    <Label htmlFor="promisedFollowUp" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4 text-gmail-red-500" />
                                        Apa yang Dijanjikan HRD? <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                                    </Label>
                                    <Textarea
                                        id="promisedFollowUp"
                                        placeholder="Contoh: HRD bilang akan mengabari dalam 1 minggu, atau proses rekrutmen akan memakan waktu 2 minggu."
                                        value={formData.promisedFollowUp}
                                        onChange={(e) => updateFormData({ promisedFollowUp: e.target.value })}
                                        className="min-h-[80px] text-base resize-none bg-background/50 border-gmail-red-100 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 transition-all"
                                    />
                                </div>

                                <div className="border-t border-gmail-red-100 dark:border-white/10 pt-4" />

                                {/* Email Tone */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-foreground/80">Gaya Bahasa Email</Label>
                                    <RadioGroup
                                        value={formData.emailTone}
                                        onValueChange={(value) => updateFormData({ emailTone: value as FollowUpFormData['emailTone'] })}
                                        className="grid grid-cols-3 gap-3"
                                    >
                                        {[
                                            { value: 'formal', label: 'Formal', icon: '👔', desc: 'Resmi' },
                                            { value: 'semi_formal', label: 'Semi-Formal', icon: '👕', desc: 'Profesional' },
                                            { value: 'casual', label: 'Santai', icon: '😊', desc: 'Friendly' },
                                        ].map((option) => (
                                            <Label
                                                key={option.value}
                                                htmlFor={`tone-${option.value}`}
                                                className={`
                                                    flex flex-col items-center justify-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all
                                                    hover:shadow-sm
                                                    ${formData.emailTone === option.value
                                                        ? 'border-gmail-red-500 bg-gmail-red-50 dark:bg-gmail-red-900/20'
                                                        : 'border-muted hover:border-gmail-red-200 bg-background/50'}
                                                `}
                                            >
                                                <RadioGroupItem value={option.value} id={`tone-${option.value}`} className="sr-only" />
                                                <span className="text-xl filter drop-shadow-sm">{option.icon}</span>
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </Card>

                        {/* Tips Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-4 bg-gmail-red-50 dark:bg-red-950/30 border-gmail-red-200 dark:border-red-800">
                                <p className="text-sm text-gmail-red-800 dark:text-red-200 flex items-start gap-2">
                                    <span className="text-lg">💡</span>
                                    <span><strong>Tips:</strong> Kirim follow-up jika sudah <strong>{daysSince} hari</strong> tidak ada kabar. Jangan kirim terlalu sering!</span>
                                </p>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Footer Bar - Fixed Bottom Flex Item */}
            <div className="flex-none z-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-white/20 dark:border-white/10 py-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-3xl mx-auto flex gap-4 items-center justify-end">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="flex-none gap-2 text-muted-foreground hover:text-foreground active:scale-95 transition-transform"
                    >
                        Batal
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => onGenerate(formData)}
                        disabled={!canGenerate || isGenerating}
                        className="flex-1 sm:flex-none gap-2 min-w-[200px] h-12 rounded-full bg-gradient-to-r from-gmail-red-600 to-gmail-red-500 hover:from-gmail-red-700 hover:to-gmail-red-600 text-white shadow-xl shadow-gmail-red-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Sedang Membuat...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Buat Email Follow-up
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { FollowUpFormData };
