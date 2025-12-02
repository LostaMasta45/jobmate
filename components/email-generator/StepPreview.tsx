"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailFormData } from "./types";
import { generateEmailWithAI } from "@/actions/email/generate";
import { saveEmailDraft } from "@/actions/email/save";
import { Loader2, Copy, Save, RefreshCw, CheckCircle2, Mail, Eye, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StepPreviewProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

export function StepPreview({ formData, updateFormData }: StepPreviewProps) {
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'id' | 'en'>('id');

  // Auto-generate on mount if not already generated
  useEffect(() => {
    if (!formData.bodyContent && !generating) {
      handleGenerate('id');
    }
  }, []);

  const handleGenerate = async (language: 'id' | 'en' = 'id') => {
    setGenerating(true);
    setCurrentLanguage(language);
    try {
      const result = await generateEmailWithAI({
        language,
        emailType: formData.emailType,
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        hrdTitle: formData.hrdTitle,
        jobSource: formData.jobSource,
        referralName: formData.referralName,
        hasAttachment: formData.hasAttachment,
        yourName: formData.yourName,
        currentRole: formData.currentRole,
        yearsExperience: formData.yearsExperience,
        toneStyle: formData.toneStyle,
        personality: formData.personality,
        lengthType: formData.lengthType,
        highlightSkills: formData.highlightSkills,
        achievements: formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        callToAction: formData.callToAction,
      });

      if (result.error) {
        toast.error("Gagal generate email: " + result.error);
        return;
      }

      updateFormData({
        subjectLine: result.subject,
        bodyContent: result.body,
      });

      toast.success("Email berhasil di-generate!");
    } catch (error: any) {
      console.error("Error generating email:", error);
      toast.error("Terjadi kesalahan saat generate email");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    const fullEmail = `Subject: ${formData.subjectLine}\n\n${formData.bodyContent}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      toast.success("Email berhasil dicopy ke clipboard!");
    } catch (error) {
      toast.error("Gagal copy email");
    }
  };

  const handleSave = async () => {
    if (!formData.subjectLine || !formData.bodyContent) {
      toast.error("Harap generate email terlebih dahulu");
      return;
    }

    setSaving(true);
    try {
      const result = await saveEmailDraft({
        emailType: formData.emailType,
        position: formData.position,
        companyName: formData.companyName,
        hrdName: formData.hrdName,
        hrdTitle: formData.hrdTitle,
        jobSource: formData.jobSource,
        referralName: formData.referralName,
        toneStyle: formData.toneStyle,
        personality: formData.personality,
        lengthType: formData.lengthType,
        subjectLine: formData.subjectLine,
        bodyContent: formData.bodyContent,
        highlightSkills: formData.highlightSkills,
        achievements: formData.achievements,
        includeWhyCompany: formData.includeWhyCompany,
        includeWhyYou: formData.includeWhyYou,
        hasAttachment: formData.hasAttachment,
        status: 'draft',
      });

      if (result.error) {
        toast.error("Gagal menyimpan: " + result.error);
        return;
      }

      setSaved(true);
      toast.success("Email berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving email:", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const wordCount = formData.bodyContent ? formData.bodyContent.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed

  return (
    <div className="space-y-6">
      {generating && (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🤖 AI Sedang Bekerja...</h3>
              <p className="text-muted-foreground text-sm">
                Membuat email profesional untukmu. Tunggu sebentar ya!
              </p>
            </div>
          </div>
        </Card>
      )}

      {!generating && (formData.subjectLine || formData.bodyContent) && (
        <div className="space-y-6">
          {/* Actions Bar - Responsive */}
          <div className="space-y-4">
            {/* Language Selection - Full width on mobile */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleGenerate('id')}
                variant={currentLanguage === 'id' ? 'default' : 'outline'}
                className="gap-2 flex-1"
                disabled={generating}
              >
                <RefreshCw className={`h-4 w-4 ${generating && currentLanguage === 'id' ? 'animate-spin' : ''}`} />
                🇮🇩 Bahasa Indonesia
              </Button>
              
              <Button
                onClick={() => handleGenerate('en')}
                variant={currentLanguage === 'en' ? 'default' : 'outline'}
                className="gap-2 flex-1"
                disabled={generating}
              >
                <RefreshCw className={`h-4 w-4 ${generating && currentLanguage === 'en' ? 'animate-spin' : ''}`} />
                🇬🇧 English
              </Button>
            </div>

            {/* Action Buttons - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Button onClick={handleCopy} variant="outline" className="gap-2 h-11 w-full">
                <Copy className="h-4 w-4" />
                Copy
              </Button>

              <Button
                onClick={() => {
                  const subject = encodeURIComponent(formData.subjectLine || "");
                  const body = encodeURIComponent(formData.bodyContent || "");
                  window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
                }}
                variant="outline"
                className="gap-2 h-11 w-full"
              >
                <Send className="h-4 w-4" />
                Open Mail
              </Button>

              <Button
                onClick={handleSave}
                variant="default"
                className="gap-2 h-11 bg-[#5547d0] hover:bg-[#4538b0] w-full"
                disabled={saving || saved}
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Tersimpan
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {saving ? "..." : "Simpan"}
                  </>
                )}
              </Button>

              {saved && (
                <Link href="/tools/email-generator/history" className="w-full">
                  <Button variant="outline" className="gap-2 w-full">
                    <Eye className="h-4 w-4" />
                    Lihat History
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Subject Line
            </Label>
            <Input
              id="subject"
              value={formData.subjectLine || ''}
              onChange={(e: any) => updateFormData({ subjectLine: e.target.value })}
              className="text-base font-medium h-12"
            />
          </div>

          {/* Email Body */}
          <div className="space-y-2">
            <Label htmlFor="body" className="flex items-center gap-2 justify-between">
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email Body
              </span>
              <span className="text-xs text-muted-foreground">
                {wordCount} words • ~{readingTime} min read
              </span>
            </Label>
            <Textarea
              id="body"
              value={formData.bodyContent || ''}
              onChange={(e) => updateFormData({ bodyContent: e.target.value })}
              rows={16}
              className="font-mono text-sm resize-none"
            />
          </div>

          {/* Email Analysis */}
          <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              📊 Email Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Statistik:</p>
                <ul className="text-sm space-y-1">
                  <li>✅ Length: {wordCount} words</li>
                  <li>✅ Tone: {formData.toneStyle}</li>
                  <li>✅ Reading time: ~{readingTime} minute{readingTime > 1 ? 's' : ''}</li>
                  <li>✅ ATS-friendly: Yes</li>
                </ul>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tips:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Personalize nama company/HRD</li>
                  <li>• Proofread sebelum kirim</li>
                  <li>• Kirim di jam kerja (9-11 AM)</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Preview Card */}
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Eye className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Preview Email</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subject:</p>
                <p className="font-semibold text-slate-900 dark:text-slate-100">{formData.subjectLine}</p>
              </div>
              
              <hr className="border-slate-100 dark:border-slate-800" />
              
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                {formData.bodyContent}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
