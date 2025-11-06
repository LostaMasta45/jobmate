import React from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getInterviewPrepSession } from "@/actions/interview-prep";
import { AnalysisDashboard } from "@/components/interview-prep/AnalysisDashboard";
import { QuestionList } from "@/components/interview-prep/QuestionList";
import { ExportPDFButton } from "@/components/interview-prep/ExportPDFButton";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewPrepSessionPage({ params }: PageProps) {
  const { id } = await params;
  
  // Check access - VIP PREMIUM only
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';
  
  // Only VIP PREMIUM can access (not VIP BASIC)
  // VIP BASIC hanya bisa akses Portal Job (/vip), tidak bisa tools JobMate
  if (profile?.membership !== 'vip_premium' && !isAdmin) {
    redirect('/vip?error=premium_only');
  }

  const session = await getInterviewPrepSession(id);

  if (!session) {
    notFound();
  }

  const { questions, question_stats } = session;

  const categories = [
    { id: 'opening', label: '📋 Pembukaan', count: question_stats.opening },
    { id: 'technical', label: '🔧 Teknis', count: question_stats.technical },
    { id: 'behavioral', label: '💡 Behavioral', count: question_stats.behavioral },
    { id: 'situational', label: '🎯 Situasional', count: question_stats.situational },
    { id: 'tricky', label: '⚠️ Jebakan', count: question_stats.tricky },
    { id: 'closing', label: '❓ Penutup', count: question_stats.closing },
  ];

  return (
    <AppShell isAdmin={isAdmin}>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <Link href="/tools/interview-prep">
              <Button variant="ghost" size="sm" className="mb-2 -ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
            </Link>
            <PageHeader
              title={`Interview Prep: ${session.position}`}
              description={`${session.company_name}`}
            />
            <div className="flex items-center gap-2 flex-wrap mt-2">
              <span className="text-sm text-muted-foreground">
                Dibuat {new Date(session.created_at).toLocaleDateString('id-ID')}
              </span>
              {session.preparation_progress > 0 && (
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {Math.round(session.preparation_progress)}% Siap
                </Badge>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <ExportPDFButton session={session} />
            <Link href="/tools/interview-prep/history">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {/* Analysis Dashboard */}
        <AnalysisDashboard session={session} />

        {/* Questions by Category */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            📝 Review Pertanyaan Per Kategori
          </h2>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap h-auto p-1">
              <TabsTrigger value="all" className="flex items-center gap-1 whitespace-nowrap">
                Semua ({questions.length})
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1 whitespace-nowrap">
                  {cat.label} ({cat.count})
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <QuestionList 
                questions={questions} 
                sessionId={session.id}
                preparedQuestions={session.prepared_questions}
              />
            </TabsContent>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id} className="mt-6">
                <QuestionList 
                  questions={questions.filter(q => q.category === cat.id)}
                  sessionId={session.id}
                  preparedQuestions={session.prepared_questions}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}
