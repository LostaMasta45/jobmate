import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, ArrowRight, Sparkles, Target, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { UploadFormNew } from "@/components/interview-prep/UploadFormNew";
import { getInterviewPrepSessions } from "@/actions/interview-prep";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Persiapan Interview AI | JOBMATE",
  description: "Generate pertanyaan interview yang dipersonalisasi dari CV dan job poster Anda",
};

export default async function InterviewPrepPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';
  
  // Check access - VIP PREMIUM only (not VIP BASIC)
  // VIP BASIC hanya bisa akses Portal Job (/vip), tidak bisa tools JobMate
  if (profile?.membership !== 'vip_premium' && !isAdmin) {
    redirect('/vip?error=premium_only');
  }

  const sessions = await getInterviewPrepSessions();
  const hasHistory = sessions.length > 0;

  return (
    <AppShell isAdmin={isAdmin}>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="Interview Prep AI"
        description="Persiapan interview"
      />
      
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <PageHeader
            title="🎯 Persiapan Interview AI"
            description="Upload CV + Job Poster → Dapatkan 30-40 pertanyaan interview yang dipersonalisasi dengan 3 level jawaban"
            hideOnMobile
          />
          
          {hasHistory && (
            <Link href="/tools/interview-prep/history">
              <Button variant="outline" size="sm" className="self-start">
                <FileText className="mr-2 h-4 w-4" />
                Riwayat ({sessions.length})
              </Button>
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Dipersonalisasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pertanyaan berdasarkan CV ANDA dan requirements job ASLI
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Analisis Gap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Identifikasi kekuatan & gap. Pertanyaan prioritas TINGGI untuk skill yang kurang
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Award className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">3 Level Jawaban</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Jawaban Dasar, Lebih Baik, dan Metode STAR untuk setiap pertanyaan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Sparkles className="h-8 w-8 text-amber-600 mb-2" />
              <CardTitle className="text-lg">Lengkap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pembukaan → Teknis → Behavioral → Jebakan → Penutup
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Upload Form */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Mulai Sekarang</h2>
            <p className="text-muted-foreground">
              Upload gambar CV & job poster atau paste text untuk generate persiapan interview yang dipersonalisasi
            </p>
          </div>
          
          <UploadFormNew />
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Cara Kerja</CardTitle>
            <CardDescription>AI akan generate persiapan interview lengkap dalam 4 langkah:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Step
                  number="1"
                  title="Upload & Parse"
                  description="AI extract skills, pengalaman dari CV. Parse requirements & tanggung jawab dari job."
                />
                <Step
                  number="2"
                  title="Analisis Gap"
                  description="Bandingkan CV vs Job. Hitung match score, identifikasi kekuatan & gap."
                />
              </div>
              <div className="space-y-4">
                <Step
                  number="3"
                  title="Generate Pertanyaan"
                  description="Buat 30-40 pertanyaan yang dipersonalisasi di 6 kategori (Pembukaan, Teknis, Behavioral, Situasional, Jebakan, Penutup)"
                />
                <Step
                  number="4"
                  title="Multi-Level Jawaban"
                  description="Generate jawaban Dasar, Lebih Baik, dan Metode STAR. Plus tips & red flags!"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About This Tool */}
        <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">💎</span>
              Tool Eksklusif VIP Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Tool ini adalah fitur eksklusif untuk member VIP Premium. Dapatkan persiapan interview yang komprehensif:
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Sesi unlimited tanpa batas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">30-40 pertanyaan per sesi</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Jawaban Metode STAR lengkap</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Tips & red flags detail</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Upload gambar CV & job poster</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-primary">✅</span>
                  <span className="text-sm">Progress tracking otomatis</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
