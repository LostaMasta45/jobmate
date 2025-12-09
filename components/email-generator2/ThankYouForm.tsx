"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
    User, Briefcase, Building2, UserCircle, Calendar, MessageSquare,
    Loader2, Sparkles, Heart, Clock, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

interface ThankYouFormData {
    fullName: string;
    position: string;
    companyName: string;
    interviewerName: string;
    interviewType: 'hr' | 'user' | 'final';
    interviewDate: string;
    topicsDiscussed: string;
    impression: string;
    additionalInfo: string;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}

const INITIAL_DATA: ThankYouFormData = {
    fullName: '',
    position: '',
    companyName: '',
    interviewerName: '',
    interviewType: 'hr',
    interviewDate: '',
    topicsDiscussed: '',
    impression: '',
    additionalInfo: '',
    emailTone: 'semi_formal',
};

interface ThankYouFormProps {
    userName: string;
    onGenerate: (data: ThankYouFormData) => Promise<void>;
    isGenerating: boolean;
}

export function ThankYouForm({ userName, onGenerate, isGenerating }: ThankYouFormProps) {
    const [formData, setFormData] = useState<ThankYouFormData>({
        ...INITIAL_DATA,
        fullName: userName,
    });

    const updateFormData = (data: Partial<ThankYouFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = formData.fullName && formData.position && formData.companyName && formData.interviewerName && formData.interviewDate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Main Form */}
            <Card className="p-6 sm:p-8 space-y-8 shadow-xl border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative space-y-6">
                    {/* Header Section */}
                    <div className="space-y-2 text-center sm:text-left">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-heart-600 to-heliotrope-600">
                            Email Terima Kasih
                        </h2>
                        <p className="text-muted-foreground">
                            Tunjukkan apresiasimu setelah interview untuk meningkatkan peluang diterima.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                <User className="h-4 w-4 text-purple-heart-500" />
                                Nama Lengkap <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                placeholder="Contoh: Dewi Anggraini"
                                value={formData.fullName}
                                onChange={(e) => updateFormData({ fullName: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                        </div>

                        {/* Title/Position */}
                        <div className="space-y-2">
                            <Label htmlFor="position" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                <Briefcase className="h-4 w-4 text-purple-heart-500" />
                                Posisi yang Dilamar <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="position"
                                placeholder="Contoh: Admin Staff"
                                value={formData.position}
                                onChange={(e) => updateFormData({ position: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Company Name */}
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-purple-heart-500" />
                                Nama Perusahaan <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                placeholder="Contoh: PT ABC Indonesia"
                                value={formData.companyName}
                                onChange={(e) => updateFormData({ companyName: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                        </div>

                        {/* Interviewer Name */}
                        <div className="space-y-2">
                            <Label htmlFor="interviewerName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-purple-heart-500" />
                                Nama Interviewer <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="interviewerName"
                                placeholder="Contoh: Ibu Sarah, Bapak Rudi"
                                value={formData.interviewerName}
                                onChange={(e) => updateFormData({ interviewerName: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                            <p className="text-xs text-muted-foreground ml-1">
                                Pisahkan dengan koma jika lebih dari satu
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                    {/* Interview Type */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-heart-500" />
                            Jenis Interview <span className="text-destructive">*</span>
                        </Label>
                        <RadioGroup
                            value={formData.interviewType}
                            onValueChange={(value) => updateFormData({ interviewType: value as ThankYouFormData['interviewType'] })}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                        >
                            {[
                                { value: 'hr', label: 'HR Interview', icon: '👤', desc: 'Screening awal' },
                                { value: 'user', label: 'User Interview', icon: '👥', desc: 'Teknis / Tim' },
                                { value: 'final', label: 'Final Interview', icon: '🧑‍💼', desc: 'Direksi / Offering' },
                            ].map((option) => (
                                <Label
                                    key={option.value}
                                    htmlFor={`type-${option.value}`}
                                    className={`
                                        flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                                        hover:shadow-md
                                        ${formData.interviewType === option.value
                                            ? 'border-purple-heart-500 bg-purple-heart-50 dark:bg-purple-heart-900/20'
                                            : 'border-muted hover:border-purple-heart-200 bg-background/50'}
                                    `}
                                >
                                    <RadioGroupItem value={option.value} id={`type-${option.value}`} className="sr-only" />
                                    <span className="text-2xl mb-2 filter drop-shadow-sm">{option.icon}</span>
                                    <span className="font-semibold text-foreground">{option.label}</span>
                                    <span className="text-xs text-muted-foreground mt-1">{option.desc}</span>
                                </Label>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* Interview Date */}
                    <div className="space-y-2 max-w-sm">
                        <Label htmlFor="interviewDate" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-heart-500" />
                            Tanggal Interview <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="interviewDate"
                            type="date"
                            value={formData.interviewDate}
                            onChange={(e) => updateFormData({ interviewDate: e.target.value })}
                            className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                        />
                    </div>

                    <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                    {/* Topics Discussed */}
                    <div className="space-y-2">
                        <Label htmlFor="topicsDiscussed" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-heart-500" />
                            Hal Menarik yang Dibahas <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            id="topicsDiscussed"
                            placeholder="Contoh: Diskusi tentang project baru perusahaan, budaya kerja tim yang suportif, atau tantangan di role ini."
                            value={formData.topicsDiscussed}
                            onChange={(e) => updateFormData({ topicsDiscussed: e.target.value })}
                            className="min-h-[80px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                        />
                        <p className="text-xs text-muted-foreground ml-1">
                            Akan membuat email terasa lebih personal dan menunjukkan kamu menyimak.
                        </p>
                    </div>

                    {/* Impression */}
                    <div className="space-y-2">
                        <Label htmlFor="impression" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <Heart className="h-4 w-4 text-purple-heart-500" />
                            Kesan Selama Interview <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            id="impression"
                            placeholder="Contoh: Sangat terkesan dengan visi perusahaan, suasana kantor yang nyaman, atau keramahan interviewer."
                            value={formData.impression}
                            onChange={(e) => updateFormData({ impression: e.target.value })}
                            className="min-h-[80px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2">
                        <Label htmlFor="additionalInfo" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-heart-500" />
                            Ada yang Ingin Ditambahkan? <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            id="additionalInfo"
                            placeholder="Contoh: Saya lupa menyebutkan pengalaman volunteer saya yang relevan, atau melampirkan portfolio tambahan."
                            value={formData.additionalInfo}
                            onChange={(e) => updateFormData({ additionalInfo: e.target.value })}
                            className="min-h-[80px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                        />
                        <p className="text-xs text-muted-foreground ml-1">
                            Gunakan ini jika ada poin penting yang terlewat saat interview.
                        </p>
                    </div>

                    <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                    {/* Email Tone */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold text-foreground/80">Gaya Bahasa Email</Label>
                        <RadioGroup
                            value={formData.emailTone}
                            onValueChange={(value) => updateFormData({ emailTone: value as ThankYouFormData['emailTone'] })}
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
                                            ? 'border-purple-heart-500 bg-purple-heart-50 dark:bg-purple-heart-900/20'
                                            : 'border-muted hover:border-purple-heart-200 bg-background/50'}
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
                <Card className="p-4 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200 flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <span><strong>Tips:</strong> Kirim email ini dalam <strong>1x24 jam</strong> setelah interview untuk memberikan kesan profesional dan antusias.</span>
                    </p>
                </Card>
            </motion.div>

            {/* Generate Button */}
            <div className="flex justify-center pt-4">
                <Button
                    size="lg"
                    onClick={() => onGenerate(formData)}
                    disabled={!canGenerate || isGenerating}
                    className="h-14 px-8 text-lg gap-2.5 rounded-full bg-gradient-to-r from-purple-heart-600 to-heliotrope-600 hover:from-purple-heart-700 hover:to-heliotrope-700 text-white shadow-xl shadow-purple-heart-500/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Sedang Membuat Email...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-6 w-6" />
                            Generate Email Terima Kasih
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export type { ThankYouFormData };
