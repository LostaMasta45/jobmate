"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmailFormData, PreviewSkeleton } from "./types";
import {
  Sparkles, X, Plus, Palette, MessageSquare,
  BookOpen, Target, CheckCircle2, Eye, FileText,
  Lightbulb, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface StepHowWhatProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

// Simplified tone options (3 instead of 4+)
const TONE_OPTIONS = [
  {
    value: 'formal',
    icon: '🎩',
    label: 'Formal',
    desc: 'Bank, Pemerintahan, Korporat Besar',
    example: '"Dengan hormat, saya bermaksud untuk melamar..."',
  },
  {
    value: 'professional',
    icon: '💼',
    label: 'Professional',
    desc: 'Tech Company, Startup, Multinational',
    example: '"Saya tertarik untuk bergabung dengan tim..."',
  },
  {
    value: 'casual',
    icon: '👕',
    label: 'Casual',
    desc: 'Creative Agency, Startup Kecil',
    example: '"Hai! Saya excited untuk apply posisi ini..."',
  },
];

// Opening Hook Styles - determines how the email begins
const OPENING_HOOKS = [
  {
    value: 'achievement',
    icon: '🏆',
    label: 'Achievement',
    desc: 'Buka dengan pencapaian',
    color: 'text-amber-600',
    bgSelected: 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
  },
  {
    value: 'story',
    icon: '📖',
    label: 'Story',
    desc: 'Cerita yang engaging',
    color: 'text-blue-600',
    bgSelected: 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
  },
  {
    value: 'connection',
    icon: '🤝',
    label: 'Connection',
    desc: 'Mutual connection',
    color: 'text-green-600',
    bgSelected: 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
  },
  {
    value: 'question',
    icon: '❓',
    label: 'Question',
    desc: 'Pertanyaan menarik',
    color: 'text-purple-600',
    bgSelected: 'bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-700'
  },
  {
    value: 'direct',
    icon: '🎯',
    label: 'Direct',
    desc: 'Langsung to the point',
    color: 'text-rose-600',
    bgSelected: 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700'
  },
];

// Generate preview skeleton based on form data
function generatePreviewSkeleton(formData: EmailFormData): PreviewSkeleton {
  const { emailType, position, companyName, yourName, highlightSkills, achievements, personalStory, toneStyle, hrdName } = formData;

  // Generate subject
  let subject = '';
  switch (emailType) {
    case 'application':
      subject = `Lamaran untuk posisi ${position || '[Posisi]'} - ${yourName || '[Nama]'}`;
      break;
    case 'follow_up':
      subject = `Follow Up Lamaran ${position || '[Posisi]'} - ${yourName || '[Nama]'}`;
      break;
    case 'thank_you':
      subject = `Terima Kasih atas Kesempatan Interview - ${yourName || '[Nama]'}`;
      break;
    case 'inquiry':
      subject = `Inquiry: Peluang Karir di ${companyName || '[Perusahaan]'}`;
      break;
    default:
      subject = 'Subject email akan muncul di sini...';
  }

  // Generate greeting
  const greeting = hrdName
    ? `Yth. ${hrdName},`
    : toneStyle === 'casual'
      ? `Hai Tim ${companyName || 'Recruitment'}!`
      : `Yth. Bapak/Ibu HRD,`;

  // Generate paragraphs
  const paragraphs: { text: string; isPlaceholder: boolean }[] = [];

  // Opening paragraph
  if (emailType === 'application') {
    paragraphs.push({
      text: personalStory
        ? `${personalStory.substring(0, 100)}...`
        : `Saya ${yourName || '[Nama]'} ingin melamar posisi ${position || '[Posisi]'} di ${companyName || '[Perusahaan]'}.`,
      isPlaceholder: !personalStory,
    });
  } else if (emailType === 'follow_up') {
    paragraphs.push({
      text: `Saya ingin menanyakan status lamaran saya untuk posisi ${position || '[Posisi]'} yang telah saya kirimkan sebelumnya.`,
      isPlaceholder: true,
    });
  } else if (emailType === 'thank_you') {
    paragraphs.push({
      text: `Terima kasih atas kesempatan interview untuk posisi ${position || '[Posisi]'} kemarin.`,
      isPlaceholder: true,
    });
  } else if (emailType === 'inquiry') {
    paragraphs.push({
      text: `Saya tertarik untuk mengetahui peluang karir di ${companyName || '[Perusahaan]'}, khususnya di bidang ${position || '[Bidang]'}.`,
      isPlaceholder: true,
    });
  }

  // Skills paragraph
  if (highlightSkills.length > 0) {
    paragraphs.push({
      text: `Keahlian utama saya meliputi: ${highlightSkills.join(', ')}.`,
      isPlaceholder: false,
    });
  }

  // Achievements paragraph
  if (achievements) {
    paragraphs.push({
      text: achievements.length > 100 ? `${achievements.substring(0, 100)}...` : achievements,
      isPlaceholder: false,
    });
  }

  // Closing
  const closing = toneStyle === 'casual'
    ? `Cheers,\n${yourName || '[Nama]'}`
    : `Hormat saya,\n${yourName || '[Nama]'}`;

  // Calculate completeness
  let completeness = 0;
  if (emailType) completeness += 15;
  if (position) completeness += 15;
  if (companyName) completeness += 15;
  if (yourName) completeness += 15;
  if (toneStyle) completeness += 10;
  if (highlightSkills.length > 0) completeness += 15;
  if (achievements || personalStory) completeness += 15;

  // Word count estimate
  const wordCount = paragraphs.reduce((acc, p) => acc + p.text.split(' ').length, 0) + 50;

  return {
    subject,
    greeting,
    paragraphs,
    closing,
    wordCount,
    completeness: Math.min(completeness, 100),
  };
}

export function StepHowWhat({ formData, updateFormData }: StepHowWhatProps) {
  const [skillInput, setSkillInput] = useState('');
  const [showPersonalStory, setShowPersonalStory] = useState(!!formData.personalStory);

  // Generate preview skeleton
  const preview = useMemo(() => generatePreviewSkeleton(formData), [formData]);

  const addSkill = (skill: string) => {
    if (skill.trim() && formData.highlightSkills.length < 8) {
      updateFormData({ highlightSkills: [...formData.highlightSkills, skill.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    updateFormData({ highlightSkills: formData.highlightSkills.filter((_, i) => i !== index) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const isApplication = formData.emailType === 'application';
  const isInquiry = formData.emailType === 'inquiry';
  const isThankYou = formData.emailType === 'thank_you';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="text-center space-y-2 md:space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 2: Gaya & Konten</span>
        </motion.div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Personalisasi emailmu
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Pilih gaya bahasa dan tambahkan informasi untuk membuat email lebih personal
        </p>
      </div>

      {/* Main Content - Stack on Mobile, Split on Large */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

        {/* Left: Form (3 cols on desktop) */}
        <div className="lg:col-span-3 space-y-6">

          {/* Tone Picker */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              Gaya Bahasa
            </Label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              {TONE_OPTIONS.map((tone) => {
                const isSelected = formData.toneStyle === tone.value;
                return (
                  <button
                    key={tone.value}
                    onClick={() => updateFormData({ toneStyle: tone.value as any })}
                    className={cn(
                      "flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-1 py-3 px-4 rounded-lg transition-all text-left sm:text-center relative",
                      isSelected
                        ? "bg-white dark:bg-slate-800 shadow-sm ring-1 ring-primary/10"
                        : "hover:bg-white/50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <span className="text-2xl block">{tone.icon}</span>
                    <div className="flex-1 sm:flex-none">
                      <span className={cn(
                        "font-semibold text-sm block",
                        isSelected ? "text-primary" : "text-slate-700 dark:text-slate-300"
                      )}>
                        {tone.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 block sm:hidden xl:block">
                        {tone.desc}
                      </span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary sm:hidden" />}
                  </button>
                );
              })}
            </div>

            {/* Tone example */}
            <div className="text-xs text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-lg p-3 italic text-center">
              "{TONE_OPTIONS.find(t => t.value === formData.toneStyle)?.example}"
            </div>
          </div>

          {/* Opening Hook Selector - NEW FEATURE */}
          {(isApplication || isInquiry) && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Gaya Pembuka Email
                <Badge variant="outline" className="text-[10px] ml-1 border-indigo-200 text-indigo-600 bg-indigo-50">
                  Recommended
                </Badge>
              </Label>

              <div className="grid grid-cols-5 gap-2">
                {OPENING_HOOKS.map((hook) => {
                  const isSelected = formData.openingStyle === hook.value;
                  return (
                    <button
                      key={hook.value}
                      onClick={() => updateFormData({ openingStyle: hook.value as any })}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5 hover:shadow-sm",
                        isSelected
                          ? cn(hook.bgSelected, "shadow-sm")
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                      )}
                    >
                      <span className="text-xl">{hook.icon}</span>
                      <span className={cn(
                        "font-semibold text-[10px]",
                        isSelected ? hook.color : "text-slate-600 dark:text-slate-400"
                      )}>
                        {hook.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[10px] text-muted-foreground text-center">
                Pilih gaya pembuka untuk menarik perhatian HRD sejak kalimat pertama
              </div>
            </div>
          )}

          {/* Skills Input (for application/inquiry) */}
          {(isApplication || isInquiry) && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Keahlian & Skills
                <Badge variant="secondary" className="text-[10px] ml-auto">Optional</Badge>
              </Label>

              <div className="flex gap-2">
                <Input
                  placeholder="Ketik skill, tekan Enter (Contoh: ReactJS)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-10 border-slate-200 dark:border-slate-800"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => addSkill(skillInput)}
                  disabled={!skillInput.trim() || formData.highlightSkills.length >= 8}
                  className="h-10 px-4 bg-primary hover:bg-primary/90 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Skills chips */}
              {formData.highlightSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg min-h-[50px]">
                  {formData.highlightSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-2.5 py-1.5 text-xs flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      {skill}
                      <button onClick={() => removeSkill(index)} className="hover:text-red-500 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-xs text-muted-foreground text-center">
                    Tambahkan skill utama kamu untuk di-highlight di email.<br />
                    <span className="opacity-70">Contoh: Project Management, Design, Sales</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Achievements */}
          {(isApplication || isInquiry) && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Key Achievement
                <Badge variant="secondary" className="text-[10px] ml-auto">Optional</Badge>
              </Label>

              <Textarea
                placeholder="Ceritakan pencapaian terbaikmu (gunakan angka jika bisa)..."
                value={formData.achievements || ''}
                onChange={(e) => updateFormData({ achievements: e.target.value })}
                rows={3}
                className="resize-none border-slate-200 dark:border-slate-800 text-sm"
              />

              <div className="flex items-start gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-100 dark:border-amber-900">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  <strong>Pro Tips:</strong> "Meningkatkan penjualan sebesar 20% dalam 3 bulan" lebih meyakinkan daripada "Meningkatkan penjualan".
                </p>
              </div>
            </div>
          )}

          {/* Interview Topics for Thank You */}
          {isThankYou && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Highlight dari Interview
              </Label>

              <Textarea
                placeholder="e.g. Diskusi tentang React tech stack, culture tim yang kolaboratif, project timeline Q1..."
                value={formData.interviewTopics || ''}
                onChange={(e) => updateFormData({ interviewTopics: e.target.value })}
                rows={3}
                className="resize-none border-slate-200 dark:border-slate-800"
              />
            </div>
          )}

          {/* Personal Story (Expandable) */}
          {(isApplication || isInquiry) && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowPersonalStory(!showPersonalStory)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                Cerita Personal
                <Badge variant="outline" className="text-[10px] ml-1 border-orange-200 text-orange-600 bg-orange-50">
                  Recommended
                </Badge>
              </button>

              <AnimatePresence>
                {showPersonalStory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Card className="p-4 border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-950/20 dark:to-slate-950">
                      <p className="text-xs text-muted-foreground mb-3">
                        Ceritakan pengalaman relevan yang membuat kamu berbeda dari kandidat lain.
                      </p>
                      <Textarea
                        placeholder="Contoh: 'Waktu handle flash sale, sistem payment down. Dalam 2 jam saya berhasil fix dan save potential loss 500 juta...'"
                        value={formData.personalStory || ''}
                        onChange={(e) => updateFormData({ personalStory: e.target.value })}
                        rows={4}
                        className="resize-none border-orange-200 dark:border-orange-900 bg-white dark:bg-slate-950"
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Content Checkboxes */}
          {(isApplication || isInquiry) && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Poin Tambahan
              </Label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                    formData.includeWhyCompany
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                  )}
                  onClick={() => updateFormData({ includeWhyCompany: !formData.includeWhyCompany })}
                >
                  <Checkbox
                    checked={formData.includeWhyCompany}
                    onCheckedChange={(checked) => updateFormData({ includeWhyCompany: checked as boolean })}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">Kenapa Perusahaan Ini?</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Alasan ketertarikan pada perusahaan</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-all",
                    formData.includeWhyYou
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800"
                      : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                  )}
                  onClick={() => updateFormData({ includeWhyYou: !formData.includeWhyYou })}
                >
                  <Checkbox
                    checked={formData.includeWhyYou}
                    onCheckedChange={(checked) => updateFormData({ includeWhyYou: checked as boolean })}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium">Kenapa Saya Cocok?</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Cultural fit & relevansi background</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Preview (2 cols on desktop) */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-4 space-y-3">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Live Preview
            </Label>

            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm">
              {/* Mac window header */}
              <div className="h-8 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center px-3 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-muted-foreground ml-2">Preview</span>
              </div>

              {/* Preview Content */}
              <div className="p-4 bg-white dark:bg-slate-950 max-h-[400px] overflow-y-auto">
                {/* Subject */}
                <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                <div className="font-medium text-sm mb-4 text-slate-800 dark:text-slate-200">
                  {preview.subject}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mb-4" />

                {/* Body Preview */}
                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <p className="font-medium">{preview.greeting}</p>

                  {preview.paragraphs.map((p, i) => (
                    <p key={i} className={cn(
                      "leading-relaxed",
                      p.isPlaceholder && "text-slate-400 dark:text-slate-600 italic"
                    )}>
                      {p.text}
                    </p>
                  ))}

                  <p className="pt-2 whitespace-pre-line">{preview.closing}</p>
                </div>
              </div>

              {/* Preview Footer - Quality Indicators */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Kelengkapan</span>
                  <span className="text-xs font-semibold">{preview.completeness}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      preview.completeness >= 80 ? "bg-green-500" :
                        preview.completeness >= 50 ? "bg-amber-500" : "bg-red-500"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${preview.completeness}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                  <span>~{preview.wordCount} kata</span>
                  {preview.completeness >= 80 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Siap di-generate!
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
