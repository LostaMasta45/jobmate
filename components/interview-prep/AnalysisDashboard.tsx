"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import type { InterviewPrepSession } from "@/types/interview-prep";

interface AnalysisDashboardProps {
  session: InterviewPrepSession;
}

export function AnalysisDashboard({ session }: AnalysisDashboardProps) {
  const { match_score, strengths, gaps, question_stats, questions } = session;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Kecocokan Sempurna!";
    if (score >= 60) return "Kecocokan Baik";
    return "Ada Beberapa Gap";
  };

  return (
    <div className="space-y-6">
      {/* Match Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            🎯 Hasil Analisis AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Skor Kecocokan</span>
              <span className={`text-2xl font-bold ${getScoreColor(match_score)}`}>
                {match_score}%
              </span>
            </div>
            <Progress value={match_score} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {getScoreLabel(match_score)}
            </p>
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <h4 className="font-semibold">✅ Kekuatan ({strengths.length})</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengths.map((strength, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Gaps */}
          {gaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h4 className="font-semibold">⚠️ Gap / Kekurangan ({gaps.length})</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {gaps.map((gap, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    {gap}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Question Stats */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Pertanyaan yang Dihasilkan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">Total Pertanyaan:</span>
              <span className="text-2xl font-bold text-primary">{questions.length}</span>
            </div>

            <div className="space-y-2 pt-2 border-t">
              <QuestionStat icon="📋" label="Pembukaan" count={question_stats.opening} />
              <QuestionStat 
                icon="🔧" 
                label="Teknis" 
                count={question_stats.technical}
                highPriority={questions.filter(q => q.category === 'technical' && q.priority === 'high').length}
              />
              <QuestionStat icon="💡" label="Behavioral" count={question_stats.behavioral} />
              <QuestionStat icon="🎯" label="Situasional" count={question_stats.situational} />
              <QuestionStat icon="⚠️" label="Jebakan" count={question_stats.tricky} />
              <QuestionStat icon="❓" label="Penutup" count={question_stats.closing} />
            </div>

            <div className="pt-4 border-t">
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <p className="font-semibold text-red-900 dark:text-red-100">
                      Harus Disiapkan: {question_stats.high_priority} pertanyaan prioritas tinggi
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Fokus pada ini dulu! Pertanyaan ini mengatasi gap dan skill kritikal Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionStat({ 
  icon, 
  label, 
  count, 
  highPriority 
}: { 
  icon: string; 
  label: string; 
  count: number; 
  highPriority?: number;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm">{label}:</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">{count} pertanyaan</span>
        {highPriority !== undefined && highPriority > 0 && (
          <Badge variant="destructive" className="text-xs">
            {highPriority} prioritas tinggi
          </Badge>
        )}
      </div>
    </div>
  );
}
