"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Sparkles, History, Plus, Mail, TrendingUp } from "lucide-react";
import { EmailWizard } from "./EmailWizard";
import { EmailHistory } from "./EmailHistory";
import { EmailFormData } from "./types";

export function EmailGeneratorMain() {
  const [activeTab, setActiveTab] = useState("create");
  // State to hold draft data for editing
  const [editDraft, setEditDraft] = useState<EmailFormData | null>(null);

  // Handler when user clicks Edit on history item
  const handleEditHistory = (draftData: any) => {
    setEditDraft(draftData);
    setActiveTab("create");
  };

  // Handler for tab change - reset form when going to create tab (not from history edit)
  const handleTabChange = (value: string) => {
    if (value === "create" && activeTab !== "create") {
      // Reset editDraft when switching to create tab (clears any persisted data)
      setEditDraft(null);
    }
    setActiveTab(value);
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Hero Header - Redesigned Mobile App Style */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] p-5 sm:p-8 md:p-10 text-white shadow-2xl transform transition-all hover:scale-[1.002]">
        {/* Abstract Shapes Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl mix-blend-overlay" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 z-10">
          <div className="flex flex-col gap-3 sm:gap-4 max-w-2xl w-full">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-inner ring-1 ring-white/30">
                <Mail className="h-5 w-5 sm:h-7 sm:w-7 text-white drop-shadow-md" />
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 shadow-sm tracking-wide">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 text-yellow-300" />
                AI POWERED
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                Email Generator
              </h1>
              <p className="text-indigo-50 mt-3 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-xl opacity-90">
                Buat email profesional dalam hitungan detik. Pilih template, sesuaikan gaya, dan kirim lamaran impianmu.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full sm:rounded-xl border border-white/10 transition-all hover:bg-white/20 hover:scale-105 cursor-default">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" />
                <span className="text-xs sm:text-sm font-semibold">Auto-Formatting</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full sm:rounded-xl border border-white/10 transition-all hover:bg-white/20 hover:scale-105 cursor-default">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span className="text-xs sm:text-sm font-semibold">Smart Tone</span>
              </div>
            </div>
          </div>

          {/* Visual Illustration - Hidden on mobile, visible on md+ */}
          <div className="hidden md:block relative w-72 h-40 lg:h-48 flex-shrink-0 perspective-1000">
            <div className="absolute right-4 top-1/2 -translate-y-1/2 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500 ease-out">
              <div className="w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/50 ring-1 ring-black/5">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-sm">HR</div>
                  <div className="flex-1">
                    <div className="h-2.5 w-24 bg-slate-200 rounded-full mb-2"></div>
                    <div className="h-2 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-2.5 opacity-60">
                  <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
                  <div className="h-2 w-4/6 bg-slate-200 rounded-full"></div>
                </div>
                <div className="mt-5 flex justify-end">
                  <div className="h-8 w-24 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
        <div className="flex justify-center">
          <div className="bg-slate-100 dark:bg-slate-800/50 p-1 rounded-full shadow-inner">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12 bg-transparent">
              <TabsTrigger
                value="create"
                className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#5547d0] data-[state=active]:shadow-sm transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Baru
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:text-[#5547d0] data-[state=active]:shadow-sm transition-all duration-300"
              >
                <History className="h-4 w-4 mr-2" />
                Riwayat
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Create New Email Tab */}
        <TabsContent value="create" className="space-y-8 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <EmailWizard initialData={editDraft} />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-none shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Riwayat Email</h2>
                <p className="text-muted-foreground">
                  Arsip email yang pernah Anda buat sebelumnya
                </p>
              </div>
            </div>
            <EmailHistory onEdit={handleEditHistory} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
