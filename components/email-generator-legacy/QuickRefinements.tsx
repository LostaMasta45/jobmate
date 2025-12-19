"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickRefinementsProps {
  currentEmail: string;
  onRefine: (refinedEmail: string) => void;
  className?: string;
  disabled?: boolean;
}

const QUICK_REFINEMENTS = [
  {
    id: 'confident',
    label: 'More Confident',
    icon: '💪',
    description: 'Buat lebih percaya diri',
    prompt: 'Rewrite this email to sound more confident and assertive, while maintaining professionalism. Use stronger action verbs and be more direct about achievements.'
  },
  {
    id: 'humble',
    label: 'More Humble',
    icon: '🙏',
    description: 'Buat lebih rendah hati',
    prompt: 'Rewrite this email to sound more humble and respectful, while still conveying competence. Soften any overly bold statements.'
  },
  {
    id: 'shorter',
    label: 'Shorter',
    icon: '✂️',
    description: 'Persingkat 30%',
    prompt: 'Make this email 30% shorter while keeping all key points. Remove redundant phrases and be more concise.'
  },
  {
    id: 'numbers',
    label: 'Add Numbers',
    icon: '📊',
    description: 'Tambah metrics',
    prompt: 'Add more specific numbers, metrics, and quantifiable achievements to this email. If exact numbers are not available, use reasonable estimates with phrases like "approximately" or "around".'
  },
  {
    id: 'personal',
    label: 'More Personal',
    icon: '❤️',
    description: 'Lebih personal',
    prompt: 'Make this email more personal and less corporate. Add more warmth and genuine personality while keeping it professional.'
  },
  {
    id: 'fix_ai',
    label: 'Fix AI-speak',
    icon: '🤖',
    description: 'Hapus kesan AI',
    prompt: 'Remove any phrases that sound AI-generated (like "I am writing to express", "passionate about", "furthermore", "moreover"). Make the email sound more natural and human, like a real person wrote it. Vary sentence lengths and add some natural imperfections.'
  },
];

export function QuickRefinements({ currentEmail, onRefine, className, disabled }: QuickRefinementsProps) {
  const [refining, setRefining] = useState<string | null>(null);

  const handleRefine = async (refinement: typeof QUICK_REFINEMENTS[0]) => {
    if (!currentEmail || currentEmail.length < 50) {
      toast.error("Email terlalu pendek untuk di-refine");
      return;
    }

    setRefining(refinement.id);

    try {
      const response = await fetch('/api/email/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentEmail,
          instruction: refinement.prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine email');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      onRefine(data.refinedEmail);
      toast.success(`Email berhasil di-refine: ${refinement.label}`);
    } catch (error: any) {
      console.error('Refine error:', error);
      toast.error(error.message || "Gagal refine email");
    } finally {
      setRefining(null);
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="h-4 w-4 text-[#5547d0]" />
        <h3 className="font-semibold text-sm">Quick Refinements</h3>
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        One-click AI improvements untuk email kamu
      </p>

      <div className="flex flex-wrap gap-2">
        {QUICK_REFINEMENTS.map((r) => (
          <Button
            key={r.id}
            size="sm"
            variant="outline"
            className={cn(
              "text-xs h-8 gap-1.5 transition-all hover:scale-105",
              refining === r.id && "opacity-70"
            )}
            onClick={() => handleRefine(r)}
            disabled={disabled || refining !== null}
            title={r.description}
          >
            {refining === r.id ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <span>{r.icon}</span>
            )}
            {r.label}
          </Button>
        ))}
      </div>

      <p className="text-[10px] text-muted-foreground mt-3 italic">
        Tips: Gunakan "Fix AI-speak" jika email terasa terlalu formal/robot
      </p>
    </Card>
  );
}
