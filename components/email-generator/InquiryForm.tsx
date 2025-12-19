"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { User, Building2, Briefcase, Heart, GraduationCap, Phone, FileText, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingOverlay } from "./LoadingOverlay";

interface InquiryFormData {
    fullName: string;
    companyName: string;
    interestedFields: string;
    whyInterested: string;
    briefExperience: string;
    skills: string;
    phoneNumber: string;
    attachCV: boolean;
    emailTone: 'formal' | 'semi_formal' | 'casual';
}

const INITIAL_DATA: InquiryFormData = {
    fullName: '',
    companyName: '',
    interestedFields: '',
    whyInterested: '',
    briefExperience: '',
    skills: '',
    phoneNumber: '',
    attachCV: true,
    emailTone: 'semi_formal',
};

interface InquiryFormProps {
    userName: string;
    onGenerate: (data: InquiryFormData) => Promise<void>;
    isGenerating: boolean;
    onBack?: () => void;
}

export function InquiryForm({ userName, onGenerate, isGenerating, onBack }: InquiryFormProps) {
    const [formData, setFormData] = useState<InquiryFormData>({
        ...INITIAL_DATA,
        fullName: userName,
    });

    const updateFormData = (data: Partial<InquiryFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = formData.fullName && formData.companyName && formData.interestedFields && formData.whyInterested;

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-gmail-blue-50/50 via-background to-gmail-green-50/30 dark:from-blue-950/20 dark:via-background dark:to-green-950/20 overflow-hidden relative">
            <AnimatePresence>
                <LoadingOverlay isVisible={isGenerating} type="inquiry" />
            </AnimatePresence>

            {/* Header Bar - Fixed Flex Item */}
            <div className="flex-none z-20 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-muted">
                            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        </Button>
                        <div>
                            <h1 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gmail-blue-600 to-gmail-blue-500">
                                Email Inquiry
                            </h1>
                            <p className="text-sm text-muted-foreground">Tanyakan peluang karir dengan profesional</p>
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
                        {/* Tips */}
                        <Card className="p-4 bg-gmail-blue-50 dark:bg-blue-950/30 border-gmail-blue-200 dark:border-blue-800">
                            <p className="text-sm text-gmail-blue-800 dark:text-blue-200">
                                💡 <strong>Tips:</strong> Email inquiry cocok saat kamu tertarik dengan perusahaan tapi belum ada posisi yang sesuai dibuka
                            </p>
                        </Card>

                        {/* Main Form */}
                        <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl relative overflow-hidden">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-base flex items-center gap-2">
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

                            {/* Company Name */}
                            <div className="space-y-2">
                                <Label htmlFor="companyName" className="text-base flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-purple-heart-500" />
                                    Nama Perusahaan yang Dituju <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="companyName"
                                    placeholder="Contoh: PT ABC Indonesia"
                                    value={formData.companyName}
                                    onChange={(e) => updateFormData({ companyName: e.target.value })}
                                    className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                            </div>

                            {/* Interested Fields */}
                            <div className="space-y-2">
                                <Label htmlFor="interestedFields" className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-purple-heart-500" />
                                    Bidang/Posisi yang Diminati <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="interestedFields"
                                    placeholder="Contoh: Marketing, Digital Marketing, Social Media"
                                    value={formData.interestedFields}
                                    onChange={(e) => updateFormData({ interestedFields: e.target.value })}
                                    className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                                <p className="text-xs text-muted-foreground">
                                    💡 Bisa lebih dari satu bidang
                                </p>
                            </div>

                            {/* Why Interested */}
                            <div className="space-y-2">
                                <Label htmlFor="whyInterested" className="text-base flex items-center gap-2">
                                    <Heart className="h-4 w-4 text-purple-heart-500" />
                                    Kenapa Tertarik dengan Perusahaan Ini? <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="whyInterested"
                                    placeholder="Contoh: Saya mengikuti perkembangan perusahaan ini sejak lama dan sangat mengagumi produk-produk inovatif yang dihasilkan..."
                                    value={formData.whyInterested}
                                    onChange={(e) => updateFormData({ whyInterested: e.target.value })}
                                    className="min-h-[100px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                            </div>

                            <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                            {/* Brief Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="briefExperience" className="text-base flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-purple-heart-500" />
                                    Pengalaman Singkat <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Textarea
                                    id="briefExperience"
                                    placeholder="Contoh: 2 tahun di bidang marketing, pernah handle social media dengan 50k followers"
                                    value={formData.briefExperience}
                                    onChange={(e) => updateFormData({ briefExperience: e.target.value })}
                                    className="min-h-[80px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <Label htmlFor="skills" className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-purple-heart-500" />
                                    Skill Utama <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="skills"
                                    placeholder="Contoh: Social Media Marketing, Content Creation, Analytics"
                                    value={formData.skills}
                                    onChange={(e) => updateFormData({ skills: e.target.value })}
                                    className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber" className="text-base flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-purple-heart-500" />
                                    Nomor HP / WhatsApp <span className="text-muted-foreground text-sm">(opsional)</span>
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    placeholder="Contoh: 081234567890"
                                    value={formData.phoneNumber}
                                    onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                                    className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                                />
                            </div>

                            <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                            {/* Attach CV */}
                            <div className="space-y-3">
                                <Label className="text-base flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-purple-heart-500" />
                                    Apakah CV Dilampirkan?
                                </Label>
                                <RadioGroup
                                    value={formData.attachCV ? 'yes' : 'no'}
                                    onValueChange={(value) => updateFormData({ attachCV: value === 'yes' })}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {[
                                        { value: 'yes', label: 'Ya, lampirkan CV', icon: '✅' },
                                        { value: 'no', label: 'Tidak', icon: '❌' },
                                    ].map((option) => (
                                        <Label
                                            key={option.value}
                                            htmlFor={`cv-${option.value}`}
                                            className={`
                                                flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all
                                                ${(formData.attachCV && option.value === 'yes') || (!formData.attachCV && option.value === 'no')
                                                    ? 'border-purple-heart-500 bg-purple-heart-50 dark:bg-purple-heart-900/20'
                                                    : 'border-muted hover:border-purple-heart-200 bg-background/50'}
                                            `}
                                        >
                                            <RadioGroupItem value={option.value} id={`cv-${option.value}`} className="sr-only" />
                                            <span>{option.icon}</span>
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Email Tone */}
                            <div className="space-y-3">
                                <Label className="text-base">Gaya Bahasa</Label>
                                <RadioGroup
                                    value={formData.emailTone}
                                    onValueChange={(value) => updateFormData({ emailTone: value as InquiryFormData['emailTone'] })}
                                    className="grid grid-cols-3 gap-3"
                                >
                                    {[
                                        { value: 'formal', label: 'Formal', icon: '👔' },
                                        { value: 'semi_formal', label: 'Semi-Formal', icon: '👕' },
                                        { value: 'casual', label: 'Santai', icon: '😊' },
                                    ].map((option) => (
                                        <Label
                                            key={option.value}
                                            htmlFor={`tone-${option.value}`}
                                            className={`
                                                flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all
                                                ${formData.emailTone === option.value
                                                    ? 'border-purple-heart-500 bg-purple-heart-50 dark:bg-purple-heart-900/20'
                                                    : 'border-muted hover:border-purple-heart-200 bg-background/50'}
                                            `}
                                        >
                                            <RadioGroupItem value={option.value} id={`tone-${option.value}`} className="sr-only" />
                                            <span>{option.icon}</span>
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>
                        </Card>
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
                        className="flex-1 sm:flex-none gap-2 min-w-[200px] h-12 rounded-full bg-gradient-to-r from-gmail-blue-600 to-gmail-blue-500 hover:from-gmail-blue-700 hover:to-gmail-blue-600 text-white shadow-xl shadow-gmail-blue-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Sedang Membuat...
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                Generate Email Inquiry
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export type { InquiryFormData };
