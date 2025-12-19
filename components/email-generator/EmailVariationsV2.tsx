"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2,
    Sparkles,
    Copy,
    Check,
    ArrowRight,
    RefreshCw,
    Info
} from "lucide-react";
import { toast } from "sonner";
import { getVariationsByType, type EmailType, type EmailVariationV2 } from "@/lib/emailVariationsV2";

interface EmailVariationsV2Props {
    formData: Record<string, any>;
    onSelectVariation: (subject: string, body: string) => void;
    emailType?: EmailType;
}

export function EmailVariationsV2({
    formData,
    onSelectVariation,
    emailType = 'application'
}: EmailVariationsV2Props) {
    // Get variations based on email type
    const VARIATION_TYPES = getVariationsByType(emailType);

    const [variations, setVariations] = useState<EmailVariationV2[]>(
        VARIATION_TYPES.map(v => ({ ...v }))
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatingId, setGeneratingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(VARIATION_TYPES[0].id);

    // Reset variations when email type changes
    useEffect(() => {
        const newTypes = getVariationsByType(emailType);
        setVariations(newTypes.map(v => ({ ...v })));
        setActiveTab(newTypes[0].id);
    }, [emailType]);

    const handleGenerateAll = async () => {
        setIsGenerating(true);

        try {
            const { generateAllVariationsV2 } = await import("@/actions/email/generateVariationsV2");
            const results = await generateAllVariationsV2(formData, emailType);
            setVariations(results);
            toast.success("3 variasi email berhasil dibuat!");
        } catch (error) {
            toast.error("Gagal generate variasi");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateSingle = async (variationId: string) => {
        setGeneratingId(variationId);

        try {
            const { generateEmailVariationV2 } = await import("@/actions/email/generateVariationsV2");
            const result = await generateEmailVariationV2(formData, variationId, emailType);

            setVariations(prev => prev.map(v => {
                if (v.id === variationId) {
                    if ('error' in result) {
                        return { ...v, error: result.error, body: undefined, subject: undefined };
                    }
                    return { ...v, subject: result.subject, body: result.body, error: undefined };
                }
                return v;
            }));

            const variation = VARIATION_TYPES.find(v => v.id === variationId);
            toast.success(`Variasi "${variation?.name}" berhasil dibuat!`);
        } catch (error) {
            toast.error("Gagal generate variasi");
        } finally {
            setGeneratingId(null);
        }
    };

    const handleCopy = async (variation: EmailVariationV2) => {
        if (!variation.body) return;

        const fullEmail = `Subject: ${variation.subject}\n\n${variation.body}`;
        await navigator.clipboard.writeText(fullEmail);
        setCopiedId(variation.id);
        setTimeout(() => setCopiedId(null), 2000);
        toast.success("Email dicopy ke clipboard!");
    };

    const handleUseVariation = (variation: EmailVariationV2) => {
        if (!variation.subject || !variation.body) return;
        onSelectVariation(variation.subject, variation.body);
        toast.success(`Menggunakan variasi "${variation.name}"`);
    };

    const hasAnyVariation = variations.some(v => v.body);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-heart-50/80 via-white/60 to-heliotrope-50/80 dark:from-purple-950/40 dark:via-black/40 dark:to-indigo-950/40 backdrop-blur-xl rounded-2xl">
                {/* Header */}
                <div className="p-4 sm:p-5 border-b border-purple-heart-100/50 dark:border-purple-800/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-heart-500 to-heliotrope-500 text-white shadow-lg shadow-purple-heart-500/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">3 Variasi Email</h3>
                                <p className="text-sm text-muted-foreground">Pilih gaya yang cocok untuk perusahaan target</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerateAll}
                            disabled={isGenerating}
                            className="gap-2 bg-gradient-to-r from-purple-heart-600 to-heliotrope-600 hover:from-purple-heart-500 hover:to-heliotrope-500 text-white shadow-lg shadow-purple-heart-500/20 rounded-xl h-11 px-5"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4" />
                                    <span>Generate 3 Variasi</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="p-4 sm:p-5">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50 rounded-xl">
                            {VARIATION_TYPES.map((v) => {
                                const variation = variations.find(vv => vv.id === v.id);
                                const hasContent = !!variation?.body;
                                return (
                                    <TabsTrigger
                                        key={v.id}
                                        value={v.id}
                                        className="flex flex-col gap-1 py-3 px-2 text-xs sm:text-sm rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800 transition-all"
                                    >
                                        <span className="text-xl">{v.icon}</span>
                                        <span className="font-medium hidden sm:inline truncate">{v.name}</span>
                                        {hasContent && (
                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                ✓
                                            </Badge>
                                        )}
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>

                        {variations.map((variation) => (
                            <TabsContent key={variation.id} value={variation.id} className="mt-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={variation.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <VariationCard
                                            variation={variation}
                                            isGenerating={generatingId === variation.id || (isGenerating && !variation.body)}
                                            isCopied={copiedId === variation.id}
                                            onGenerate={() => handleGenerateSingle(variation.id)}
                                            onCopy={() => handleCopy(variation)}
                                            onUse={() => handleUseVariation(variation)}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Tips */}
                {!hasAnyVariation && (
                    <div className="px-5 pb-5">
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30">
                            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800 dark:text-amber-200">
                                <span className="font-semibold">Tips:</span> Klik "Generate 3 Variasi" untuk membuat 3 versi email sekaligus, lalu pilih yang paling cocok dengan culture perusahaan target kamu.
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}

// Variation Card Component
interface VariationCardProps {
    variation: EmailVariationV2;
    isGenerating: boolean;
    isCopied: boolean;
    onGenerate: () => void;
    onCopy: () => void;
    onUse: () => void;
}

function VariationCard({
    variation,
    isGenerating,
    isCopied,
    onGenerate,
    onCopy,
    onUse,
}: VariationCardProps) {
    const hasContent = !!variation.body;
    const wordCount = variation.body?.split(/\s+/).length || 0;

    return (
        <Card className="overflow-hidden border border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl">
            {/* Card Header */}
            <div className="p-4 border-b border-border/30 bg-muted/20">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{variation.icon}</span>
                        <div>
                            <h4 className="font-bold text-foreground">{variation.name}</h4>
                            <p className="text-xs text-muted-foreground">{variation.description}</p>
                        </div>
                    </div>
                    {hasContent && (
                        <Badge variant="outline" className="text-xs font-normal">
                            {wordCount} kata
                        </Badge>
                    )}
                </div>
                <div className="mt-2">
                    <Badge variant="secondary" className="text-xs font-normal bg-purple-heart-50 text-purple-heart-700 dark:bg-purple-900/30 dark:text-purple-300">
                        Cocok untuk: {variation.bestFor}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 min-h-[200px]">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-heart-500 to-heliotrope-500 opacity-20 animate-ping absolute inset-0" />
                            <Loader2 className="h-16 w-16 animate-spin text-purple-heart-500 relative" />
                        </div>
                        <p className="text-sm mt-4 font-medium">Generating variasi...</p>
                    </div>
                ) : hasContent ? (
                    <div className="space-y-3">
                        <div className="p-3 bg-purple-heart-50/50 dark:bg-purple-900/20 rounded-lg">
                            <span className="text-xs font-semibold text-purple-heart-600 dark:text-purple-400 uppercase tracking-wider">Subject</span>
                            <p className="text-sm font-medium text-foreground mt-1">{variation.subject}</p>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            <pre className="whitespace-pre-wrap text-sm font-sans text-foreground/90 leading-relaxed">
                                {variation.body}
                            </pre>
                        </div>
                    </div>
                ) : variation.error ? (
                    <div className="py-8 text-center text-red-500 text-sm">
                        <p>❌ Error: {variation.error}</p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onGenerate}
                            className="mt-3"
                        >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Coba Lagi
                        </Button>
                    </div>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">
                        <div className="text-5xl mb-3 opacity-30">{variation.icon}</div>
                        <p className="text-sm mb-4">Belum di-generate</p>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onGenerate}
                            className="rounded-full px-5"
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Variasi Ini
                        </Button>
                    </div>
                )}
            </div>

            {/* Actions */}
            {hasContent && (
                <div className="p-4 border-t border-border/30 bg-muted/10">
                    <div className="flex gap-3">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-lg h-10"
                            onClick={onCopy}
                        >
                            {isCopied ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 text-green-500" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy
                                </>
                            )}
                        </Button>
                        <Button
                            size="sm"
                            className="flex-1 rounded-lg h-10 bg-gradient-to-r from-purple-heart-600 to-heliotrope-600 hover:from-purple-heart-500 hover:to-heliotrope-500 text-white shadow-md"
                            onClick={onUse}
                        >
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Gunakan Variasi Ini
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
