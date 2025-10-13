"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmailFormData } from "./EmailWizard";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
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
      {/* Highlight Skills */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          ⭐ Keahlian yang Ingin Di-highlight
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Tambahkan 3-5 skill yang paling relevan dengan posisi
        </p>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. React, TypeScript, Node.js"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm"
            />
            <button
              type="button"
              onClick={() => addSkill(skillInput)}
              disabled={!skillInput.trim() || formData.highlightSkills.length >= 10}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tambah
            </button>
          </div>

          {/* Skills List */}
          {formData.highlightSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.highlightSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            {formData.highlightSkills.length}/10 skills ditambahkan
          </p>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-2">
        <Label htmlFor="achievements" className="text-base font-semibold">
          🏆 Pencapaian / Project Highlight (Optional)
        </Label>
        <Textarea
          id="achievements"
          placeholder="e.g. Led a team of 5 developers, increased performance by 40%, launched 3 successful products..."
          value={formData.achievements || ''}
          onChange={(e) => updateFormData({ achievements: e.target.value })}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Sebutkan 1-2 pencapaian terbaik yang relevan dengan posisi
        </p>
      </div>

      <hr />

      {/* Content Options */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Konten yang Disertakan</Label>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg border">
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

          <div className="flex items-start space-x-3 p-3 rounded-lg border">
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
        </div>
      </div>

      <hr />

      {/* Call to Action */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">📞 Apa yang Kamu Harapkan?</Label>
        <RadioGroup
          value={formData.callToAction}
          onValueChange={(value: any) => updateFormData({ callToAction: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {CALL_TO_ACTIONS.map((cta) => (
            <label
              key={cta.value}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.callToAction === cta.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value={cta.value} />
              <div className="flex items-center gap-2">
                <span className="text-xl">{cta.icon}</span>
                <span className="font-medium text-sm">{cta.label}</span>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

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
