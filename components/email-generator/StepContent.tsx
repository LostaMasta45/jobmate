"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmailFormData } from "./types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, Trophy, Target, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
    <div className="space-y-6">
      {/* Email Type Context Banner */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {isApplication && '📧'}
            {isFollowUp && '📬'}
            {isThankYou && '🙏'}
            {isInquiry && '❓'}
          </span>
          <div>
            <p className="font-semibold text-sm">
              {isApplication && 'Konten untuk Email Lamaran'}
              {isFollowUp && 'Konten untuk Follow-up Email'}
              {isThankYou && 'Konten untuk Thank You Email'}
              {isInquiry && 'Konten untuk Job Inquiry'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isApplication && 'Tunjukkan skill dan pencapaian terbaik kamu'}
              {isFollowUp && 'Reminder sopan tanpa terkesan memaksa'}
              {isThankYou && 'Ucapkan terima kasih dan reinforce interest'}
              {isInquiry && 'Tunjukkan ketertarikan dan value proposition'}
            </p>
          </div>
        </div>
      </div>

      {/* Highlight Skills - For application and inquiry only */}
      {(isApplication || isInquiry) && (
        <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800">
        <div className="space-y-3">
          <Label className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#5547d0]" />
            Keahlian & Skills
          </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Tambahkan 3-5 skill yang paling relevan dengan posisi
        </p>
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-11"
            />
            <Button
              type="button"
              onClick={() => addSkill(skillInput)}
              disabled={!skillInput.trim() || formData.highlightSkills.length >= 10}
              className="h-11 px-6 bg-[#5547d0] hover:bg-[#4538b0] w-full sm:w-auto"
            >
              Tambah
            </Button>
          </div>

          {/* Skills List */}
          {formData.highlightSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.highlightSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground text-right">
            {formData.highlightSkills.length}/10 skills ditambahkan
          </p>
        </div>
      </div>
      </Card>
      )}

      {/* Specific Topics for Thank You Email */}
      {isThankYou && (
        <div className="space-y-3">
          <Label htmlFor="specificTopics" className="text-base font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Topik Spesifik yang Dibahas (Optional)
          </Label>
          <Textarea
            id="specificTopics"
            placeholder="e.g. Diskusi tentang tech stack React, project timeline, team culture, dll"
            value={formData.specificTopics || ''}
            onChange={(e: any) => updateFormData({ specificTopics: e.target.value })}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            Sebutkan hal spesifik yang dibahas saat interview untuk personalisasi email
          </p>
        </div>
      )}

      {/* Achievements - Only for application */}
      {isApplication && (
        <Card className="p-5 border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <Label htmlFor="achievements" className="text-lg font-semibold flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Pencapaian / Project Highlight
          </Label>
          <Textarea
            id="achievements"
            placeholder="e.g. Led a team of 5 developers, increased performance by 40%, launched 3 successful products..."
            value={formData.achievements || ''}
            onChange={(e) => updateFormData({ achievements: e.target.value })}
            rows={4}
            className="resize-none focus:ring-[#5547d0]/20"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
            <Info className="h-3 w-3" />
            Sebutkan 1-2 pencapaian terbaik yang relevan dengan posisi
          </p>
        </div>
        </Card>
      )}

      {/* Content Options - Conditional per email type */}
      <Card className="p-5 border-slate-200 dark:border-slate-800">
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Konten Tambahan
        </Label>
        
        <div className="space-y-3">
          {/* For application and inquiry */}
          {(isApplication || isInquiry) && (
            <>
              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => updateFormData({ includeWhyCompany: !formData.includeWhyCompany })}>
                <Checkbox
                  id="includeWhyCompany"
                  checked={formData.includeWhyCompany}
                  onCheckedChange={(checked: boolean) =>
                    updateFormData({ includeWhyCompany: checked })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="includeWhyCompany" className="font-medium cursor-pointer">
                    Jelaskan kenapa tertarik ke perusahaan ini
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI akan generate alasan mengapa kamu tertarik join {formData.companyName || 'perusahaan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => updateFormData({ includeWhyYou: !formData.includeWhyYou })}>
                <Checkbox
                  id="includeWhyYou"
                  checked={formData.includeWhyYou}
                  onCheckedChange={(checked: boolean) =>
                    updateFormData({ includeWhyYou: checked })
                  }
                />
                <div className="flex-1">
                  <Label htmlFor="includeWhyYou" className="font-medium cursor-pointer">
                    Jelaskan kenapa kamu cocok untuk posisi ini
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    AI akan explain mengapa background kamu match dengan requirement
                  </p>
                </div>
              </div>
            </>
          )}

          {/* For thank you - Show continued interest */}
          {isThankYou && (
            <div className="flex items-start space-x-3 p-4 rounded-lg border bg-green-50 dark:bg-green-950">
              <Checkbox
                id="reinforceInterest"
                checked={formData.includeWhyYou}
                onCheckedChange={(checked: boolean) => updateFormData({ includeWhyYou: checked })}
              />
              <div className="flex-1">
                <Label htmlFor="reinforceInterest" className="text-sm font-medium cursor-pointer">
                  Reinforce Interest & Enthusiasm
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Tegaskan kembali ketertarikan dan antusiasme untuk bergabung
                </p>
              </div>
            </div>
          )}

          {/* For follow-up - Polite reminder */}
          {isFollowUp && (
            <div className="p-4 rounded-lg border bg-amber-50 dark:bg-amber-950">
              <p className="text-sm font-medium mb-2">💡 Follow-up Email Tips:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Tetap sopan dan profesional</li>
                <li>• Jangan terkesan memaksa atau terburu-buru</li>
                <li>• Tunjukkan antusiasme yang genuine</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      </Card>

      {/* Call to Action - Dynamic based on email type */}
      <Card className="p-4 md:p-5 border-slate-200 dark:border-slate-800">
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2">
          <Target className="h-5 w-5 text-red-500" />
          Apa yang Kamu Harapkan?
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {isApplication && CALL_TO_ACTIONS.map((cta) => (
            <label
              key={cta.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                formData.callToAction === cta.value
                  ? 'border-[#5547d0] bg-[#5547d0]/5 ring-1 ring-[#5547d0]'
                  : 'border-border hover:border-[#5547d0]/50'
              }`}
            >
              <input
                type="radio"
                name="callToAction"
                value={cta.value}
                checked={formData.callToAction === cta.value}
                onChange={() => updateFormData({ callToAction: cta.value as any })}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cta.icon}</span>
                <span className={`font-medium text-sm ${formData.callToAction === cta.value ? 'text-[#5547d0] font-bold' : ''}`}>{cta.label}</span>
              </div>
            </label>
          ))}
          
          {isFollowUp && [
            { value: 'interview', label: 'Tanyakan Status', icon: '📊' },
            { value: 'meeting', label: 'Request Update', icon: '📅' },
          ].map((cta) => (
            <label
              key={cta.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                formData.callToAction === cta.value
                  ? 'border-[#5547d0] bg-[#5547d0]/5 ring-1 ring-[#5547d0]'
                  : 'border-border hover:border-[#5547d0]/50'
              }`}
            >
              <input
                type="radio"
                name="callToAction"
                value={cta.value}
                checked={formData.callToAction === cta.value}
                onChange={() => updateFormData({ callToAction: cta.value as any })}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cta.icon}</span>
                <span className={`font-medium text-sm ${formData.callToAction === cta.value ? 'text-[#5547d0] font-bold' : ''}`}>{cta.label}</span>
              </div>
            </label>
          ))}
          
          {isThankYou && [
            { value: 'interview', label: 'Express Interest', icon: '⭐' },
            { value: 'discussion', label: 'Await Feedback', icon: '⏳' },
          ].map((cta) => (
            <label
              key={cta.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                formData.callToAction === cta.value
                  ? 'border-[#5547d0] bg-[#5547d0]/5 ring-1 ring-[#5547d0]'
                  : 'border-border hover:border-[#5547d0]/50'
              }`}
            >
              <input
                type="radio"
                name="callToAction"
                value={cta.value}
                checked={formData.callToAction === cta.value}
                onChange={() => updateFormData({ callToAction: cta.value as any })}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cta.icon}</span>
                <span className={`font-medium text-sm ${formData.callToAction === cta.value ? 'text-[#5547d0] font-bold' : ''}`}>{cta.label}</span>
              </div>
            </label>
          ))}
          
          {isInquiry && [
            { value: 'meeting', label: 'Request Meeting', icon: '☕' },
            { value: 'discussion', label: 'Request Discussion', icon: '💬' },
          ].map((cta) => (
            <label
              key={cta.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                formData.callToAction === cta.value
                  ? 'border-[#5547d0] bg-[#5547d0]/5 ring-1 ring-[#5547d0]'
                  : 'border-border hover:border-[#5547d0]/50'
              }`}
            >
              <input
                type="radio"
                name="callToAction"
                value={cta.value}
                checked={formData.callToAction === cta.value}
                onChange={() => updateFormData({ callToAction: cta.value as any })}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cta.icon}</span>
                <span className={`font-medium text-sm ${formData.callToAction === cta.value ? 'text-[#5547d0] font-bold' : ''}`}>{cta.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
      </Card>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <p className="font-medium text-sm text-green-900 mb-2">Siap Generate Email!</p>
            <p className="text-sm text-green-800">
              Klik &quot;Generate Email&quot; di bawah untuk membuat email profesional dengan AI
              berdasarkan informasi yang kamu berikan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
