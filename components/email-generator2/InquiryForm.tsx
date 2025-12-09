"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { User, Building2, Briefcase, Heart, GraduationCap, Phone, FileText, Loader2, Sparkles } from "lucide-react";
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
}

export function InquiryForm({ userName, onGenerate, isGenerating }: InquiryFormProps) {
    const [formData, setFormData] = useState<InquiryFormData>({
        ...INITIAL_DATA,
        fullName: userName,
    });

    const updateFormData = (data: Partial<InquiryFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = formData.fullName && formData.companyName && formData.interestedFields && formData.whyInterested;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <AnimatePresence>
                <LoadingOverlay isVisible={isGenerating} type="inquiry" />
            </AnimatePresence>

            {/* Tips */}
            <Card className="p-4 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                    💡 <strong>Tips:</strong> Email inquiry cocok saat kamu tertarik dengan perusahaan tapi belum ada posisi yang sesuai dibuka
                </p>
            </Card>

            {/* Main Form */}
            <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-0 bg-card/50 backdrop-blur">
                {/* Full Name */}
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-base flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Nama Lengkap <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="fullName"
                        placeholder="Contoh: Dewi Anggraini"
                        value={formData.fullName}
                        onChange={(e) => updateFormData({ fullName: e.target.value })}
                        className="h-12 text-base"
                    />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Nama Perusahaan yang Dituju <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="companyName"
                        placeholder="Contoh: PT ABC Indonesia"
                        value={formData.companyName}
                        onChange={(e) => updateFormData({ companyName: e.target.value })}
                        className="h-12 text-base"
                    />
                </div>

                {/* Interested Fields */}
                <div className="space-y-2">
                    <Label htmlFor="interestedFields" className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Bidang/Posisi yang Diminati <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="interestedFields"
                        placeholder="Contoh: Marketing, Digital Marketing, Social Media"
                        value={formData.interestedFields}
                        onChange={(e) => updateFormData({ interestedFields: e.target.value })}
                        className="h-12 text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                        💡 Bisa lebih dari satu bidang
                    </p>
                </div>

                {/* Why Interested */}
                <div className="space-y-2">
                    <Label htmlFor="whyInterested" className="text-base flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary" />
                        Kenapa Tertarik dengan Perusahaan Ini? <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="whyInterested"
                        placeholder="Contoh: Saya mengikuti perkembangan perusahaan ini sejak lama dan sangat mengagumi produk-produk inovatif yang dihasilkan..."
                        value={formData.whyInterested}
                        onChange={(e) => updateFormData({ whyInterested: e.target.value })}
                        className="min-h-[100px] text-base resize-none"
                    />
                </div>

                <div className="border-t pt-6" />

                {/* Brief Experience */}
                <div className="space-y-2">
                    <Label htmlFor="briefExperience" className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        Pengalaman Singkat <span className="text-muted-foreground text-sm">(opsional)</span>
                    </Label>
                    <Textarea
                        id="briefExperience"
                        placeholder="Contoh: 2 tahun di bidang marketing, pernah handle social media dengan 50k followers"
                        value={formData.briefExperience}
                        onChange={(e) => updateFormData({ briefExperience: e.target.value })}
                        className="min-h-[80px] text-base resize-none"
                    />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                    <Label htmlFor="skills" className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        Skill Utama <span className="text-muted-foreground text-sm">(opsional)</span>
                    </Label>
                    <Input
                        id="skills"
                        placeholder="Contoh: Social Media Marketing, Content Creation, Analytics"
                        value={formData.skills}
                        onChange={(e) => updateFormData({ skills: e.target.value })}
                        className="h-12 text-base"
                    />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        Nomor HP / WhatsApp <span className="text-muted-foreground text-sm">(opsional)</span>
                    </Label>
                    <Input
                        id="phoneNumber"
                        placeholder="Contoh: 081234567890"
                        value={formData.phoneNumber}
                        onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                        className="h-12 text-base"
                    />
                </div>

                <div className="border-t pt-6" />

                {/* Attach CV */}
                <div className="space-y-3">
                    <Label className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
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
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'}
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
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50'}
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

            {/* Generate Button */}
            <div className="flex justify-center">
                <Button
                    size="lg"
                    onClick={() => onGenerate(formData)}
                    disabled={!canGenerate || isGenerating}
                    className="px-8 py-6 text-lg gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Membuat Email...
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-5 w-5" />
                            Generate Email Inquiry
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export type { InquiryFormData };
