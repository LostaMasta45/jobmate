import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Briefcase, Calendar, TrendingUp, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppShell } from "@/components/layout/AppShell";
import { getInterviewPrepSessions } from "@/actions/interview-prep";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Riwayat Interview Prep | JOBMATE",
  description: "Lihat riwayat persiapan interview Anda",
};

export default async function InterviewPrepHistoryPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';
  
  // Check access - VIP PREMIUM only (not VIP BASIC)
  // VIP BASIC hanya bisa akses Portal Job (/vip), tidak bisa tools JobMate
  if (profile?.membership !== 'vip_premium' && !isAdmin) {
    redirect('/vip?error=premium_only');
  }

  const sessions = await getInterviewPrepSessions();

  return (
    <AppShell isAdmin={isAdmin}>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <Link href="/tools/interview-prep">
            <Button variant="ghost" size="sm" className="mb-2 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Riwayat Interview Prep</h1>
          <p className="text-muted-foreground">
            Lihat dan kelola sesi persiapan interview Anda
          </p>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Sesi</h3>
              <p className="text-muted-foreground mb-4">
                Buat sesi interview prep pertama Anda untuk memulai
              </p>
              <Link href="/tools/interview-prep">
                <Button>
                  Buat Sesi Baru
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        {session.position}
                      </CardTitle>
                      <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {session.company_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(session.created_at).toLocaleDateString('id-ID')}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {session.match_score}% match
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant={session.status === 'completed' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {session.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatCard
                      label="Pertanyaan"
                      value={session.questions.length}
                      icon="📝"
                    />
                    <StatCard
                      label="Prioritas Tinggi"
                      value={session.high_priority_count}
                      icon="🔥"
                      color="text-red-600"
                    />
                    <StatCard
                      label="Siap"
                      value={session.prepared_questions?.length || 0}
                      icon="✅"
                      color="text-green-600"
                    />
                    <StatCard
                      label="Match Score"
                      value={`${session.match_score}%`}
                      icon="🎯"
                    />
                  </div>

                  {/* Progress Bar */}
                  {session.preparation_progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress Persiapan</span>
                        <span className="font-semibold">{Math.round(session.preparation_progress)}%</span>
                      </div>
                      <Progress value={session.preparation_progress} className="h-2" />
                    </div>
                  )}

                  {/* Action Button */}
                  <Link href={`/tools/interview-prep/session/${session.id}`}>
                    <Button className="w-full" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Lihat & Siapkan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function StatCard({ 
  label, 
  value, 
  icon, 
  color = "text-primary" 
}: { 
  label: string; 
  value: number | string; 
  icon: string; 
  color?: string;
}) {
  return (
    <div className="bg-secondary/50 p-3 rounded-lg">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold flex items-center gap-1 ${color}`}>
        <span>{icon}</span>
        <span>{value}</span>
      </div>
    </div>
  );
}
