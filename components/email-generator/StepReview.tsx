"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmailFormData } from "./types";
import { generateEmailWithAI } from "@/actions/email/generate";
import { saveEmailDraft } from "@/actions/email/save";
import {
  Loader2, Copy, Save, CheckCircle2,
  Send, User, X, Sparkles,
  Undo2, RotateCcw, Zap, ExternalLink,
  FileText, Mail, ChevronDown, ChevronUp, Layers
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { EmailSuggestions } from "./EmailSuggestions";
import { EmailVariations } from "./EmailVariations";

interface StepReviewProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

const QUICK_REFINEMENTS = [
  { id: 'confident', label: '💪 Lebih PD', prompt: 'Buat lebih percaya diri dan assertive, tapi tetap sopan' },
  { id: 'humble', label: '🙏 Humble', prompt: 'Buat lebih rendah hati dan respectful' },
  { id: 'shorter', label: '✂️ Singkat', prompt: 'Kurangi 30% tanpa hilangkan poin penting' },
  { id: 'numbers', label: '📊 Angka', prompt: 'Tambahkan metrics/angka yang lebih spesifik' },
  { id: 'humanize', label: '🧑 Natural', prompt: 'Buat lebih natural, kurangi kesan AI-generated' },
];

export function StepReview({ formData, updateFormData }: StepReviewProps) {
  const [generating, setGenerating] = useState(false);
  const [refining, setRefining] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState<string>(''); // Track saved content
  const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('id');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [showQualityScore, setShowQualityScore] = useState(true);
  const [showVariations, setShowVariations] = useState(false);

  useEffect(() => {
    if (formData.bodyContent && history.length === 0) {
      setHistory([formData.bodyContent]);
    }
  }, [formData.bodyContent]);

  const pushToHistory = (content: string) => {
    setHistory(prev => [...prev, content]);
    setCanUndo(true);
  };

  // Reset saved state when content changes (so save button reappears)
  useEffect(() => {
    if (formData.bodyContent && formData.bodyContent !== lastSavedContent) {
      setSaved(false);
    }
  }, [formData.bodyContent, lastSavedContent]);

  const handleUndo = () => {
    if (history.length > 1) {
      const prev = history[history.length - 2];
      setHistory(h => h.slice(0, -1));
      updateFormData({ bodyContent: prev });
      if (history.length <= 2) setCanUndo(false);
      toast.info("Perubahan dibatalkan");
    }
  };

  useEffect(() => {
    if (!formData.bodyContent && !generating) {
      handleGenerate('id');
    }
  }, []);

  const handleGenerate = async (language: 'id' | 'en' = 'id') => {
    setGenerating(true);
    setCurrentLanguage(language);

    try {
      const toneStyle = formData.toneStyle === 'professional' ? 'semi-formal' : formData.toneStyle;

      const result = await generateEmailWithAI({
        language,
        emailType: formData.emailType as any,
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        hasAttachment: formData.hasAttachment,
        yourName: formData.yourName,
        toneStyle: toneStyle as any,
        highlightSkills: formData.highlightSkills,
        // For thank you emails, include interviewTopics in achievements
        achievements: formData.emailType === 'thank_you' && formData.interviewTopics
          ? `Interview topics: ${formData.interviewTopics}${formData.achievements ? '. ' + formData.achievements : ''}`
          : formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        personalStory: formData.personalStory,
        personality: 'balanced',
        lengthType: 'medium',
      });

      if (result.error) {
        toast.error("Gagal generate: " + result.error);
        return;
      }

      setHistory([result.body || '']);
      setCanUndo(false);
      updateFormData({ subjectLine: result.subject, bodyContent: result.body });
      toast.success("Email berhasil di-generate!");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setGenerating(false);
    }
  };

  const handleRefine = async (id: string, prompt: string) => {
    if (!formData.bodyContent) return;
    setRefining(id);

    try {
      const { refineEmailWithAI } = await import("@/actions/email/refine");
      const result = await refineEmailWithAI({
        currentEmail: formData.bodyContent,
        refinementPrompt: prompt,
        language: currentLanguage,
      });

      if (result.error) {
        toast.error("Gagal refine: " + result.error);
        return;
      }

      const newContent = result.refinedEmail || formData.bodyContent;
      pushToHistory(newContent);
      updateFormData({ bodyContent: newContent });
      toast.success("Email diperbaiki!");
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setRefining(null);
    }
  };

  const handleCopy = async () => {
    const full = `Subject: ${formData.subjectLine}\n\n${formData.bodyContent}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      toast.success("Email dicopy!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal copy");
    }
  };

  const handleSave = async () => {
    if (!formData.subjectLine || !formData.bodyContent) {
      toast.error("Generate email dulu");
      return;
    }
    setSaving(true);
    try {
      const result = await saveEmailDraft({
        emailType: formData.emailType as any,
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        toneStyle: formData.toneStyle === 'professional' ? 'semi-formal' : formData.toneStyle,
        personality: formData.personality || 'balanced',
        lengthType: formData.lengthType || 'medium',
        subjectLine: formData.subjectLine || '',
        bodyContent: formData.bodyContent || '',
        highlightSkills: formData.highlightSkills,
        achievements: formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        hasAttachment: formData.hasAttachment,
        status: 'draft',
      });
      if (result.error) {
        toast.error("Gagal simpan: " + result.error);
        return;
      }
      setSaved(true);
      setLastSavedContent(formData.bodyContent || ''); // Track saved content
      toast.success("Email tersimpan ke riwayat!");
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenInEmail = () => {
    const subject = encodeURIComponent(formData.subjectLine || "");
    const body = encodeURIComponent(formData.bodyContent || "");
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const wordCount = formData.bodyContent ? formData.bodyContent.split(/\s+/).length : 0;
  const hrdDisplay = formData.hrdName || "Hiring Manager";

  if (generating) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative bg-white dark:bg-slate-900 p-5 rounded-full shadow-lg border">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        </div>
        <h3 className="font-bold text-lg mb-1">Sedang Menulis Email...</h3>
        <p className="text-muted-foreground text-sm">AI sedang merangkai email profesional untukmu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">

      {/* Mobile Header */}
      <div className="text-center md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Step 3: Review & Kirim
        </motion.div>
      </div>

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-full sm:w-auto">
          <button
            onClick={() => handleGenerate('id')}
            disabled={generating}
            className={cn(
              "flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5",
              currentLanguage === 'id' ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
            )}
          >
            🇮🇩 Bahasa
          </button>
          <button
            onClick={() => handleGenerate('en')}
            disabled={generating}
            className={cn(
              "flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5",
              currentLanguage === 'en' ? "bg-white dark:bg-slate-800 shadow-sm text-primary" : "text-slate-500 hover:text-slate-700"
            )}
          >
            🇬🇧 English
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={() => handleGenerate(currentLanguage)} disabled={generating} className="gap-1.5 flex-1 sm:flex-none h-8 sm:h-9">
            <RotateCcw className={cn("h-3.5 w-3.5", generating && "animate-spin")} />
            <span className="hidden sm:inline">Regenerate</span>
            <span className="sm:hidden">Redo</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saved || saving} className="gap-1.5 flex-1 sm:flex-none h-8 sm:h-9">
            {saved ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
      </div>

      {/* Quick Refinements - Horizontal Scroll on Mobile */}
      <div className="relative -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0 no-scrollbar mask-linear-fade">
          <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-1 shrink-0 uppercase tracking-wider font-semibold">
            <Zap className="h-3 w-3 text-amber-500" /> Quick Fix:
          </span>
          {QUICK_REFINEMENTS.map((r) => (
            <Button
              key={r.id}
              variant="secondary"
              size="sm"
              onClick={() => handleRefine(r.id, r.prompt)}
              disabled={refining !== null || !formData.bodyContent}
              className={cn(
                "text-[10px] h-7 rounded-full px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-all",
                refining === r.id && "opacity-70 ring-1 ring-primary"
              )}
            >
              {refining === r.id ? <Loader2 className="h-2.5 w-2.5 animate-spin mr-1" /> : null}
              {r.label}
            </Button>
          ))}
          {canUndo && (
            <Button variant="ghost" size="sm" onClick={handleUndo} className="text-[10px] h-7 rounded-full px-2.5 text-muted-foreground hover:text-slate-900 shrink-0">
              <Undo2 className="h-3 w-3 mr-1" /> Undo
            </Button>
          )}
        </div>
      </div>

      {/* Email Card */}
      <Card className="overflow-hidden shadow-lg border-slate-200 dark:border-slate-800">
        {/* Window Header */}
        <div className="h-9 bg-slate-50 dark:bg-slate-900 border-b flex items-center px-3 justify-between">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wide">New Message</span>
          <div className="w-10" />
        </div>

        {/* Email Fields */}
        <div className="px-3 sm:px-5 pt-3 pb-1.5 bg-white dark:bg-slate-950 space-y-1">
          <div className="flex items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 w-12 font-medium">To:</span>
            <Badge variant="secondary" className="text-[10px] flex items-center gap-1 bg-slate-100 dark:bg-slate-800 border-0">
              <User className="h-2.5 w-2.5" />
              {hrdDisplay}
            </Badge>
          </div>
          <div className="flex items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 w-12 font-medium">Subject:</span>
            <Input
              value={formData.subjectLine || ''}
              onChange={(e) => updateFormData({ subjectLine: e.target.value })}
              className="border-none shadow-none focus-visible:ring-0 px-0 font-semibold text-xs sm:text-sm h-auto py-0 bg-transparent"
              placeholder="Subject..."
            />
          </div>
        </div>

        {/* Email Body */}
        <div className="px-3 sm:px-5 py-3 min-h-[250px] sm:min-h-[300px] bg-white dark:bg-slate-950">
          <Textarea
            value={formData.bodyContent || ''}
            onChange={(e) => updateFormData({ bodyContent: e.target.value })}
            className="w-full min-h-[230px] sm:min-h-[280px] border-none shadow-none focus-visible:ring-0 p-0 resize-y text-xs sm:text-sm leading-relaxed bg-transparent"
            placeholder="Email content..."
          />
        </div>

        {/* Footer */}
        <div className="p-2.5 sm:p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center sm:justify-start">
            <FileText className="h-3 w-3" />
            {wordCount} kata
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 flex-1 sm:flex-none text-xs h-8">
              {copied ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button onClick={handleOpenInEmail} size="sm" className="gap-1.5 bg-[#0b57d0] hover:bg-[#0b57d0]/90 text-white flex-1 sm:flex-none text-xs h-8">
              <Mail className="h-3 w-3" />
              Open Email
              <ExternalLink className="h-2.5 w-2.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Email Quality Score - Always Visible */}
      {formData.bodyContent && (
        <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
          <EmailSuggestions email={formData.bodyContent} formData={formData} />
        </div>
      )}

      {/* A/B Variations Toggle */}
      <Card className="p-4 border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setShowVariations(!showVariations)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">A/B Email Variations</h3>
              <p className="text-xs text-muted-foreground">Generate 3 versi berbeda untuk dipilih</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8">
            {showVariations ? (
              <>Hide <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Show <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </button>

        <AnimatePresence>
          {showVariations && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <EmailVariations
                  formData={formData}
                  onSelectVariation={(subject, body) => {
                    updateFormData({ subjectLine: subject, bodyContent: body });
                    setShowVariations(false);
                  }}
                  currentEmail={formData.bodyContent}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <p className="text-center text-[10px] text-muted-foreground">
        💡 Klik subject atau body untuk edit langsung • Generate variations untuk opsi lain
      </p>
    </div>
  );
}
