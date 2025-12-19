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
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import type { WAFollowUpFormData, WAGeneratedMessage } from "./types";
import { WAStepPreview } from "./WAStepPreview";
import { WALoadingOverlay } from "./WALoadingOverlay";
import { generateWhatsAppMessage } from "@/actions/whatsapp/generate";
import { saveWAMessage } from "@/actions/whatsapp/save";

const INITIAL_DATA: WAFollowUpFormData = {
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
    applicationDate: '',
    previousInteraction: '',
    newUpdate: '',
};

interface WAFormFollowUpProps {
    userName?: string;
    onBack?: () => void;
}

export function WAFormFollowUp({ userName = '', onBack }: WAFormFollowUpProps) {
    const [formData, setFormData] = useState<WAFollowUpFormData>({
        ...INITIAL_DATA,
        yourName: userName,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState<WAGeneratedMessage | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, [showPreview]);

    const updateFormData = (data: Partial<WAFollowUpFormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const canGenerate = (): boolean => {
        return !!(formData.yourName && formData.companyName && formData.position);
    };

    const handleGenerate = async () => {
        if (!canGenerate()) {
            toast.error('Lengkapi field yang wajib diisi');
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateWhatsAppMessage({
                messageType: 'follow_up',
                yourName: formData.yourName,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                previousInteraction: formData.applicationDate
                    ? `Applied on ${formData.applicationDate}. ${formData.previousInteraction || ''}`
                    : formData.previousInteraction,
                toneStyle: formData.toneStyle,
                personality: formData.personality,
                includeGreeting: formData.includeGreeting,
                includeIntro: true,
                includeCallToAction: formData.includeCallToAction,
                attachmentMention: false,
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
                messageType: 'follow_up',
                content: generatedMessage.content,
                position: formData.position,
                companyName: formData.companyName,
                hrdName: formData.hrdName,
                hrdPhone: formData.hrdPhone,
                previousInteraction: formData.previousInteraction,
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

    const handleBack = () => {
        if (showPreview) {
            setShowPreview(false);
        } else {
            onBack?.();
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-background">
            <WALoadingOverlay isLoading={isGenerating} messageType="follow_up" />

            {/* Header */}
            <div className="flex-shrink-0 z-20 bg-background border-b">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold">Pesan Follow Up</h1>
                            <p className="text-sm text-muted-foreground">
                                {showPreview ? "Preview & Kirim" : "Isi detail lamaran sebelumnya"}
                            </p>
                        </div>
                        <div className="flex gap-1">
                            <div className={cn("h-2 w-8 rounded-full", showPreview ? "bg-green-500" : "bg-green-500")} />
                            <div className={cn("h-2 w-8 rounded-full", showPreview ? "bg-green-500" : "bg-muted")} />
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
                                    hrdName={formData.hrdName}
                                    messageType="follow_up"
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
                                {/* Basic Info */}
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
                                                placeholder="Perusahaan yang dilamar"
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

                                {/* Context */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Label className="text-base font-semibold">Context Follow Up</Label>
                                    <div className="space-y-2">
                                        <Label htmlFor="applicationDate">Tanggal Lamaran</Label>
                                        <Input
                                            id="applicationDate"
                                            type="date"
                                            value={formData.applicationDate}
                                            onChange={(e) => updateFormData({ applicationDate: e.target.value })}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="previousInteraction">Interaksi Sebelumnya (Opsional)</Label>
                                        <Textarea
                                            id="previousInteraction"
                                            value={formData.previousInteraction}
                                            onChange={(e) => updateFormData({ previousInteraction: e.target.value })}
                                            placeholder="Contoh: Sudah kirim email lamaran minggu lalu"
                                            className="min-h-[80px] resize-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="newUpdate">Update Baru (Opsional)</Label>
                                        <Textarea
                                            id="newUpdate"
                                            value={formData.newUpdate}
                                            onChange={(e) => updateFormData({ newUpdate: e.target.value })}
                                            placeholder="Contoh: Baru saja dapat sertifikasi yang relevan"
                                            className="min-h-[80px] resize-none"
                                        />
                                    </div>
                                </div>

                                {/* HRD Info */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Label className="text-base font-semibold">Info HRD (Opsional)</Label>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="hrdName">Nama HRD</Label>
                                            <Input
                                                id="hrdName"
                                                value={formData.hrdName}
                                                onChange={(e) => updateFormData({ hrdName: e.target.value })}
                                                placeholder="Ibu/Bapak..."
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

                                {/* Preferences */}
                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <Label className="text-base font-semibold">Preferensi</Label>
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
                                        <div className="space-y-2">
                                            <Label>Panjang</Label>
                                            <Select value={formData.messageLength} onValueChange={(v: any) => updateFormData({ messageLength: v })}>
                                                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="short">Pendek</SelectItem>
                                                    <SelectItem value="medium">Sedang</SelectItem>
                                                    <SelectItem value="long">Panjang</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <Card className="p-4 flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Gunakan Emoji</div>
                                            <div className="text-xs text-muted-foreground">🙏 ✨</div>
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
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isGenerating ? (
                                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                            ) : (
                                <><Sparkles className="h-4 w-4 mr-2" /> Generate Pesan Follow Up</>
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
