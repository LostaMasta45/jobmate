"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Sparkles, History, Plus, FileText, TrendingUp, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function SuratLamaranMain() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-lg" />
        <Card className="relative p-4 sm:p-6 md:p-8 border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 sm:p-4 shadow-lg shrink-0">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold flex flex-wrap items-center gap-2">
                  Surat Lamaran
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    20 Template
                  </Badge>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Buat surat lamaran profesional dengan 20+ template siap pakai
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-2 sm:gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none text-center px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">20</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">Template</div>
              </div>
              <div className="flex-1 md:flex-none text-center px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                  <Layout className="h-5 w-5 sm:h-6 sm:w-6 mx-auto" />
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">ATS Ready</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-11 sm:h-12">
            <TabsTrigger value="create" className="gap-2 text-xs sm:text-sm">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Buat Surat</span>
              <span className="xs:hidden">Buat</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2 text-xs sm:text-sm">
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">History</span>
              <span className="xs:hidden">History</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Create New Tab */}
        <TabsContent value="create" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Quick Tips Banner */}
          <Card className="p-3 sm:p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-2 sm:gap-3">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-green-900 dark:text-green-100 mb-2">
                  💡 Tips Surat Lamaran yang Efektif
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm text-green-800 dark:text-green-200">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                    <span className="truncate">Personalisasi untuk perusahaan</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                    <span className="truncate">Gunakan template ATS-friendly</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                    <span className="truncate">Maksimal 1 halaman A4</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>
                    <span className="truncate">Proofread sebelum kirim</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Redirect to Create Page */}
          <Card className="p-6 sm:p-8 md:p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">Mulai Buat Surat Lamaran</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Pilih dari 20+ template profesional dan isi data diri Anda
                </p>
              </div>
              <Link href="/surat-lamaran-sederhana/buat">
                <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 sm:h-11 sm:px-8 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  <span>Buat Surat Lamaran Baru</span>
                </button>
              </Link>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Redirect to dedicated history page */}
          <Card className="p-6 sm:p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-4 w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                <History className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold">Lihat History Surat Lamaran</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Kelola semua surat lamaran yang pernah Anda buat
                </p>
              </div>
              <Link href="/surat-lamaran-sederhana/history">
                <button className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 sm:h-11 sm:px-8 w-full sm:w-auto">
                  <History className="h-4 w-4" />
                  <span>Buka History</span>
                </button>
              </Link>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Info Card */}
      <Card className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-center">
          <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-green-900 dark:text-green-100">
            <strong className="font-semibold">20+ Template Profesional</strong> - Siap pakai untuk berbagai posisi dan industri
          </span>
        </div>
      </Card>
    </div>
  );
}
