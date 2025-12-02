"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmailFormData } from "./types";
import { Sparkles } from "lucide-react";

interface StepToneStyleProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

const TONE_STYLES = [
  {
    value: 'formal',
    icon: '🎩',
    label: 'Formal',
    desc: 'Bank, Government, Corporate',
    example: '"I would be honored to contribute..."',
    gradient: 'from-slate-500 to-slate-700'
  },
  {
    value: 'semi-formal',
    icon: '💼',
    label: 'Semi-Formal',
    desc: 'Tech Companies, Professional',
    example: '"I am excited to apply my skills..."',
    gradient: 'from-blue-500 to-blue-700'
  },
  {
    value: 'casual',
    icon: '👕',
    label: 'Casual',
    desc: 'Startups, Creative Teams',
    example: '"I\'d love to join your team..."',
    gradient: 'from-cyan-500 to-cyan-700'
  },
  {
    value: 'creative',
    icon: '🎨',
    label: 'Creative',
    desc: 'Design Agencies, Creative Roles',
    example: '"Let\'s create something amazing..."',
    gradient: 'from-purple-500 to-purple-700'
  },
];

const PERSONALITIES = [
  {
    value: 'confident',
    label: 'Percaya Diri',
    desc: 'Assertive dan yakin',
    example: 'Saya yakin dapat berkontribusi...',
    icon: '💪'
  },
  {
    value: 'balanced',
    label: 'Seimbang',
    desc: 'Professional dan personable',
    example: 'Saya tertarik dan memiliki...',
    icon: '⚖️'
  },
  {
    value: 'enthusiastic',
    label: 'Antusias',
    desc: 'Excited dan passionate',
    example: 'Saya sangat excited untuk...',
    icon: '🌟'
  },
  {
    value: 'humble',
    label: 'Rendah Hati',
    desc: 'Modest dan respectful',
    example: 'Saya berharap dapat belajar...',
    icon: '🙏'
  },
];

const LENGTHS = [
  {
    value: 'concise',
    label: 'Singkat',
    desc: '150-200 kata',
    paragraphs: '3-4 paragraf',
    icon: '⚡'
  },
  {
    value: 'medium',
    label: 'Sedang',
    desc: '200-300 kata',
    paragraphs: '4-5 paragraf',
    icon: '📝'
  },
  {
    value: 'detailed',
    label: 'Detail',
    desc: '300-400 kata',
    paragraphs: '5-6 paragraf',
    icon: '📄'
  },
];

export function StepToneStyle({ formData, updateFormData }: StepToneStyleProps) {
  return (
    <div className="space-y-8">
      {/* Tone Style */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <Label className="text-lg font-semibold">Pilih Gaya Email</Label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TONE_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => updateFormData({ toneStyle: style.value as any })}
              className={`relative p-5 rounded-xl border-2 text-left transition-all ${
                formData.toneStyle === style.value
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50 hover:shadow-md'
              }`}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-5 rounded-xl`} />
              
              <div className="relative space-y-3">
                <div className="text-4xl mb-2">{style.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{style.label}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{style.desc}</p>
                  <div className="text-xs italic text-primary/70 bg-primary/5 p-2 rounded">
                    {style.example}
                  </div>
                </div>
                
                {formData.toneStyle === style.value && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      ✓
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <hr />

      {/* Personality */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Kepribadian dalam Email</Label>
        <RadioGroup
          value={formData.personality}
          onValueChange={(value: any) => updateFormData({ personality: value })}
          className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:space-y-0"
        >
          {PERSONALITIES.map((personality) => (
            <label
              key={personality.value}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all h-full ${
                formData.personality === personality.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value={personality.value} className="mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl shrink-0">{personality.icon}</span>
                  <p className="font-semibold truncate">{personality.label}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{personality.desc}</p>
                <p className="text-sm italic text-primary/70 line-clamp-1">&quot;{personality.example}&quot;</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      <hr />

      {/* Length */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Panjang Email</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {LENGTHS.map((length) => (
            <button
              key={length.value}
              onClick={() => updateFormData({ lengthType: length.value as any })}
              className={`p-5 rounded-lg border-2 text-center transition-all ${
                formData.lengthType === length.value
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-3xl mb-3">{length.icon}</div>
              <h3 className="font-bold mb-1">{length.label}</h3>
              <p className="text-sm text-muted-foreground mb-1">{length.desc}</p>
              <p className="text-xs text-muted-foreground">{length.paragraphs}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tips Card */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
        <div className="flex gap-3">
          <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-blue-900 mb-2">💡 Tips Memilih Tone & Style:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Formal</strong>: Bank, pemerintahan, perusahaan tradisional</li>
              <li>• <strong>Semi-Formal</strong>: Tech companies, korporat modern</li>
              <li>• <strong>Casual</strong>: Startup, industri kreatif</li>
              <li>• <strong>Creative</strong>: Agency desain, posisi kreatif</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
