"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { AIFormHelper } from "../AIFormHelper";
import { cn } from "@/lib/utils";

interface StepCustomizationProps {
  formData: Partial<WAGenerationData>;
  updateFormData: (updates: Partial<WAGenerationData>) => void;
}

const TONE_STYLES = [
  { value: 'formal', label: 'Formal', desc: 'Sangat sopan, baku' },
  { value: 'semi-formal', label: 'Semi-Formal', desc: 'Profesional tapi luwes (Recommended)' },
  { value: 'friendly', label: 'Friendly', desc: 'Santai, akrab' },
  { value: 'enthusiastic', label: 'Enthusiastic', desc: 'Penuh semangat' },
];

const PERSONALITIES = [
  { value: 'balanced', label: 'Balanced', emoji: '⚖️' },
  { value: 'confident', label: 'Confident', emoji: '😎' },
  { value: 'humble', label: 'Humble', emoji: '🙏' },
];

export function StepCustomization({ formData, updateFormData }: StepCustomizationProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Tone Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Style & Tone</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TONE_STYLES.map((style) => (
            <div
              key={style.value}
              onClick={() => updateFormData({ toneStyle: style.value as any })}
              className={cn(
                "cursor-pointer p-4 rounded-xl border-2 transition-all",
                formData.toneStyle === style.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                  : "border-transparent bg-secondary/50 hover:bg-secondary"
              )}
            >
              <div className="font-bold text-sm mb-1">{style.label}</div>
              <div className="text-xs opacity-80 leading-normal">{style.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personality & Length */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Personality</Label>
          <Select
            value={formData.personality}
            onValueChange={(value) => updateFormData({ personality: value as any })}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERSONALITIES.map(p => (
                <SelectItem key={p.value} value={p.value}>
                  {p.emoji} {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Length</Label>
          <Select
            value={formData.messageLength}
            onValueChange={(value) => updateFormData({ messageLength: value as any })}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short (50-80 kata)</SelectItem>
              <SelectItem value="medium">Medium (80-120)</SelectItem>
              <SelectItem value="long">Long (120-150)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Inputs */}
      <div className="space-y-4 border-t pt-4 border-dashed">
        <div className="space-y-2">
          <Label htmlFor="specificReason">
            Alasan Tertarik (Optional)
          </Label>
          <Textarea
            id="specificReason"
            value={formData.specificReason}
            onChange={(e) => updateFormData({ specificReason: e.target.value })}
            placeholder="Ceritakan ketertarikan spesifik Anda..."
            className="min-h-[80px] resize-none"
          />
          <AIFormHelper
            type="reason"
            data={{
              position: formData.position || '',
              companyName: formData.companyName || ''
            }}
            onSelect={(value) => updateFormData({ specificReason: value })}
            disabled={!formData.position || !formData.companyName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="recentAchievement">
            Achievement Highlight (Optional)
          </Label>
          <Textarea
            id="recentAchievement"
            value={formData.recentAchievement}
            onChange={(e) => updateFormData({ recentAchievement: e.target.value })}
            placeholder="Sebutkan pencapaian terbaik Anda..."
            className="min-h-[80px] resize-none"
          />
          <AIFormHelper
            type="achievement"
            data={{
              position: formData.position || '',
              currentRole: formData.currentRole,
              yearsExperience: formData.yearsExperience
            }}
            onSelect={(value) => updateFormData({ recentAchievement: value })}
            disabled={!formData.position}
          />
        </div>
      </div>
    </div>
  );
}
