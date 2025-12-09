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
    Phone, MessageSquare, Loader2, Sparkles
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
}

export function FollowUpForm({ userName, onGenerate, isGenerating }: FollowUpFormProps) {
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <AnimatePresence>
                <LoadingOverlay isVisible={isGenerating} type="follow_up" />
            </AnimatePresence>

            {/* Main Form */}
            <Card className="p-6 sm:p-8 space-y-8 shadow-xl border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl relative overflow-hidden">
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-heart-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-heliotrope-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative space-y-6">
                    {/* Header Section */}
                    <div className="space-y-2 text-center sm:text-left">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-heart-600 to-heliotrope-600">
                            Follow Up Lamaran
                        </h2>
                        <p className="text-muted-foreground">
                            Kirim email pengingat secara profesional tanpa terkesan memaksa.
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

                        {/* HRD Name */}
                        <div className="space-y-2">
                            <Label htmlFor="hrdName" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                                <UserCircle className="h-4 w-4 text-purple-heart-500" />
                                Nama HRD / Interviewer <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                            </Label>
                            <Input
                                id="hrdName"
                                placeholder="Contoh: Ibu Sarah"
                                value={formData.hrdName}
                                onChange={(e) => updateFormData({ hrdName: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

                    {/* Last Stage */}
                    <div className="space-y-3">
                        <Label className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-heart-500" />
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
                                            ? 'border-purple-heart-500 bg-purple-heart-50 dark:bg-purple-heart-900/20'
                                            : 'border-muted hover:border-purple-heart-200 bg-background/50'}
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
                                <Calendar className="h-4 w-4 text-purple-heart-500" />
                                Tanggal Terakhir Interaksi <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="lastInteractionDate"
                                    type="date"
                                    value={formData.lastInteractionDate}
                                    onChange={(e) => updateFormData({ lastInteractionDate: e.target.value })}
                                    className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all block w-full"
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
                                <Phone className="h-4 w-4 text-purple-heart-500" />
                                Nomor HP / WA <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                            </Label>
                            <Input
                                id="phoneNumber"
                                placeholder="08123456789 (untuk dicantumkan di email)"
                                value={formData.phoneNumber}
                                onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                                className="h-12 text-base bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Promised Follow Up */}
                    <div className="space-y-2">
                        <Label htmlFor="promisedFollowUp" className="text-base font-semibold text-foreground/80 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-heart-500" />
                            Apa yang Dijanjikan HRD? <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                        </Label>
                        <Textarea
                            id="promisedFollowUp"
                            placeholder="Contoh: HRD bilang akan mengabari dalam 1 minggu, atau proses rekrutmen akan memakan waktu 2 minggu."
                            value={formData.promisedFollowUp}
                            onChange={(e) => updateFormData({ promisedFollowUp: e.target.value })}
                            className="min-h-[80px] text-base resize-none bg-background/50 border-purple-heart-100 focus:border-purple-heart-500 focus:ring-purple-heart-500/20 transition-all"
                        />
                    </div>

                    <div className="border-t border-purple-heart-100 dark:border-white/10 pt-4" />

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
                <Card className="p-4 bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <span><strong>Tips:</strong> Email follow-up sebaiknya dikirim <strong>1-2 minggu</strong> setelah melamar atau setelah interview jika belum ada kabar. Jangan kirim terlalu sering (spam).</span>
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
                            Buat Email Follow-up
                        </>
                    )}
                </Button>
            </div>
        </motion.div>
    );
}

export type { FollowUpFormData };
