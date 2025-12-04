"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmailFormData } from "./types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Trophy, Target, MessageCircle, Info, BookOpen, Lightbulb, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Opening style options for Phase 1 improvement
const OPENING_STYLES = [
  {
    value: 'achievement',
    label: 'Achievement Hook',
    description: 'Buka dengan pencapaian/angka',
    example: '"Dalam 6 bulan, saya tingkatkan conversion 40%..."',
    icon: '🏆'
  },
  {
    value: 'story',
    label: 'Story Hook',
    description: 'Cerita singkat yang engaging',
    example: '"Saat pertama pakai produk ini, saya langsung..."',
    icon: '📖'
  },
  {
    value: 'connection',
    label: 'Connection Hook',
    description: 'Referensi mutual atau berita',
    example: '"Baca artikel Pak X di Medium tentang..."',
    icon: '🤝'
  },
  {
    value: 'question',
    label: 'Question Hook',
    description: 'Pertanyaan thought-provoking',
    example: '"Pernahkah tim kehilangan kandidat bagus karena..."',
    icon: '❓'
  },
  {
    value: 'direct',
    label: 'Direct & Confident',
    description: 'Langsung to the point',
    example: '"Saya adalah engineer dengan track record..."',
    icon: '🎯'
  }
];

interface StepContentProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

const CALL_TO_ACTIONS = [
  { value: 'interview', label: 'Interview opportunity', icon: '🤝' },
  { value: 'meeting', label: 'Meeting untuk diskusi', icon: '📅' },
  { value: 'discussion', label: 'Further discussion', icon: '💬' },
  { value: 'portfolio_review', label: 'Portfolio review', icon: '👁️' },
];

export function StepContent({ formData, updateFormData }: StepContentProps) {
  const [skillInput, setSkillInput] = useState('');
  
  // Conditional content based on email type
  const isApplication = formData.emailType === 'application';
  const isFollowUp = formData.emailType === 'follow_up';
  const isThankYou = formData.emailType === 'thank_you';
  const isInquiry = formData.emailType === 'inquiry';

  const addSkill = (skill: string) => {
    if (skill.trim() && formData.highlightSkills.length < 10) {
      const newSkills = [...formData.highlightSkills, skill.trim()];
      updateFormData({ highlightSkills: newSkills });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const newSkills = formData.highlightSkills.filter((_, i) => i !== index);
    updateFormData({ highlightSkills: newSkills });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Highlight Skills - For application and inquiry only */}
      {(isApplication || isInquiry) && (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-[#5547d0]/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-[#5547d0]" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Keahlian & Skills</h3>
                    <p className="text-xs text-muted-foreground">Skill teknis yang paling relevan dengan posisi ini.</p>
                </div>
            </div>

            <Card className="p-5 border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                        type="text"
                        placeholder="e.g. React, Project Management, SEO"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 h-12 border-slate-200"
                        />
                        <Button
                        type="button"
                        onClick={() => addSkill(skillInput)}
                        disabled={!skillInput.trim() || formData.highlightSkills.length >= 10}
                        className="h-12 px-6 bg-[#5547d0] hover:bg-[#4538b0] w-full sm:w-auto font-medium"
                        >
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah
                        </Button>
                    </div>

                    {/* Skills List */}
                    {formData.highlightSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-2 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 min-h-[80px] content-start">
                            {formData.highlightSkills.map((skill, index) => (
                                <Badge
                                key={index}
                                className="px-3 py-1.5 text-sm flex items-center gap-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all"
                                >
                                {skill}
                                <button
                                    onClick={() => removeSkill(index)}
                                    className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 text-center">
                            <Sparkles className="h-8 w-8 text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500 font-medium">Belum ada skill ditambahkan</p>
                            <p className="text-xs text-slate-400">Ketik skill di atas dan tekan Enter</p>
                        </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground text-right">
                        {formData.highlightSkills.length}/10 skills
                    </p>
                </div>
            </Card>
      </div>
      )}

      {/* Specific Topics for Thank You Email */}
      {isThankYou && (
        <Card className="p-6 border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <Label className="text-lg font-semibold">Topik Interview</Label>
            </div>
            
            <div className="space-y-2">
                <Textarea
                    id="specificTopics"
                    placeholder="e.g. Diskusi tentang tech stack React, project timeline, team culture, dll"
                    value={formData.specificTopics || ''}
                    onChange={(e: any) => updateFormData({ specificTopics: e.target.value })}
                    rows={4}
                    className="resize-none border-slate-200 text-base"
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Sebutkan hal spesifik yang dibahas saat interview agar email terasa lebih personal
                </p>
            </div>
        </Card>
      )}

      {/* Achievements - Only for application */}
      {isApplication && (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
                <Label className="text-lg font-semibold">Key Achievement</Label>
            </div>

            <Card className="p-6 border-slate-200 dark:border-slate-800">
                <div className="space-y-2">
                <Textarea
                    id="achievements"
                    placeholder="e.g. Memimpin tim beranggotakan 5 developer, meningkatkan performa aplikasi sebesar 40%..."
                    value={formData.achievements || ''}
                    onChange={(e) => updateFormData({ achievements: e.target.value })}
                    rows={4}
                    className="resize-none focus:ring-[#5547d0]/20 border-slate-200 text-base"
                />
                <div className="flex items-center gap-2 mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/50">
                    <Lightbulb className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                        <strong>Tips:</strong> Gunakan angka jika memungkinkan (e.g. "Meningkatkan sales 20%").
                    </p>
                </div>
                </div>
            </Card>
        </div>
      )}

      {/* Personal Story - Phase 1 Feature */}
      {(isApplication || isInquiry) && (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-orange-600" />
                    </div>
                    <Label className="text-lg font-semibold">Cerita Personal</Label>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                    Highly Recommended
                </Badge>
            </div>

            <Card className="p-6 border-orange-200 dark:border-orange-900 bg-gradient-to-br from-white to-orange-50/30 dark:from-slate-950 dark:to-orange-950/10">
            <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                Ceritakan pengalaman/proyek spesifik yang relevan. Ini yang membuat email kamu <strong>BERBEDA</strong> dari ribuan pelamar lain!
                </p>
                <Textarea
                id="personalStory"
                placeholder="Contoh: 'Waktu di perusahaan sebelumnya, saya pernah handle situasi darurat dimana sistem payment down saat flash sale...'"
                value={formData.personalStory || ''}
                onChange={(e) => updateFormData({ personalStory: e.target.value })}
                rows={5}
                className="resize-none bg-white dark:bg-slate-900 border-slate-200 text-base"
                />
            </div>
            </Card>
        </div>
      )}

      {/* Opening Style Selector - Phase 1 Feature */}
      {(isApplication || isInquiry) && (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <Label className="text-lg font-semibold">Hook Pembuka</Label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {OPENING_STYLES.map((style) => (
                <div
                  key={style.value}
                  onClick={() => updateFormData({ openingStyle: style.value as any })}
                  className={cn(
                      "p-4 rounded-xl border-2 text-left transition-all cursor-pointer hover:shadow-md flex flex-col h-full relative group",
                      formData.openingStyle === style.value
                        ? "border-purple-500 bg-purple-50/50 dark:bg-purple-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 bg-white dark:bg-slate-950"
                  )}
                >
                  {formData.openingStyle === style.value && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">✓</div>
                  )}
                  
                  <div className="text-2xl mb-3">{style.icon}</div>
                  
                  <div className="flex-1">
                    <h4 className={cn("font-semibold text-sm mb-1", formData.openingStyle === style.value ? "text-purple-700 dark:text-purple-300" : "text-slate-800 dark:text-slate-200")}>
                        {style.label}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">{style.description}</p>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/50">
                    <p className="text-[10px] italic text-slate-500 line-clamp-2">
                        {style.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Options */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <Label className="text-lg font-semibold">Poin Tambahan</Label>
            </div>
            
            <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3">
            {(isApplication || isInquiry) && (
                <>
                <div 
                    className={cn(
                        "flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                        formData.includeWhyCompany 
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" 
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                    )}
                    onClick={() => updateFormData({ includeWhyCompany: !formData.includeWhyCompany })}
                >
                    <Checkbox
                    id="includeWhyCompany"
                    checked={formData.includeWhyCompany}
                    onCheckedChange={(checked: boolean) => updateFormData({ includeWhyCompany: checked })}
                    className="mt-1"
                    />
                    <div className="flex-1">
                    <Label htmlFor="includeWhyCompany" className="font-semibold cursor-pointer text-sm block">
                        Kenapa Perusahaan Ini?
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Generate alasan spesifik ketertarikan pada {formData.companyName || 'perusahaan'}.
                    </p>
                    </div>
                </div>

                <div 
                    className={cn(
                        "flex items-start space-x-3 p-3 rounded-xl border transition-all cursor-pointer",
                        formData.includeWhyYou 
                            ? "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800" 
                            : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                    )}
                    onClick={() => updateFormData({ includeWhyYou: !formData.includeWhyYou })}
                >
                    <Checkbox
                    id="includeWhyYou"
                    checked={formData.includeWhyYou}
                    onCheckedChange={(checked: boolean) => updateFormData({ includeWhyYou: checked })}
                    className="mt-1"
                    />
                    <div className="flex-1">
                    <Label htmlFor="includeWhyYou" className="font-semibold cursor-pointer text-sm block">
                        Kenapa Saya Cocok?
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                        Jelaskan &quot;cultural fit&quot; dan relevansi background kamu.
                    </p>
                    </div>
                </div>
                </>
            )}

            {isThankYou && (
                <div className="flex items-start space-x-3 p-4 rounded-lg border bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900">
                <Checkbox
                    id="reinforceInterest"
                    checked={formData.includeWhyYou}
                    onCheckedChange={(checked: boolean) => updateFormData({ includeWhyYou: checked })}
                />
                <div className="flex-1">
                    <Label htmlFor="reinforceInterest" className="text-sm font-medium cursor-pointer">
                    Reinforce Interest
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                    Tegaskan kembali ketertarikan dan antusiasme untuk bergabung
                    </p>
                </div>
                </div>
            )}

            {isFollowUp && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2">💡 Tips Follow-Up:</p>
                <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Tetap sopan dan profesional</li>
                    <li>• Jangan terkesan memaksa</li>
                    <li>• Tunjukkan antusiasme yang genuine</li>
                </ul>
                </div>
            )}
            </Card>
        </div>

        {/* Call to Action */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-red-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-red-600" />
                </div>
                <Label className="text-lg font-semibold">Call to Action</Label>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
            {isApplication && CALL_TO_ACTIONS.map((cta) => (
                <div
                key={cta.value}
                onClick={() => updateFormData({ callToAction: cta.value as any })}
                className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.01]",
                    formData.callToAction === cta.value
                    ? "border-[#5547d0] bg-[#5547d0]/5 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-[#5547d0]/30 bg-white dark:bg-slate-950"
                )}
                >
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                    formData.callToAction === cta.value ? "bg-[#5547d0] text-white" : "bg-slate-100 dark:bg-slate-800"
                )}>
                    {cta.icon}
                </div>
                <div className="flex-1">
                    <p className={cn("font-semibold text-sm", formData.callToAction === cta.value ? "text-[#5547d0]" : "text-slate-700 dark:text-slate-300")}>
                        {cta.label}
                    </p>
                </div>
                {formData.callToAction === cta.value && (
                    <div className="w-3 h-3 rounded-full bg-[#5547d0] mr-2" />
                )}
                </div>
            ))}
            
            {/* Simplified logic for other types reusing similar structure if needed */}
            {!isApplication && (
                <Card className="p-6 flex items-center justify-center text-center h-full border-dashed">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Default CTA</p>
                        <p className="text-xs text-slate-400">AI akan memilih CTA yang paling sesuai dengan konteks email ini.</p>
                    </div>
                </Card>
            )}
            </div>
        </div>
      </div>

    </div>
  );
}
