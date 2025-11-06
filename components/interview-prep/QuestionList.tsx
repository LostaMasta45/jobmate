"use client";

import React, { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import type { InterviewQuestion } from "@/types/interview-prep";
import { toggleQuestionPrepared } from "@/actions/interview-prep";
import { useRouter } from "next/navigation";

interface QuestionListProps {
  questions: InterviewQuestion[];
  sessionId: string;
  preparedQuestions: string[];
}

export function QuestionList({ 
  questions, 
  sessionId, 
  preparedQuestions: initialPrepared,
}: QuestionListProps) {
  const router = useRouter();
  const [preparedQuestions, setPreparedQuestions] = useState<string[]>(initialPrepared);

  const handleTogglePrepared = async (questionId: string) => {
    // Optimistic update
    setPreparedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );

    // Server update
    const success = await toggleQuestionPrepared(sessionId, questionId);
    
    if (success) {
      router.refresh();
    } else {
      // Revert on error
      setPreparedQuestions(prev => 
        prev.includes(questionId)
          ? [...prev, questionId]
          : prev.filter(id => id !== questionId)
      );
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Tidak ada pertanyaan di kategori ini
      </div>
    );
  }

  // Sort: high priority first, then medium, then low
  const sortedQuestions = [...questions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4 md:space-y-6">
      {sortedQuestions.map((question, index) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={questions.indexOf(question)}
          isPrepared={preparedQuestions.includes(question.id)}
          onTogglePrepared={() => handleTogglePrepared(question.id)}
        />
      ))}
    </div>
  );
}
