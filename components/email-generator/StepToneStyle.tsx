"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmailFormData } from "./types";
import { Sparkles, SlidersHorizontal, Building2, Palette, User2, Scale, Zap } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { detectCompanyType, suggestToneForCompany, CompanyType, EtiquetteTone } from "@/lib/indonesianEtiquette";
import { cn } from "@/lib/utils";

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
    gradient: 'from-slate-500 to-slate-700',
    borderColor: 'border-slate-200 dark:border-slate-700',
    bgHover: 'hover:bg-slate-50 dark:hover:bg-slate-900',
    selectedRing: 'ring-slate-600',
    textColor: 'text-slate-700'
  },
  {
    value: 'semi-formal',
    icon: '💼',
    label: 'Semi-Formal',
    desc: 'Tech Companies, Professional',
    example: '"I am excited to apply my skills..."',
    gradient: 'from-blue-500 to-blue-700',
    borderColor: 'border-blue-200 dark:border-blue-700',
    bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-950',
    selectedRing: 'ring-blue-600',
    textColor: 'text-blue-700'
  },
  {
    value: 'casual',
    icon: '👕',
    label: 'Casual',
    desc: 'Startups, Creative Teams',
    example: '"I\'d love to join your team..."',
    gradient: 'from-cyan-500 to-cyan-700',
    borderColor: 'border-cyan-200 dark:border-cyan-700',
    bgHover: 'hover:bg-cyan-50 dark:hover:bg-cyan-950',
    selectedRing: 'ring-cyan-600',
    textColor: 'text-cyan-700'
  },
  {
    value: 'creative',
    icon: '🎨',
    label: 'Creative',
    desc: 'Design Agencies, Creative Roles',
    example: '"Let\'s create something amazing..."',
    gradient: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-200 dark:border-purple-700',
    bgHover: 'hover:bg-purple-50 dark:hover:bg-purple-950',
    selectedRing: 'ring-purple-600',
    textColor: 'text-purple-700'
  },
];

const PERSONALITIES = [
  {
    value: 'confident',
    label: 'Percaya Diri',
    desc: 'Assertive dan yakin',
    example: 'Saya yakin dapat berkontribusi...',
    icon: '💪',
    color: 'text-orange-600'
  },
  {
    value: 'balanced',
    label: 'Seimbang',
    desc: 'Professional dan personable',
    example: 'Saya tertarik dan memiliki...',
    icon: '⚖️',
    color: 'text-blue-600'
  },
  {
    value: 'enthusiastic',
    label: 'Antusias',
    desc: 'Excited dan passionate',
    example: 'Saya sangat excited untuk...',
    icon: '🌟',
    color: 'text-yellow-600'
  },
  {
    value: 'humble',
    label: 'Rendah Hati',
    desc: 'Modest dan respectful',
    example: 'Saya berharap dapat belajar...',
    icon: '🙏',
    color: 'text-green-600'
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
  // Initialize tone settings with defaults based on personality selection
  const [toneSettings, setToneSettings] = useState({
    formality: formData.toneSettings?.formality ?? 5,
    confidence: formData.toneSettings?.confidence ?? 5,
    enthusiasm: formData.toneSettings?.enthusiasm ?? 5,
  });

  const [detectedType, setDetectedType] = useState<CompanyType>('unknown');
  const [suggestedTone, setSuggestedTone] = useState<EtiquetteTone | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  // Detect company type and suggest tone
  useEffect(() => {
    if (formData.companyName) {
      const type = detectCompanyType(formData.companyName);
      setDetectedType(type);
      
      if (type !== 'unknown') {
        const tone = suggestToneForCompany(type);
        setSuggestedTone(tone);
        // Show suggestion if current tone doesn't match suggestion
        if (formData.toneStyle !== tone) {
            setShowSuggestion(true);
        } else {
            setShowSuggestion(false);
        }
      } else {
        setShowSuggestion(false);
      }
    }
  }, [formData.companyName, formData.toneStyle]);

  const applySuggestion = () => {
    if (suggestedTone) {
      // Map etiquette tone to form data tone
      const mappedTone = suggestedTone === 'semiformal' ? 'semi-formal' : suggestedTone;
      updateFormData({ toneStyle: mappedTone });
      setShowSuggestion(false);
    }
  };

  // Auto-adjust sliders based on personality selection
  useEffect(() => {
    const presets: Record<string, { formality: number; confidence: number; enthusiasm: number }> = {
      confident: { formality: 6, confidence: 8, enthusiasm: 6 },
      humble: { formality: 7, confidence: 3, enthusiasm: 5 },
      enthusiastic: { formality: 4, confidence: 6, enthusiasm: 9 },
      balanced: { formality: 5, confidence: 5, enthusiasm: 5 },
    };
    
    if (formData.personality && presets[formData.personality]) {
      setToneSettings(presets[formData.personality]);
      updateFormData({ toneSettings: presets[formData.personality] });
    }
  }, [formData.personality]);

  // Auto-adjust formality based on tone style
  useEffect(() => {
    const formalityPresets: Record<string, number> = {
      formal: 9,
      'semi-formal': 6,
      casual: 3,
      creative: 4,
    };
    
    if (formData.toneStyle && formalityPresets[formData.toneStyle]) {
      setToneSettings(prev => {
          const updated = { ...prev, formality: formalityPresets[formData.toneStyle] };
          updateFormData({ toneSettings: updated });
          return updated;
      });
    }
  }, [formData.toneStyle]);

  // Helper to update individual slider
  const handleSliderChange = (key: keyof typeof toneSettings, value: number) => {
      const newSettings = { ...toneSettings, [key]: value };
      setToneSettings(newSettings);
      updateFormData({ toneSettings: newSettings });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* AI Suggestion Banner - Floating if active */}
      {showSuggestion && suggestedTone && (
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm backdrop-blur-sm">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Terdeteksi: Perusahaan {detectedType === 'bank' ? 'Perbankan' : 
                                      detectedType === 'government' ? 'Pemerintahan/BUMN' :
                                      detectedType === 'startup' ? 'Startup' :
                                      detectedType === 'agency' ? 'Creative Agency' :
                                      detectedType === 'corporate' ? 'Korporat' : 
                                      detectedType === 'multinational' ? 'Multinational' : 'Unknown'}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Disarankan menggunakan tone <strong>{
                  suggestedTone === 'formal' ? 'Formal' :
                  suggestedTone === 'semiformal' ? 'Semi-Formal' : 'Casual'
                }</strong> untuk industri ini agar terlihat lebih profesional.
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm"
              onClick={applySuggestion}
            >
              Apply Suggestion
            </Button>
          </div>
        )}

      {/* Tone Style Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <Label className="text-lg font-semibold">Gaya Bahasa (Tone)</Label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TONE_STYLES.map((style) => (
            <div
              key={style.value}
              onClick={() => updateFormData({ toneStyle: style.value as any })}
              className={cn(
                  "relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer group h-full flex flex-col",
                  style.bgHover,
                  formData.toneStyle === style.value
                    ? cn("shadow-lg scale-[1.02]", style.borderColor, style.selectedRing, "ring-1 border-transparent bg-white dark:bg-slate-900")
                    : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              {/* Selection Check */}
              {formData.toneStyle === style.value && (
                  <div className="absolute top-3 right-3">
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm", `bg-gradient-to-br ${style.gradient}`)}>
                      <span className="text-xs font-bold">✓</span>
                    </div>
                  </div>
              )}

              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{style.icon}</div>
              
              <div className="space-y-2 flex-1">
                <h3 className={cn("font-bold text-lg", formData.toneStyle === style.value ? style.textColor : "text-slate-800 dark:text-slate-200")}>
                    {style.label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed min-h-[2.5em]">
                    {style.desc}
                </p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
                <div className="text-[10px] italic text-muted-foreground bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg">
                  {style.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personality Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                    <User2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <Label className="text-lg font-semibold">Kepribadian</Label>
            </div>
            
            <RadioGroup
            value={formData.personality}
            onValueChange={(value: any) => updateFormData({ personality: value })}
            className="grid grid-cols-1 gap-3"
            >
            {PERSONALITIES.map((personality) => (
                <label
                key={personality.value}
                className={cn(
                    "flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900",
                    formData.personality === personality.value
                    ? "border-orange-500/50 bg-orange-50/50 dark:bg-orange-950/20 ring-1 ring-orange-500/20"
                    : "border-slate-200 dark:border-slate-800"
                )}
                >
                <RadioGroupItem value={personality.value} className="hidden" />
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm text-xl border border-slate-100 dark:border-slate-700">
                    {personality.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <p className={cn("font-semibold", formData.personality === personality.value ? "text-orange-700 dark:text-orange-400" : "text-slate-700 dark:text-slate-300")}>
                            {personality.label}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground">{personality.desc}</p>
                </div>
                {formData.personality === personality.value && (
                    <div className="w-2 h-2 rounded-full bg-orange-500 mr-2" />
                )}
                </label>
            ))}
            </RadioGroup>
        </div>

        {/* Length & Advanced Tuning */}
        <div className="space-y-6">
            
            {/* Length Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Scale className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <Label className="text-lg font-semibold">Panjang Email</Label>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {LENGTHS.map((length) => (
                        <button
                        key={length.value}
                        onClick={() => updateFormData({ lengthType: length.value as any })}
                        className={cn(
                            "p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900",
                            formData.lengthType === length.value
                            ? "border-green-500/50 bg-green-50/50 dark:bg-green-950/20 ring-1 ring-green-500/20"
                            : "border-slate-200 dark:border-slate-800"
                        )}
                        >
                        <span className="text-2xl">{length.icon}</span>
                        <div>
                            <div className={cn("font-bold text-sm", formData.lengthType === length.value ? "text-green-700 dark:text-green-400" : "")}>{length.label}</div>
                            <div className="text-[10px] text-muted-foreground">{length.paragraphs}</div>
                        </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Fine Tuning Card */}
            <Card className="p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <Label className="font-semibold text-sm">Fine-Tune Parameters</Label>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">Auto-Adjusted</span>
                </div>
                
                <div className="space-y-6">
                    {/* Formality Slider */}
                    <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>Casual</span>
                        <span className="text-slate-900 dark:text-white font-bold">Formality: {toneSettings.formality}</span>
                        <span>Formal</span>
                    </div>
                    <Slider
                        value={[toneSettings.formality]}
                        onValueChange={(v) => handleSliderChange('formality', v[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="cursor-pointer"
                    />
                    </div>

                    {/* Confidence Slider */}
                    <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>Humble</span>
                        <span className="text-slate-900 dark:text-white font-bold">Confidence: {toneSettings.confidence}</span>
                        <span>Bold</span>
                    </div>
                    <Slider
                        value={[toneSettings.confidence]}
                        onValueChange={(v) => handleSliderChange('confidence', v[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="cursor-pointer"
                    />
                    </div>

                    {/* Enthusiasm Slider */}
                    <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-medium text-muted-foreground">
                        <span>Calm</span>
                        <span className="text-slate-900 dark:text-white font-bold">Enthusiasm: {toneSettings.enthusiasm}</span>
                        <span>Excited</span>
                    </div>
                    <Slider
                        value={[toneSettings.enthusiasm]}
                        onValueChange={(v) => handleSliderChange('enthusiasm', v[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="cursor-pointer"
                    />
                    </div>
                </div>
                </div>
            </Card>

        </div>
      </div>

    </div>
  );
}

