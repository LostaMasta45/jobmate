"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type {
    WAApplicationFormData,
    WAGeneratedMessage,
    WAExperienceLevel,
    WAStrengthHighlight,
    WAWhyCompanyReason
} from "./types";
import {
    EXPERIENCE_LEVEL_LABELS,
    STRENGTH_LABELS,
    WHY_COMPANY_LABELS
} from "./types";
import { WAStepPreview } from "./WAStepPreview";
import { WALoadingOverlay } from "./WALoadingOverlay";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";

// Initial form data
const INITIAL_DATA: WAApplicationFormData = {
    yourName: '',
    position: '',
    companyName: '',
    hrdName: '',
    hrdPhone: '',
    toneStyle: 'semi-formal',
    personality: 'balanced',
    useEmoji: true,
    messageLength: 'medium',
    includeGreeting: true,
    includeCallToAction: true,
    jobSource: '',
    referralName: '',
    currentRole: '',
    yearsExperience: undefined,
    topSkills: [],
    specificReason: '',
    recentAchievement: '',
    attachmentMention: true,
    // New adaptive fields
    experienceLevel: undefined,
    strengthHighlights: [],
    whyCompanyReason: undefined,
    whyCompanyDetail: '',
    relevantProject: '',
    relevantOrganization: '',
};

const STEPS = [
    { id: 1, title: "Target", description: "Perusahaan & posisi yang dilamar" },
    { id: 2, title: "Profil", description: "Informasi tentang diri Anda" },
    { id: 3, title: "Preview", description: "Lihat & kirim pesan" },
];

interface WAWizardV2Props {
    userName?: string;
    onBack?: () => void;
}

export function WAWizardV2({ userName = '', onBack }: WAWizardV2Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WAApplicationFormData>({
        ...INITIAL_DATA,
        yourName: userName,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState<WAGeneratedMessage | null>(null);
    const [skillInput, setSkillInput] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    // Scroll to top when step changes
    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const updateFormData = (data: Partial<WAApplicationFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                return !!(formData.companyName && formData.position);
            case 2:
                return !!formData.yourName;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && canProceed()) {
            if (currentStep === 2) {
                // Generate message when moving to preview
                handleGenerate();
            }
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        } else {
            onBack?.();
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const result = await generateWhatsAppMessage({
                messageType: 'application',
                yourName: formData.yourName,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                jobSource: formData.jobSource,
                referralName: formData.referralName,
                currentRole: formData.currentRole,
                yearsExperience: formData.yearsExperience,
                topSkills: formData.topSkills,
                toneStyle: formData.toneStyle,
                personality: formData.personality,
                includeGreeting: formData.includeGreeting,
                includeIntro: true,
                includeCallToAction: formData.includeCallToAction,
                attachmentMention: formData.attachmentMention,
                specificReason: formData.whyCompanyDetail || formData.specificReason,
                recentAchievement: formData.recentAchievement,
                useEmoji: formData.useEmoji,
                messageLength: formData.messageLength,
                // New adaptive fields
                experienceLevel: formData.experienceLevel,
                strengthHighlights: formData.strengthHighlights,
                relevantProject: formData.relevantProject,
                relevantOrganization: formData.relevantOrganization,
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            setGeneratedMessage({
                content: result.content || '',
                wordCount: result.wordCount || 0,
                charCount: result.charCount || 0,
            });
            toast.success("Pesan berhasil di-generate! 🎉");
        } catch (error: any) {
            console.error('Generate error:', error);
            toast.error('Gagal generate pesan: ' + error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!generatedMessage) return;

        setIsSaving(true);
        try {
            const result = await saveWAMessage({
                messageType: 'application',
                content: generatedMessage.content,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                jobSource: formData.jobSource,
                referralName: formData.referralName,
                currentRole: formData.currentRole,
                yearsExperience: formData.yearsExperience,
                topSkills: formData.topSkills,
                specificReason: formData.specificReason,
                recentAchievement: formData.recentAchievement,
                toneStyle: formData.toneStyle,
                personality: formData.personality,
                messageLength: formData.messageLength,
                useEmoji: formData.useEmoji,
                includeGreeting: formData.includeGreeting,
                includeCallToAction: formData.includeCallToAction,
                attachmentMention: formData.attachmentMention,
                wordCount: generatedMessage.wordCount,
                charCount: generatedMessage.charCount,
                status: 'draft',
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success('Pesan berhasil disimpan! 💾');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error('Gagal menyimpan: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && (formData.topSkills?.length || 0) < 5) {
            updateFormData({
                topSkills: [...(formData.topSkills || []), skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (index: number) => {
        updateFormData({
            topSkills: formData.topSkills?.filter((_, i) => i !== index)
        });
    };

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Nama Perusahaan *</Label>
                                <Input
                                    id="companyName"
                                    value={formData.companyName}
                                    onChange={(e) => updateFormData({ companyName: e.target.value })}
                                    placeholder="Contoh: GoTo, Traveloka, Tokopedia"
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Posisi yang Dilamar *</Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => updateFormData({ position: e.target.value })}
                                    placeholder="Contoh: Product Manager, Software Engineer"
                                    className="h-12"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">Sumber Lowongan</Label>
                            <Select
                                value={formData.jobSource}
                                onValueChange={(value) => updateFormData({ jobSource: value })}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Pilih sumber info lowongan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                    <SelectItem value="JobStreet">JobStreet</SelectItem>
                                    <SelectItem value="Glints">Glints</SelectItem>
                                    <SelectItem value="Instagram">Instagram</SelectItem>
                                    <SelectItem value="Website">Website Perusahaan</SelectItem>
                                    <SelectItem value="Referral">Referral</SelectItem>
                                    <SelectItem value="Other">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>

                            {formData.jobSource === 'Referral' && (
                                <div className="space-y-2 animate-in fade-in">
                                    <Label htmlFor="referralName">Nama Pemberi Referral</Label>
                                    <Input
                                        id="referralName"
                                        value={formData.referralName}
                                        onChange={(e) => updateFormData({ referralName: e.target.value })}
                                        placeholder="Nama teman/koneksi"
                                        className="h-12"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <div className="flex items-center justify-between">
                                <Label className="text-base font-semibold">Info HRD (Opsional)</Label>
                                <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">Optional</span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="hrdName">Nama HRD</Label>
                                    <Input
                                        id="hrdName"
                                        value={formData.hrdName}
                                        onChange={(e) => updateFormData({ hrdName: e.target.value })}
                                        placeholder="Contoh: Ibu Sarah"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hrdPhone">Nomor WhatsApp</Label>
                                    <Input
                                        id="hrdPhone"
                                        value={formData.hrdPhone}
                                        onChange={(e) => {
                                            const cleaned = e.target.value.replace(/\D/g, '');
                                            updateFormData({ hrdPhone: cleaned });
                                        }}
                                        placeholder="0812..."
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Experience Level - NEW */}
                        <div className="space-y-4">
                            <Label className="text-base font-semibold">Level Pengalaman</Label>
                            <Select
                                value={formData.experienceLevel}
                                onValueChange={(value: WAExperienceLevel) => updateFormData({ experienceLevel: value })}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Pilih level pengalaman kamu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(EXPERIENCE_LEVEL_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Strength Highlights for Fresh Grads - NEW */}
                        {(formData.experienceLevel === 'fresh_graduate' || formData.experienceLevel === 'student' || formData.experienceLevel === 'first_job') && (
                            <div className="space-y-3 pt-4 border-t border-dashed animate-in fade-in">
                                <Label className="text-base font-semibold">Kelebihan Kamu ✨</Label>
                                <p className="text-sm text-muted-foreground">Pilih yang sesuai untuk highlight di pesan</p>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(STRENGTH_LABELS).map(([key, label]) => {
                                        const isSelected = formData.strengthHighlights?.includes(key as WAStrengthHighlight);
                                        return (
                                            <Badge
                                                key={key}
                                                variant={isSelected ? "default" : "outline"}
                                                className={cn(
                                                    "cursor-pointer py-2 px-3 transition-all",
                                                    isSelected && "bg-green-600 hover:bg-green-700"
                                                )}
                                                onClick={() => {
                                                    const current = formData.strengthHighlights || [];
                                                    if (isSelected) {
                                                        updateFormData({
                                                            strengthHighlights: current.filter(s => s !== key) as WAStrengthHighlight[]
                                                        });
                                                    } else if (current.length < 3) {
                                                        updateFormData({
                                                            strengthHighlights: [...current, key as WAStrengthHighlight]
                                                        });
                                                    }
                                                }}
                                            >
                                                {label}
                                            </Badge>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-muted-foreground">Pilih max 3</p>
                            </div>
                        )}

                        {/* Relevant Project/Org for Fresh Grads - NEW */}
                        {(formData.experienceLevel === 'fresh_graduate' || formData.experienceLevel === 'student') && (
                            <div className="space-y-4 pt-4 border-t border-dashed animate-in fade-in">
                                <Label className="text-base font-semibold">Pengalaman Relevan</Label>
                                <div className="space-y-2">
                                    <Label htmlFor="relevantProject">Project/Tugas Akhir</Label>
                                    <Input
                                        id="relevantProject"
                                        value={formData.relevantProject}
                                        onChange={(e) => updateFormData({ relevantProject: e.target.value })}
                                        placeholder="Contoh: Develop e-commerce app dengan React"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relevantOrganization">Organisasi/Kepanitiaan</Label>
                                    <Input
                                        id="relevantOrganization"
                                        value={formData.relevantOrganization}
                                        onChange={(e) => updateFormData({ relevantOrganization: e.target.value })}
                                        placeholder="Contoh: Ketua Divisi IT di BEM"
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Basic Info */}
                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <div className="space-y-2">
                                <Label htmlFor="yourName">Nama Lengkap *</Label>
                                <Input
                                    id="yourName"
                                    value={formData.yourName}
                                    onChange={(e) => updateFormData({ yourName: e.target.value })}
                                    placeholder="Nama sesuai CV"
                                    className="h-12"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="currentRole">Posisi Saat Ini</Label>
                                    <Input
                                        id="currentRole"
                                        value={formData.currentRole}
                                        onChange={(e) => updateFormData({ currentRole: e.target.value })}
                                        placeholder="Contoh: Fresh Graduate"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="yearsExperience">Pengalaman (Tahun)</Label>
                                    <Input
                                        id="yearsExperience"
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={formData.yearsExperience || ''}
                                        onChange={(e) => updateFormData({ yearsExperience: parseInt(e.target.value) || undefined })}
                                        placeholder="0"
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-dashed">
                            <div className="flex items-center justify-between">
                                <Label>Top Skills (Max 5)</Label>
                                <span className="text-xs text-muted-foreground">{formData.topSkills?.length || 0}/5</span>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    placeholder="Ketik skill lalu Enter..."
                                    disabled={(formData.topSkills?.length || 0) >= 5}
                                    className="h-12"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddSkill}
                                    disabled={(formData.topSkills?.length || 0) >= 5}
                                    className="h-12 px-6"
                                >
                                    Tambah
                                </Button>
                            </div>
                            {formData.topSkills && formData.topSkills.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {formData.topSkills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="pl-3 pr-1 py-1.5 text-sm cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            onClick={() => handleRemoveSkill(index)}
                                        >
                                            {skill} ✕
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Why This Company - Enhanced */}
                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">Kenapa Tertarik?</Label>
                            <Select
                                value={formData.whyCompanyReason}
                                onValueChange={(value: WAWhyCompanyReason) => updateFormData({ whyCompanyReason: value })}
                            >
                                <SelectTrigger className="h-12">
                                    <SelectValue placeholder="Pilih alasan utama" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(WHY_COMPANY_LABELS).map(([key, label]) => (
                                        <SelectItem key={key} value={key}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formData.whyCompanyReason && (
                                <div className="space-y-2 animate-in fade-in">
                                    <Label htmlFor="whyCompanyDetail">Detail (opsional)</Label>
                                    <Textarea
                                        id="whyCompanyDetail"
                                        value={formData.whyCompanyDetail}
                                        onChange={(e) => updateFormData({ whyCompanyDetail: e.target.value })}
                                        placeholder="Jelaskan lebih spesifik..."
                                        className="min-h-[80px] resize-none"
                                    />
                                </div>
                            )}

                            {/* Achievement for experienced - only show for experienced levels */}
                            {(formData.experienceLevel === '1_2_years' || formData.experienceLevel === '3_5_years' || formData.experienceLevel === '5_plus_years') && (
                                <div className="space-y-2 animate-in fade-in">
                                    <Label htmlFor="recentAchievement">Achievement Terbaru</Label>
                                    <Textarea
                                        id="recentAchievement"
                                        value={formData.recentAchievement}
                                        onChange={(e) => updateFormData({ recentAchievement: e.target.value })}
                                        placeholder="Pencapaian terbaik Anda yang relevan dengan posisi"
                                        className="min-h-[80px] resize-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">Style & Preferensi</Label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Tone Pesan</Label>
                                    <Select
                                        value={formData.toneStyle}
                                        onValueChange={(value: any) => updateFormData({ toneStyle: value })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="semi-formal">Semi-Formal (Recommended)</SelectItem>
                                            <SelectItem value="friendly">Friendly</SelectItem>
                                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Panjang Pesan</Label>
                                    <Select
                                        value={formData.messageLength}
                                        onValueChange={(value: any) => updateFormData({ messageLength: value })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="short">Pendek (50-80 kata)</SelectItem>
                                            <SelectItem value="medium">Sedang (80-120 kata)</SelectItem>
                                            <SelectItem value="long">Panjang (120-150 kata)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-sm">Gunakan Emoji</div>
                                        <div className="text-xs text-muted-foreground">🙏 ✨ 📄</div>
                                    </div>
                                    <Switch
                                        checked={formData.useEmoji}
                                        onCheckedChange={(checked) => updateFormData({ useEmoji: checked })}
                                    />
                                </Card>
                                <Card className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-sm">Mention Lampiran</div>
                                        <div className="text-xs text-muted-foreground">CV/Portfolio</div>
                                    </div>
                                    <Switch
                                        checked={formData.attachmentMention}
                                        onCheckedChange={(checked) => updateFormData({ attachmentMention: checked })}
                                    />
                                </Card>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <WAStepPreview
                            message={generatedMessage}
                            hrdPhone={formData.hrdPhone}
                            hrdName={formData.hrdName}
                            messageType="application"
                            onSave={handleSave}
                            onRegenerate={handleGenerate}
                            isSaving={isSaving}
                            isGenerating={isGenerating}
                            onMessageChange={(content) => {
                                if (generatedMessage) {
                                    setGeneratedMessage({
                                        ...generatedMessage,
                                        content,
                                        charCount: content.replace(/\s/g, '').length,
                                        wordCount: content.trim().split(/\s+/).length,
                                    });
                                }
                            }}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
            {/* Loading Overlay */}
            <WALoadingOverlay isLoading={isGenerating} messageType="application" />

            {/* Header - Fixed */}
            <div className="flex-shrink-0 z-20 bg-background border-b">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handlePrev}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">Pesan Lamaran</h1>
                            <p className="text-sm text-muted-foreground">
                                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                            </p>
                        </div>
                        {/* Progress */}
                        <div className="flex gap-1">
                            {STEPS.map((step) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "h-2 w-8 rounded-full transition-colors",
                                        currentStep >= step.id ? "bg-green-500" : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer - Fixed */}
            {currentStep < 3 && (
                <div className="flex-shrink-0 z-20 bg-background border-t">
                    <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            className={cn(currentStep === 1 && "invisible")}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Kembali
                        </Button>

                        <Button
                            onClick={handleNext}
                            disabled={!canProceed() || isGenerating}
                            className="bg-green-600 hover:bg-green-700 text-white px-8"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : currentStep === 2 ? (
                                <>
                                    <Sparkles className="h-4 w-4 mr-2" />
                                    Generate Pesan
                                </>
                            ) : (
                                <>
                                    Lanjut
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
