"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  generateReasonSuggestion, 
  generateSkillsSuggestion, 
  generateAchievementSuggestion 
} from "@/actions/whatsapp/suggest";

interface AIFormHelperProps {
  type: 'reason' | 'skills' | 'achievement';
  data: {
    position: string;
    companyName?: string;
    currentRole?: string;
    yearsExperience?: number;
  };
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function AIFormHelper({ type, data, onSelect, disabled }: AIFormHelperProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerate = async () => {
    if (!data.position) {
      toast.error('Isi posisi terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      let result;
      
      if (type === 'reason') {
        if (!data.companyName) {
          toast.error('Isi nama perusahaan terlebih dahulu');
          return;
        }
        result = await generateReasonSuggestion({
          position: data.position,
          companyName: data.companyName
        });
      } else if (type === 'skills') {
        result = await generateSkillsSuggestion({
          position: data.position,
          currentRole: data.currentRole
        });
      } else if (type === 'achievement') {
        result = await generateAchievementSuggestion({
          position: data.position,
          currentRole: data.currentRole,
          yearsExperience: data.yearsExperience
        });
      }

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      if (result?.suggestions && result.suggestions.length > 0) {
        setSuggestions(result.suggestions);
        setShowSuggestions(true);
        toast.success('Saran berhasil di-generate! ✨');
      }
    } catch (error: any) {
      console.error('Error generating suggestion:', error);
      toast.error('Gagal generate saran');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onSelect(suggestion);
    setShowSuggestions(false);
    toast.success('Saran diterapkan!');
  };

  const labels = {
    reason: 'Alasan Tertarik',
    skills: 'Skill Suggestions',
    achievement: 'Achievement Examples'
  };

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleGenerate}
        disabled={loading || disabled || !data.position}
        className="w-full sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-3 w-3 mr-1" />
            AI Suggest {labels[type]}
          </>
        )}
      </Button>

      {showSuggestions && suggestions.length > 0 && (
        <Card className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-purple-900 dark:text-purple-100">
                💡 Pilih salah satu saran:
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestions(false)}
                className="h-6 text-xs"
              >
                Tutup
              </Button>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full text-left p-2 rounded-md bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-700 transition-colors text-sm"
                >
                  <Badge variant="secondary" className="mb-1 text-xs">
                    Option {index + 1}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{suggestion}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
