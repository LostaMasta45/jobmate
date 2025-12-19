"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  EmailVariation, 
  VARIATION_TYPES, 
  generateSingleVariation,
  compareVariations,
  GenerateVariationsParams 
} from "@/lib/emailVariations";
import { 
  Loader2, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight,
  LayoutGrid,
  Columns,
  RefreshCw,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { EmailFormData } from "./types";

interface EmailVariationsProps {
  formData: EmailFormData;
  onSelectVariation: (subject: string, body: string) => void;
  currentEmail?: string;
}

export function EmailVariations({ formData, onSelectVariation, currentEmail }: EmailVariationsProps) {
  const [variations, setVariations] = useState<EmailVariation[]>(
    VARIATION_TYPES.map(v => ({ ...v }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'tabs' | 'grid'>('tabs');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const buildParams = (): GenerateVariationsParams => ({
    emailType: formData.emailType,
    position: formData.position,
    companyName: formData.companyName,
    yourName: formData.yourName,
    hrdName: formData.hrdName,
    hrdTitle: formData.hrdTitle,
    jobSource: formData.jobSource,
    referralName: formData.referralName,
    hasAttachment: formData.hasAttachment,
    currentRole: formData.currentRole,
    yearsExperience: formData.yearsExperience,
    toneStyle: formData.toneStyle,
    personality: formData.personality || 'balanced',
    lengthType: formData.lengthType || 'medium',
    highlightSkills: formData.highlightSkills,
    achievements: formData.achievements,
    includeWhyCompany: formData.includeWhyCompany,
    includeWhyYou: formData.includeWhyYou,
    callToAction: formData.callToAction,
    personalStory: formData.personalStory,
    openingStyle: formData.openingStyle,
    toneSettings: formData.toneSettings,
    language: 'id',
  });

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    
    // Generate all variations in parallel
    const promises = VARIATION_TYPES.map(async (variation) => {
      const result = await generateSingleVariation(buildParams(), variation);
      
      if ('error' in result) {
        return { ...variation, error: result.error };
      }
      
      return {
        ...variation,
        subject: result.subject,
        body: result.body,
      };
    });

    const results = await Promise.all(promises);
    setVariations(results);
    setIsGenerating(false);
    toast.success("3 variasi email berhasil di-generate!");
  };

  const handleGenerateSingle = async (variationId: string) => {
    setGeneratingId(variationId);
    
    const variation = VARIATION_TYPES.find(v => v.id === variationId);
    if (!variation) return;

    const result = await generateSingleVariation(buildParams(), variation);
    
    setVariations(prev => prev.map(v => {
      if (v.id === variationId) {
        if ('error' in result) {
          return { ...v, error: result.error, body: undefined, subject: undefined };
        }
        return { ...v, subject: result.subject, body: result.body, error: undefined };
      }
      return v;
    }));
    
    setGeneratingId(null);
    toast.success(`Variasi "${variation.nameId}" berhasil di-generate!`);
  };

  const handleCopy = async (variation: EmailVariation) => {
    if (!variation.body) return;
    
    const fullEmail = `Subject: ${variation.subject}\n\n${variation.body}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopiedId(variation.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Email dicopy ke clipboard!");
  };

  const handleUseVariation = (variation: EmailVariation) => {
    if (!variation.subject || !variation.body) return;
    onSelectVariation(variation.subject, variation.body);
    toast.success(`Menggunakan variasi "${variation.nameId}"`);
  };

  const comparison = compareVariations(variations.filter(v => v.body));
  const hasAnyVariation = variations.some(v => v.body);

  return (
    <Card className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200/50 dark:border-indigo-800/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-lg">A/B Email Variations</h3>
            <Badge variant="secondary" className="text-xs">Beta</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                size="sm"
                variant={viewMode === 'tabs' ? 'default' : 'ghost'}
                className="rounded-none h-8 px-2"
                onClick={() => setViewMode('tabs')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                className="rounded-none h-8 px-2"
                onClick={() => setViewMode('grid')}
              >
                <Columns className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={handleGenerateAll}
              disabled={isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate 3 Variasi
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Generate 3 versi email dengan pendekatan berbeda. Pilih yang paling cocok dengan target perusahaan.
        </p>

        {/* Variations Display */}
        {viewMode === 'tabs' ? (
          <Tabs defaultValue={VARIATION_TYPES[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto">
              {VARIATION_TYPES.map((v) => (
                <TabsTrigger 
                  key={v.id} 
                  value={v.id}
                  className="flex flex-col gap-1 py-2 px-1 text-xs sm:text-sm data-[state=active]:bg-indigo-100 dark:data-[state=active]:bg-indigo-900/50"
                >
                  <span className="text-lg">{v.icon}</span>
                  <span className="hidden sm:inline">{v.nameId}</span>
                  <span className="sm:hidden">{v.icon}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {variations.map((variation) => (
              <TabsContent key={variation.id} value={variation.id} className="mt-4">
                <VariationCard
                  variation={variation}
                  isGenerating={generatingId === variation.id}
                  isCopied={copiedId === variation.id}
                  onGenerate={() => handleGenerateSingle(variation.id)}
                  onCopy={() => handleCopy(variation)}
                  onUse={() => handleUseVariation(variation)}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {variations.map((variation) => (
              <VariationCard
                key={variation.id}
                variation={variation}
                isGenerating={generatingId === variation.id}
                isCopied={copiedId === variation.id}
                onGenerate={() => handleGenerateSingle(variation.id)}
                onCopy={() => handleCopy(variation)}
                onUse={() => handleUseVariation(variation)}
                compact
              />
            ))}
          </div>
        )}

        {/* Recommendations */}
        {hasAnyVariation && comparison.recommendations.length > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Rekomendasi:</p>
                {comparison.recommendations.map((rec, i) => (
                  <p key={i} className="text-sm text-amber-700 dark:text-amber-300">{rec}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Variation Card Component
interface VariationCardProps {
  variation: EmailVariation;
  isGenerating: boolean;
  isCopied: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  onUse: () => void;
  compact?: boolean;
}

function VariationCard({ 
  variation, 
  isGenerating, 
  isCopied,
  onGenerate, 
  onCopy, 
  onUse,
  compact 
}: VariationCardProps) {
  const hasContent = !!variation.body;
  const wordCount = variation.body?.split(/\s+/).length || 0;

  return (
    <Card className={`p-4 ${compact ? 'h-full' : ''} bg-white dark:bg-slate-900`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{variation.icon}</span>
            <div>
              <h4 className="font-semibold text-sm">{variation.nameId}</h4>
              <p className="text-xs text-muted-foreground">{variation.descriptionId}</p>
            </div>
          </div>
          {hasContent && (
            <Badge variant="outline" className="text-xs">
              {wordCount} kata
            </Badge>
          )}
        </div>

        {/* Content */}
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Generating variasi...</p>
          </div>
        ) : hasContent ? (
          <div className="space-y-2">
            <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs">
              <span className="font-medium">Subject:</span> {variation.subject}
            </div>
            <div className={`prose prose-sm max-w-none ${compact ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}>
              <pre className="whitespace-pre-wrap text-xs font-sans bg-transparent p-0 m-0">
                {variation.body}
              </pre>
            </div>
          </div>
        ) : variation.error ? (
          <div className="py-4 text-center text-red-500 text-sm">
            Error: {variation.error}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p className="text-sm mb-3">Belum di-generate</p>
            <Button
              size="sm"
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Generate
            </Button>
          </div>
        )}

        {/* Actions */}
        {hasContent && (
          <div className="flex gap-2 pt-2 border-t">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={onCopy}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={onUse}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Gunakan
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
