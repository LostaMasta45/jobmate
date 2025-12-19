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

import type { WAReApplicationFormData, WAGeneratedMessage } from "./types";
import { WAStepPreview } from "./WAStepPreview";
import { WALoadingOverlay } from "./WALoadingOverlay";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";

const INITIAL_DATA: WAReApplicationFormData = {
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
    previousApplicationDate: '',
    previousContext: '',
    newSkills: [],
    newAchievements: '',
    whyNow: '',
};

const STEPS = [
    { id: 1, title: "Context", description: "Lamaran sebelumnya" },
    { id: 2, title: "What's New", description: "Skill & achievement baru" },
    { id: 3, title: "Preview", description: "Lihat & kirim" },
];

interface WAFormReApplicationProps {
    userName?: string;
    onBack?: () => void;
}

export function WAFormReApplication({ userName = '', onBack }: WAFormReApplicationProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<WAReApplicationFormData>({
        ...INITIAL_DATA,
        yourName: userName,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState<WAGeneratedMessage | null>(null);
    const [skillInput, setSkillInput] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    const updateFormData = (data: Partial<WAReApplicationFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canProceed = (): boolean => {
        switch (currentStep) {
            case 1:
                return !!(formData.yourName && formData.companyName && formData.position);
            case 2:
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && canProceed()) {
            if (currentStep === 2) {
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
                messageType: 're_application',
                yourName: formData.yourName,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                previousInteraction: formData.previousApplicationDate
                    ? `Previously applied: ${formData.previousApplicationDate}. ${formData.previousContext || ''}`
                    : formData.previousContext,
                topSkills: formData.newSkills,
                recentAchievement: formData.newAchievements,
                specificReason: formData.whyNow,
                toneStyle: formData.toneStyle,
                personality: formData.personality,
                includeGreeting: formData.includeGreeting,
                includeIntro: true,
                includeCallToAction: formData.includeCallToAction,
                attachmentMention: true,
                useEmoji: formData.useEmoji,
                messageLength: formData.messageLength,
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
                messageType: 're_application',
                content: generatedMessage.content,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                previousInteraction: formData.previousContext,
                topSkills: formData.newSkills,
                recentAchievement: formData.newAchievements,
                specificReason: formData.whyNow,
                toneStyle: formData.toneStyle,
                personality: formData.personality,
                messageLength: formData.messageLength,
                useEmoji: formData.useEmoji,
                includeGreeting: formData.includeGreeting,
                includeCallToAction: formData.includeCallToAction,
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
        if (skillInput.trim() && (formData.newSkills?.length || 0) < 5) {
            updateFormData({
                newSkills: [...(formData.newSkills || []), skillInput.trim()]
            });
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (index: number) => {
        updateFormData({
            newSkills: formData.newSkills?.filter((_, i) => i !== index)
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="yourName">Nama Lengkap *</Label>
                                <Input
                                    id="yourName"
                                    value={formData.yourName}
                                    onChange={(e) => updateFormData({ yourName: e.target.value })}
                                    placeholder="Nama Anda"
                                    className="h-12"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Nama Perusahaan *</Label>
                                    <Input
                                        id="companyName"
                                        value={formData.companyName}
                                        onChange={(e) => updateFormData({ companyName: e.target.value })}
                                        placeholder="Perusahaan target"
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position">Posisi *</Label>
                                    <Input
                                        id="position"
                                        value={formData.position}
                                        onChange={(e) => updateFormData({ position: e.target.value })}
                                        placeholder="Posisi yang dilamar"
                                        className="h-12"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">Context Lamaran Sebelumnya</Label>
                            <div className="space-y-2">
                                <Label htmlFor="previousApplicationDate">Kapan Pernah Melamar?</Label>
                                <Input
                                    id="previousApplicationDate"
                                    type="month"
                                    value={formData.previousApplicationDate}
                                    onChange={(e) => updateFormData({ previousApplicationDate: e.target.value })}
                                    className="h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="previousContext">Detail Proses Sebelumnya (Opsional)</Label>
                                <Textarea
                                    id="previousContext"
                                    value={formData.previousContext}
                                    onChange={(e) => updateFormData({ previousContext: e.target.value })}
                                    placeholder="Contoh: Sampai tahap interview user tapi belum lolos"
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">Info HRD (Opsional)</Label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="hrdName">Nama HRD</Label>
                                    <Input
                                        id="hrdName"
                                        value={formData.hrdName}
                                        onChange={(e) => updateFormData({ hrdName: e.target.value })}
                                        placeholder="Pak/Bu..."
                                        className="h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hrdPhone">Nomor WhatsApp</Label>
                                    <Input
                                        id="hrdPhone"
                                        value={formData.hrdPhone}
                                        onChange={(e) => updateFormData({ hrdPhone: e.target.value.replace(/\D/g, '') })}
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
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Skill Baru (Max 5)</Label>
                                    <span className="text-xs text-muted-foreground">{formData.newSkills?.length || 0}/5</span>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                        placeholder="Skill baru yang didapat"
                                        disabled={(formData.newSkills?.length || 0) >= 5}
                                        className="h-12"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddSkill}
                                        disabled={(formData.newSkills?.length || 0) >= 5}
                                        className="h-12 px-6"
                                    >
                                        Tambah
                                    </Button>
                                </div>
                                {formData.newSkills && formData.newSkills.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.newSkills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="pl-3 pr-1 py-1.5 text-sm cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleRemoveSkill(index)}
                                            >
                                                {skill} ✕
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <Label className="text-base font-semibold">What's New?</Label>
                            <div className="space-y-2">
                                <Label htmlFor="newAchievements">Achievement/Pengalaman Baru</Label>
                                <Textarea
                                    id="newAchievements"
                                    value={formData.newAchievements}
                                    onChange={(e) => updateFormData({ newAchievements: e.target.value })}
                                    placeholder="Contoh: Dapat sertifikasi Google Analytics, lead project dengan hasil +30% growth"
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="whyNow">Kenapa Apply Ulang Sekarang?</Label>
                                <Textarea
                                    id="whyNow"
                                    value={formData.whyNow}
                                    onChange={(e) => updateFormData({ whyNow: e.target.value })}
                                    placeholder="Contoh: Sudah lebih matang dengan pengalaman 1 tahun di bidang serupa"
                                    className="min-h-[100px] resize-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-dashed">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Tone</Label>
                                    <Select value={formData.toneStyle} onValueChange={(v: any) => updateFormData({ toneStyle: v })}>
                                        <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                                            <SelectItem value="friendly">Friendly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Card className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-sm">Gunakan Emoji</div>
                                    </div>
                                    <Switch checked={formData.useEmoji} onCheckedChange={(c) => updateFormData({ useEmoji: c })} />
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
                            messageType="re_application"
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
            <WALoadingOverlay isLoading={isGenerating} messageType="re_application" />

            {/* Header */}
            <div className="flex-shrink-0 z-20 bg-background border-b">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handlePrev}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">Apply Ulang</h1>
                            <p className="text-sm text-muted-foreground">
                                Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            {STEPS.map((step) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "h-2 w-8 rounded-full transition-colors",
                                        currentStep >= step.id ? "bg-teal-500" : "bg-muted"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            {currentStep < 3 && (
                <div className="flex-shrink-0 z-20 bg-background border-t">
                    <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
                        <Button variant="ghost" onClick={handlePrev} className={cn(currentStep === 1 && "invisible")}>
                            <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed() || isGenerating}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                        >
                            {isGenerating ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                            ) : currentStep === 2 ? (
                                <><Sparkles className="h-4 w-4 mr-2" /> Generate Pesan</>
                            ) : (
                                <>Lanjut <ArrowRight className="h-4 w-4 ml-2" /></>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
