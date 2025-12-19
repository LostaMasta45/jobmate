"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Briefcase, Building2, UserCircle, Search, Phone, Heart, Calendar, ImagePlus, X, Loader2, CheckCircle, Sparkles, UploadCloud } from "lucide-react";
import type { EmailFormDataV2, JobPosterAnalysis } from "./EmailWizardV2";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const JOB_SOURCES = [
    { value: "linkedin", label: "LinkedIn" },
    { value: "jobstreet", label: "JobStreet" },
    { value: "glints", label: "Glints" },
    { value: "indeed", label: "Indeed" },
    { value: "kalibrr", label: "Kalibrr" },
    { value: "website", label: "Website Perusahaan" },
    { value: "referral", label: "Referral / Kenalan" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "career_fair", label: "Career Fair" },
    { value: "other", label: "Lainnya" },
];

const AVAILABILITY_OPTIONS = [
    { value: "immediately", label: "Segera / Langsung" },
    { value: "1_week", label: "1 Minggu" },
    { value: "2_weeks", label: "2 Minggu" },
    { value: "1_month", label: "1 Bulan" },
    { value: "negotiable", label: "Bisa dinegosiasi" },
];

interface StepBasicInfoProps {
    formData: EmailFormDataV2;
    updateFormData: (data: Partial<EmailFormDataV2>) => void;
}

export function StepBasicInfo({ formData, updateFormData }: StepBasicInfoProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("File harus berupa gambar");
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("Ukuran file maksimal 10MB");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result as string;
            setPreviewImage(base64);

            // Analyze the image
            setIsAnalyzing(true);
            try {
                const { analyzeJobPoster } = await import("@/actions/email/analyzeJobPoster");
                const result = await analyzeJobPoster(base64);

                if (result.error) {
                    toast.error("Gagal menganalisis poster: " + result.error);
                    return;
                }

                if (result.data) {
                    // Auto-fill form fields from analysis
                    const updates: Partial<EmailFormDataV2> = {
                        jobPosterAnalysis: result.data
                    };

                    // Auto-fill position if found
                    if (result.data.position && !formData.position) {
                        updates.position = result.data.position;
                    }

                    // Auto-fill company name if found
                    if (result.data.companyName && !formData.companyName) {
                        updates.companyName = result.data.companyName;
                    }

                    updateFormData(updates);
                    toast.success("Poster berhasil dianalisis! Informasi lowongan akan digunakan untuk generate email yang lebih sesuai.");
                }
            } catch (error) {
                toast.error("Terjadi kesalahan saat menganalisis poster");
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        updateFormData({ jobPosterAnalysis: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-8">
            {/* Job Poster Upload Section - Enhanced UI */}
            <div className="group relative overflow-hidden border-0 bg-gradient-to-br from-gmail-red-500/5 to-gmail-red-500/10 dark:from-gmail-red-900/10 dark:to-zinc-900 backdrop-blur-md rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gmail-red-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />

                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gmail-red-500/10 text-gmail-red-600">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground">Upload Poster Lowongan</h3>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-md">
                                Biarkan AI membaca detail lowongan dari gambar untuk hasil yang lebih akurat dan personal.
                            </p>
                        </div>
                        <div className="hidden sm:block">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-gmail-red-600 to-gmail-red-500 text-white text-xs font-bold shadow-lg shadow-gmail-red-500/20">
                                <Sparkles className="h-3 w-3" />
                                AI Powered
                            </span>
                        </div>
                    </div>

                    {!previewImage ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group/upload border-2 border-dashed border-gmail-red-200 dark:border-gmail-red-900/40 rounded-2xl p-8 text-center cursor-pointer hover:border-gmail-red-500 hover:bg-gmail-red-50/50 dark:hover:bg-gmail-red-900/20 transition-all duration-300"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center group-hover/upload:scale-110 group-hover/upload:shadow-lg transition-all duration-300">
                                <UploadCloud className="h-8 w-8 text-gmail-red-500" />
                            </div>
                            <h4 className="font-semibold text-foreground mb-1">Klik untuk upload gambar</h4>
                            <p className="text-xs text-muted-foreground">
                                JPG, PNG, atau screenshot (max 10MB)
                            </p>
                        </div>
                    ) : (
                        <div className="relative">
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                                    <Loader2 className="h-10 w-10 animate-spin text-gmail-red-500 mb-3" />
                                    <p className="font-semibold text-gmail-red-600">Menganalisis Poster...</p>
                                    <p className="text-xs text-muted-foreground">Mohon tunggu sebentar</p>
                                </div>
                            )}

                            <div className="relative rounded-2xl overflow-hidden border border-border shadow-md bg-zinc-100 dark:bg-zinc-900">
                                <img
                                    src={previewImage}
                                    alt="Job Poster Preview"
                                    className="w-full max-h-[300px] object-contain"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-3 right-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                                    onClick={handleRemoveImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.jobPosterAnalysis && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl"
                                >
                                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                                        <CheckCircle className="h-5 w-5" />
                                        <span className="font-semibold">Poster berhasil dianalisis!</span>
                                    </div>
                                    <div className="text-sm space-y-1.5 text-muted-foreground pl-7">
                                        {formData.jobPosterAnalysis.position && (
                                            <p>• Posisi: <span className="text-foreground font-medium">{formData.jobPosterAnalysis.position}</span></p>
                                        )}
                                        {formData.jobPosterAnalysis.companyName && (
                                            <p>• Perusahaan: <span className="text-foreground font-medium">{formData.jobPosterAnalysis.companyName}</span></p>
                                        )}
                                        {formData.jobPosterAnalysis.requirements && formData.jobPosterAnalysis.requirements.length > 0 && (
                                            <p>• Requirements: <span className="text-foreground italic">{formData.jobPosterAnalysis.requirements.length} poin terdeteksi</span></p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Form - Glassmorphism */}
            <Card className="p-6 sm:p-8 space-y-8 shadow-xl border-0 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2.5 col-span-2">
                        <Label htmlFor="fullName" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <User className="h-4 w-4 text-gmail-red-500" />
                            Nama Lengkap <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="fullName"
                            placeholder="Contoh: Dewi Anggraini"
                            value={formData.fullName}
                            onChange={(e) => updateFormData({ fullName: e.target.value })}
                            className="h-12 text-base rounded-xl border-muted-foreground/20 focus:border-gmail-red-500 focus:ring-gmail-red-500/20 bg-background/50"
                        />
                    </div>

                    {/* Position */}
                    <div className="space-y-2.5">
                        <Label htmlFor="position" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Briefcase className="h-4 w-4 text-gmail-red-500" />
                            Posisi yang Dilamar <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="position"
                                placeholder="Contoh: Marketing"
                                value={formData.position}
                                onChange={(e) => updateFormData({ position: e.target.value })}
                                className={`h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50 ${formData.jobPosterAnalysis?.position ? 'pr-24' : ''}`}
                            />
                            {formData.jobPosterAnalysis?.position && formData.position === formData.jobPosterAnalysis.position && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    <Sparkles className="h-3 w-3" />
                                    Auto-filled
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2.5">
                        <Label htmlFor="companyName" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Building2 className="h-4 w-4 text-gmail-red-500" />
                            Nama Perusahaan <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                            <Input
                                id="companyName"
                                placeholder="Contoh: PT Sukses Jaya"
                                value={formData.companyName}
                                onChange={(e) => updateFormData({ companyName: e.target.value })}
                                className="h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50"
                            />
                            {formData.jobPosterAnalysis?.companyName && formData.companyName === formData.jobPosterAnalysis.companyName && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                    <Sparkles className="h-3 w-3" />
                                    Auto-filled
                                </div>
                            )}
                        </div>
                    </div>

                    {/* HRD Name (Optional) */}
                    <div className="space-y-2.5">
                        <Label htmlFor="hrdName" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <UserCircle className="h-4 w-4 text-gmail-red-500" />
                            Nama HRD <span className="text-muted-foreground text-sm font-normal">(opsional)</span>
                        </Label>
                        <Input
                            id="hrdName"
                            placeholder="Contoh: Ibu Sarah"
                            value={formData.hrdName}
                            onChange={(e) => updateFormData({ hrdName: e.target.value })}
                            className="h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50"
                        />
                    </div>

                    {/* Job Source */}
                    <div className="space-y-2.5">
                        <Label htmlFor="jobSource" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Search className="h-4 w-4 text-gmail-red-500" />
                            Sumber Info Lowongan <span className="text-destructive">*</span>
                        </Label>
                        <Select
                            value={formData.jobSource}
                            onValueChange={(value) => updateFormData({ jobSource: value })}
                        >
                            <SelectTrigger className="h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50">
                                <SelectValue placeholder="Pilih sumber..." />
                            </SelectTrigger>
                            <SelectContent>
                                {JOB_SOURCES.map((source) => (
                                    <SelectItem key={source.value} value={source.value} className="text-base py-3">
                                        {source.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-muted-foreground font-medium rounded-full border">
                            Informasi Tambahan (Opsional)
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Number (Optional) */}
                    <div className="space-y-2.5">
                        <Label htmlFor="phoneNumber" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Phone className="h-4 w-4 text-gmail-red-500" />
                            No. HP / WhatsApp
                        </Label>
                        <Input
                            id="phoneNumber"
                            placeholder="Contoh: 081234567890"
                            value={formData.phoneNumber}
                            onChange={(e) => updateFormData({ phoneNumber: e.target.value })}
                            className="h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50"
                        />
                    </div>

                    {/* Availability (Optional) */}
                    <div className="space-y-2.5">
                        <Label htmlFor="availability" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Calendar className="h-4 w-4 text-gmail-red-500" />
                            Ketersediaan Mulai
                        </Label>
                        <Select
                            value={formData.availability}
                            onValueChange={(value) => updateFormData({ availability: value })}
                        >
                            <SelectTrigger className="h-12 text-base rounded-xl border-muted-foreground/20 bg-background/50">
                                <SelectValue placeholder="Kapan bisa mulai?" />
                            </SelectTrigger>
                            <SelectContent>
                                {AVAILABILITY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-base py-3">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reason for Interest (Optional) - Full Width */}
                    <div className="space-y-2.5 col-span-1 md:col-span-2">
                        <Label htmlFor="reasonForInterest" className="text-base font-medium flex items-center gap-2 text-foreground">
                            <Heart className="h-4 w-4 text-gmail-red-500" />
                            Kenapa Tertarik?
                        </Label>
                        <Textarea
                            id="reasonForInterest"
                            placeholder="Ceritakan sedikit alasanmu..."
                            value={formData.reasonForInterest}
                            onChange={(e) => updateFormData({ reasonForInterest: e.target.value })}
                            className="min-h-[100px] text-base rounded-xl border-muted-foreground/20 bg-background/50 resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            *Tips: Sebutkan hal spesifik yang kamu suka dari perusahaan ini.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
