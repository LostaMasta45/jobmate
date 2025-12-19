"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
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

import type { WAReferralFormData, WAGeneratedMessage } from "./types";
import { WAStepPreview } from "./WAStepPreview";
import { WALoadingOverlay } from "./WALoadingOverlay";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";

const INITIAL_DATA: WAReferralFormData = {
    yourName: '',
    position: '',
    companyName: '',
    hrdName: '',
    hrdPhone: '',
    toneStyle: 'friendly',
    personality: 'balanced',
    useEmoji: true,
    messageLength: 'medium',
    includeGreeting: true,
    includeCallToAction: true,
    referrerName: '',
    referrerRelation: '',
    referrerContext: '',
    currentRole: '',
    topSkills: [],
};

interface WAFormReferralProps {
    userName?: string;
    onBack?: () => void;
}

export function WAFormReferral({ userName = '', onBack }: WAFormReferralProps) {
    const [formData, setFormData] = useState<WAReferralFormData>({
        ...INITIAL_DATA,
        yourName: userName,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState<WAGeneratedMessage | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [showPreview]);

    const updateFormData = (data: Partial<WAReferralFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = (): boolean => {
        return !!(formData.yourName && formData.referrerName);
    };

    const handleGenerate = async () => {
        if (!canGenerate()) {
            toast.error('Lengkapi field yang wajib diisi');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateWhatsAppMessage({
                messageType: 'referral',
                yourName: formData.yourName,
                position: formData.position || 'posisi yang sesuai',
                companyName: formData.companyName || 'perusahaan Anda',
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                referralName: formData.referrerName,
                previousInteraction: formData.referrerContext,
                currentRole: formData.currentRole,
                topSkills: formData.topSkills,
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
            setShowPreview(true);
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
                messageType: 'referral',
                content: generatedMessage.content,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                referralName: formData.referrerName,
                currentRole: formData.currentRole,
                topSkills: formData.topSkills,
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

    const handleBack = () => {
        if (showPreview) {
            setShowPreview(false);
        } else {
            onBack?.();
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
            <WALoadingOverlay isLoading={isGenerating} messageType="referral" />

            {/* Header */}
            <div className="flex-shrink-0 z-20 bg-background border-b">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">Minta Referral</h1>
                            <p className="text-sm text-muted-foreground">
                                {showPreview ? "Preview & Kirim" : "Isi info referrer dan diri Anda"}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <div className={cn("h-2 w-8 rounded-full", "bg-indigo-500")} />
                            <div className={cn("h-2 w-8 rounded-full", showPreview ? "bg-indigo-500" : "bg-muted")} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        {showPreview ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <WAStepPreview
                                    message={generatedMessage}
                                    hrdPhone={formData.hrdPhone}
                                    hrdName={formData.referrerName}
                                    messageType="referral"
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Your Info */}
                                <div className="space-y-4">
                                    <Label className="text-base font-semibold">Info Anda</Label>
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
                                    <div className="space-y-2">
                                        <Label htmlFor="currentRole">Posisi Saat Ini</Label>
                                        <Input
                                            id="currentRole"
                                            value={formData.currentRole}
                                            onChange={(e) => updateFormData({ currentRole: e.target.value })}
                                            placeholder="Contoh: Junior Developer"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Top Skills (Max 5)</Label>
                                            <span className="text-xs text-muted-foreground">{formData.topSkills?.length || 0}/5</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                                placeholder="Ketik skill..."
                                                disabled={(formData.topSkills?.length || 0) >= 5}
                                                className="h-12"
                                            />
                                            <Button type="button" onClick={handleAddSkill} disabled={(formData.topSkills?.length || 0) >= 5} className="h-12">
                                                Tambah
                                            </Button>
                                        </div>
                                        {formData.topSkills && formData.topSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.topSkills.map((skill, index) => (
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

                                {/* Referrer Info */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Label className="text-base font-semibold">Koneksi/Referrer</Label>
                                    <div className="space-y-2">
                                        <Label htmlFor="referrerName">Nama Koneksi *</Label>
                                        <Input
                                            id="referrerName"
                                            value={formData.referrerName}
                                            onChange={(e) => updateFormData({ referrerName: e.target.value })}
                                            placeholder="Nama orang yang dihubungi"
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="referrerRelation">Hubungan</Label>
                                        <Select value={formData.referrerRelation} onValueChange={(v) => updateFormData({ referrerRelation: v })}>
                                            <SelectTrigger className="h-12"><SelectValue placeholder="Pilih hubungan" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="alumni">Alumni Kampus</SelectItem>
                                                <SelectItem value="excolleague">Ex-Colleague</SelectItem>
                                                <SelectItem value="linkedin">Koneksi LinkedIn</SelectItem>
                                                <SelectItem value="friend">Teman</SelectItem>
                                                <SelectItem value="mentor">Mentor</SelectItem>
                                                <SelectItem value="other">Lainnya</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hrdPhone">Nomor WhatsApp Koneksi</Label>
                                        <Input
                                            id="hrdPhone"
                                            value={formData.hrdPhone}
                                            onChange={(e) => updateFormData({ hrdPhone: e.target.value.replace(/\D/g, '') })}
                                            placeholder="0812..."
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="referrerContext">Context Perkenalan (Opsional)</Label>
                                        <Textarea
                                            id="referrerContext"
                                            value={formData.referrerContext}
                                            onChange={(e) => updateFormData({ referrerContext: e.target.value })}
                                            placeholder="Contoh: Kenal dari seminar tech di UI tahun lalu"
                                            className="min-h-[80px] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Target (Optional) */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Label className="text-base font-semibold">Target (Opsional)</Label>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Perusahaan Target</Label>
                                            <Input
                                                id="companyName"
                                                value={formData.companyName}
                                                onChange={(e) => updateFormData({ companyName: e.target.value })}
                                                placeholder="Perusahaan yang diminati"
                                                className="h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="position">Posisi Target</Label>
                                            <Input
                                                id="position"
                                                value={formData.position}
                                                onChange={(e) => updateFormData({ position: e.target.value })}
                                                placeholder="Posisi yang diminati"
                                                className="h-12"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Card className="p-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Gunakan Emoji</div>
                                            <div className="text-xs text-muted-foreground">😊 🙏</div>
                                        </div>
                                        <Switch checked={formData.useEmoji} onCheckedChange={(c) => updateFormData({ useEmoji: c })} />
                                    </Card>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer */}
            {!showPreview && (
                <div className="flex-shrink-0 z-20 bg-background border-t">
                    <div className="max-w-2xl mx-auto px-4 py-4">
                        <Button
                            onClick={handleGenerate}
                            disabled={!canGenerate() || isGenerating}
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isGenerating ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                            ) : (
                                <><Sparkles className="h-4 w-4 mr-2" /> Generate Pesan Referral</>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
