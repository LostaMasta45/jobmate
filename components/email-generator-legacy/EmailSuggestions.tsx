"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, AlertCircle, CheckCircle2, Lightbulb, TrendingUp } from "lucide-react";
import { analyzeEmailQuality, EmailQualityScore, getScoreColor, getScoreLabel } from "@/lib/emailQuality";
import { EmailFormData } from "./types";
import { cn } from "@/lib/utils";

interface EmailSuggestionsProps {
  email: string;
  formData: EmailFormData;
  className?: string;
}

export function EmailSuggestions({ email, formData, className }: EmailSuggestionsProps) {
  const [analysis, setAnalysis] = useState<EmailQualityScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Debounced analysis
  useEffect(() => {
    if (!email || email.length < 50) {
      setAnalysis(null);
      return;
    }

    setIsAnalyzing(true);
    const timeoutId = setTimeout(() => {
      const result = analyzeEmailQuality(email, {
        companyName: formData.companyName || '',
        position: formData.position || '',
        yourName: formData.yourName || '',
        toneStyle: formData.toneStyle || 'semi-formal',
        emailType: formData.emailType || 'application',
        hasSkills: (formData.highlightSkills?.length || 0) > 0,
        hasAchievements: !!formData.achievements,
      });
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [email, formData]);

  if (!email || email.length < 50) {
    return null;
  }

  if (isAnalyzing) {
    return (
      <Card className={cn("p-4 animate-pulse", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-spin" />
          <span className="text-sm">Menganalisis email...</span>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const scoreColor = getScoreColor(analysis.overall);
  const scoreLabel = getScoreLabel(analysis.overall);

  return (
    <Card className={cn("p-4 space-y-4 bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-blue-950/30", className)}>
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#5547d0]" />
          <h3 className="font-semibold text-sm">AI Quality Analysis</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-2xl font-bold", scoreColor)}>
            {analysis.overall}
          </span>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">/100</span>
            <Badge 
              variant={analysis.overall >= 80 ? "default" : analysis.overall >= 60 ? "secondary" : "destructive"}
              className="ml-2 text-xs"
            >
              {scoreLabel}
            </Badge>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-5 gap-2">
        {Object.entries(analysis.breakdown).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-[10px] text-muted-foreground capitalize mb-1">
              {key === 'callToAction' ? 'CTA' : key.slice(0, 6)}
            </div>
            <Progress 
              value={value} 
              className="h-1.5 mb-1"
            />
            <div className={cn(
              "text-xs font-semibold",
              value >= 80 ? 'text-green-600' : value >= 60 ? 'text-amber-600' : 'text-red-600'
            )}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Kelebihan
          </h4>
          <ul className="space-y-1">
            {analysis.strengths.map((s, i) => (
              <li key={i} className="text-xs text-green-700 dark:text-green-400 flex items-start gap-2 pl-1">
                <span className="text-green-500">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Perlu Diperbaiki
          </h4>
          <ul className="space-y-1">
            {analysis.warnings.map((w, i) => (
              <li key={i} className="text-xs text-red-700 dark:text-red-400 flex items-start gap-2 pl-1">
                <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Saran Improvement
          </h4>
          <ul className="space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2 pl-1">
                <TrendingUp className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
