"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { Card } from "@/components/ui/card";
import { Sparkles, Check, Smile, Paperclip, Megaphone } from "lucide-react";

interface StepReviewProps {
  formData: Partial<WAGenerationData>;
  updateFormData: (updates: Partial<WAGenerationData>) => void;
}

export function StepReview({ formData, updateFormData }: StepReviewProps) {
  const toggles = [
    {
      id: 'useEmoji',
      label: 'Gunakan Emoji',
      desc: 'Menambahkan emoji relevan (🙏, ✨)',
      icon: Smile,
      value: formData.useEmoji
    },
    {
      id: 'includeGreeting',
      label: 'Salam Pembuka',
      desc: 'Contoh: Selamat pagi, Assalamu\'alaikum',
      icon: Megaphone, // used as a proxy for "Greeting"
      value: formData.includeGreeting
    },
    {
      id: 'includeIntro',
      label: 'Perkenalan Diri',
      desc: 'Kalimat singkat siapa Anda',
      icon: Check,
      value: formData.includeIntro
    },
    {
      id: 'attachmentMention',
      label: 'Mention Attachment',
      desc: 'Sebutkan lampiran CV/Portofolio',
      icon: Paperclip,
      value: formData.attachmentMention
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-6 w-6 text-yellow-300" />
          <h3 className="text-xl font-bold">Ready to Generate!</h3>
        </div>
        <p className="text-purple-100 text-sm leading-relaxed">
          AI akan membuatkan pesan <strong>{formData.messageType?.replace('_', ' ')}</strong> yang 
          <strong> {formData.toneStyle}</strong> untuk posisi <strong>{formData.position}</strong> di <strong>{formData.companyName}</strong>.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Final Polish</Label>
        
        <div className="grid gap-3">
          {toggles.map((toggle) => (
            <Card 
              key={toggle.id}
              className="p-4 flex flex-row items-center justify-between hover:bg-secondary/50 transition-colors gap-4"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                <div className="bg-primary/10 p-2 rounded-full shrink-0 mt-0.5">
                  <toggle.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{toggle.label}</div>
                  <div className="text-xs text-muted-foreground leading-tight line-clamp-2">{toggle.desc}</div>
                </div>
              </div>
              <Switch
                checked={toggle.value}
                onCheckedChange={(checked) => updateFormData({ [toggle.id]: checked })}
                className="shrink-0"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
