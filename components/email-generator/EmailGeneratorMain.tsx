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

  return (
    <div className="space-y-4 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Hero Header - Redesigned Mobile App Style */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#6366f1] via-[#a855f7] to-[#ec4899] p-6 md:p-10 text-white shadow-2xl transform transition-all hover:scale-[1.005]">
        {/* Abstract Shapes Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/20 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-transparent to-black/10" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
               <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-inner ring-1 ring-white/30">
                  <Mail className="h-8 w-8 text-white drop-shadow-md" />
               </div>
               <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30 shadow-sm">
                  <Sparkles className="w-3 h-3 mr-1.5 text-yellow-300" />
                  PRO FEATURE
               </span>
            </div>
            
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm leading-tight">
                Email Generator
              </h1>
              <p className="text-indigo-100 mt-3 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
                Buat email profesional instan. Pilih template, sesuaikan gaya, dan kirim lamaran impianmu sekarang.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-2">
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 transition-colors hover:bg-white/20">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-semibold">High Response Rate</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 transition-colors hover:bg-white/20">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-sm font-semibold">Smart Personalization</span>
               </div>
            </div>
          </div>

          {/* Visual Illustration / 3D Element Placeholder */}
          <div className="hidden md:block relative w-64 h-full min-h-[180px]">
             <div className="absolute right-0 top-1/2 -translate-y-1/2 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                <div className="w-56 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50">
                   <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">HR</div>
                      <div className="flex-1">
                         <div className="h-2 w-24 bg-gray-200 rounded-full mb-1.5"></div>
                         <div className="h-1.5 w-16 bg-gray-100 rounded-full"></div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                      <div className="h-2 w-5/6 bg-gray-100 rounded-full"></div>
                      <div className="h-2 w-4/6 bg-gray-100 rounded-full"></div>
                   </div>
                   <div className="mt-4 flex justify-end">
                      <div className="h-6 w-20 bg-indigo-600 rounded-lg"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
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
