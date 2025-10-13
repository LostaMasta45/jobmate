"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Sparkles, History, Plus, Mail, TrendingUp } from "lucide-react";
import { EmailWizard } from "./EmailWizard";
import { EmailHistory } from "./EmailHistory";
import { Badge } from "@/components/ui/badge";

export function EmailGeneratorMain() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg" />
        <Card className="relative p-6 md:p-8 border-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 shadow-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                  Email Generator
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI-Powered
                  </Badge>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Buat email lamaran profesional dengan AI dalam Bahasa Indonesia & English
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">🇮🇩</div>
                <div className="text-xs text-muted-foreground">Bahasa ID</div>
              </div>
              <div className="text-center px-4 py-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🇬🇧</div>
                <div className="text-xs text-muted-foreground">English</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Buat Email Baru</span>
              <span className="sm:hidden">Buat Baru</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History Email</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Create New Email Tab */}
        <TabsContent value="create" className="space-y-6 mt-6">
          {/* Quick Tips Banner */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-950 dark:to-red-950 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  💡 Tips Email Lamaran yang Efektif
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-amber-800 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Personalisasi untuk setiap perusahaan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Highlight skill yang relevan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Maksimal 200-300 kata</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                    <span>Proofread sebelum kirim</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Email Wizard */}
          <EmailWizard />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Email History</h2>
              <p className="text-muted-foreground">
                Kelola semua email lamaran yang pernah kamu buat
              </p>
            </div>
          </div>
          
          <EmailHistory />
        </TabsContent>
      </Tabs>

      {/* Bottom Info Card */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-center gap-2 text-sm text-center">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-900 dark:text-blue-100">
            <strong>AI Email Generator</strong> - Menggunakan GPT-4o-mini untuk hasil terbaik
          </span>
        </div>
      </Card>
    </div>
  );
}
