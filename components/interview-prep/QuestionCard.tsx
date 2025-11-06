"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Check, 
  AlertCircle, 
  Lightbulb, 
  CheckCircle2,
  Circle
} from "lucide-react";
import type { InterviewQuestion } from "@/types/interview-prep";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
  isPrepared: boolean;
  onTogglePrepared: () => void;
}

export function QuestionCard({ 
  question, 
  index, 
  isPrepared,
  onTogglePrepared,
}: QuestionCardProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = async (text: string, tab: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedTab(tab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300';
      default: return '';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'opening': return '📋';
      case 'technical': return '🔧';
      case 'behavioral': return '💡';
      case 'situational': return '🎯';
      case 'tricky': return '⚠️';
      case 'closing': return '❓';
      default: return '❓';
    }
  };

  const showSTAR = (question.category === 'behavioral' || question.category === 'situational') && question.star_answer;

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      isPrepared && "border-green-500 bg-green-50/50 dark:bg-green-900/10"
    )}>
      <CardHeader className="space-y-3 pb-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl">{getCategoryIcon(question.category)}</span>
              <Badge variant="outline" className="capitalize">
                {question.category}
              </Badge>
              <Badge className={getPriorityColor(question.priority)} variant="outline">
                {question.priority === 'high' && '🔥'} {question.priority.toUpperCase()}
              </Badge>
            </div>
            
            <h3 className="text-lg font-semibold leading-tight">
              P{index + 1}: {question.question}
            </h3>
          </div>

          {/* Prepared Checkbox */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePrepared}
            className={cn(
              "flex-shrink-0",
              isPrepared && "text-green-600 hover:text-green-700"
            )}
            title={isPrepared ? "Sudah siap" : "Tandai sudah siap"}
          >
            {isPrepared ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Circle className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Reasoning */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                💡 Kenapa pertanyaan ini penting:
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {question.reasoning}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Answer Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className={cn(
            "grid w-full",
            showSTAR ? "grid-cols-2" : "grid-cols-1"
          )}>
            <TabsTrigger value="basic">Jawaban Singkat</TabsTrigger>
            {showSTAR && (
              <TabsTrigger value="star">⭐ Metode STAR</TabsTrigger>
            )}
          </TabsList>

            {/* Basic Answer */}
            <TabsContent value="basic" className="space-y-3">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2 text-muted-foreground">
                  Jawaban Singkat (60-80 kata):
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {question.basic_answer || question.answers?.basic || 'Tidak ada jawaban'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(question.basic_answer || question.answers?.basic || '', 'basic')}
                className="w-full"
              >
                {copiedTab === 'basic' ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Salin Jawaban
                  </>
                )}
              </Button>
            </TabsContent>

          {/* STAR Method Answer */}
          {showSTAR && (
            <TabsContent value="star" className="space-y-3">
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-3">
                    ⭐ Metode STAR (Situasi → Tugas → Aksi → Hasil)
                  </p>
                  
                  <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed whitespace-pre-wrap">
                    {question.star_answer || question.answers?.star?.full || 'Tidak ada jawaban STAR'}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(question.star_answer || question.answers?.star?.full || '', 'star')}
                  className="w-full"
                >
                  {copiedTab === 'star' ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Salin Jawaban STAR
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Tips */}
        {question.tips && question.tips.length > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">
              💡 Tips & Yang Harus/Jangan Dilakukan:
            </p>
            <ul className="space-y-1">
              {question.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-green-800 dark:text-green-200">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Red Flags */}
        {question.red_flags && question.red_flags.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                  🚫 Hindari Hal Ini:
                </p>
                <ul className="space-y-1">
                  {question.red_flags.map((flag, idx) => (
                    <li key={idx} className="text-sm text-red-800 dark:text-red-200">
                      • {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
