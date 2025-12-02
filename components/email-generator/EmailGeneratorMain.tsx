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
    <div className="space-y-4 md:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5547d0] via-[#8e68fd] to-[#00d1dc] p-[1px] shadow-xl">
        <div className="relative rounded-[15px] bg-white dark:bg-slate-950 p-4 md:p-10 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-[#00d1dc]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#8e68fd]/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#5547d0] to-[#00d1dc] rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <div className="relative rounded-xl bg-white dark:bg-slate-900 p-4 ring-1 ring-slate-900/5 dark:ring-white/10">
                  <Mail className="h-10 w-10 text-[#5547d0]" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#5547d0] to-[#00acc7]">
                  Email Generator
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-lg">
                  Buat email profesional dalam hitungan detik dengan AI
                </p>
              </div>
            </div>
            
            {/* Modern Stats/Badges */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="flex items-center justify-center flex-1 lg:flex-none gap-2 px-4 py-2 rounded-full bg-[#5547d0]/10 text-[#5547d0] text-sm font-medium border border-[#5547d0]/20 whitespace-nowrap">
                <Sparkles className="h-3.5 w-3.5" />
                <span>GPT-4 Powered</span>
              </div>
              <div className="flex items-center justify-center flex-1 lg:flex-none gap-2 px-4 py-2 rounded-full bg-[#00d1dc]/10 text-[#00acc7] text-sm font-medium border border-[#00d1dc]/20 whitespace-nowrap">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>High Impact</span>
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
          <EmailWizard />
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
            <EmailHistory />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
