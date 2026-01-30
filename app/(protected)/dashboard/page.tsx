import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { getStats, getPipeline, getRecent, getAlerts } from "@/actions/dashboard/index";
import { StatCards } from "@/components/dashboard/StatCards";
import { PipelineMini } from "@/components/dashboard/PipelineMini";
import { RecentTable } from "@/components/dashboard/RecentTable";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { ToolsGrid } from "@/components/dashboard/ToolsGrid";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { RecentCoverLetters } from "@/components/dashboard/RecentCoverLetters";
import { RecentEmails } from "@/components/dashboard/RecentEmails";
import { RecentPDFOperations } from "@/components/dashboard/RecentPDFOperations";
import { RecentWhatsAppMessages } from "@/components/dashboard/RecentWhatsAppMessages";
import { RecentFollowUps } from "@/components/dashboard/RecentFollowUps";
import { RecentCreativeCVs } from "@/components/dashboard/RecentCreativeCVs";
import { RecentInterviewPrep } from "@/components/dashboard/RecentInterviewPrep";
import { PWAInstallWrapper } from "@/components/pwa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Sparkles, MessageCircle, TrendingUp, Activity, Bell, Palette, Target } from "lucide-react";

// Revalidate dashboard data every 30 seconds
export const revalidate = 30;

export default async function DashboardPage() {
  const profile = await getProfile();

  const [stats, pipeline, recent, alerts] = await Promise.all([
    getStats(),
    getPipeline(),
    getRecent(5),
    getAlerts(),
  ]);

  const isAdmin = profile?.role === 'admin';
  const userName = profile?.full_name || profile?.name || "User";
  const userEmail = profile?.email || "";

  return (
    <AppShell
      isAdmin={isAdmin}
      user={{
        name: userName,
        email: userEmail,
        avatar: profile?.avatar_url
      }}
      isFullScreen
    >
      <div className="h-full w-full overflow-y-auto bg-background dark:bg-[#050505] p-4 sm:p-6 lg:p-8">
        <div className="space-y-8 sm:space-y-10 max-w-7xl mx-auto pb-20">
          {/* Welcome Header */}
          <WelcomeHero
            userName={userName}
            userEmail={userEmail}
            avatarUrl={profile?.avatar_url}
            totalApplications={stats?.total || 0}
          />

          {/* Stats Cards - Enhanced Section */}
          <div className="relative">
            {/* Decorative gradient background for stats */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-fuchsia-500/5 dark:from-blue-500/10 dark:via-violet-500/10 dark:to-fuchsia-500/10 rounded-[2rem] blur-3xl -z-10 opacity-60" />
            <StatCards data={stats} />
          </div>

          {/* Pipeline & Recent Applications Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
              <PipelineMini data={pipeline} />
            </div>
            <div className="space-y-6">
              <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                <RecentTable rows={recent} />
              </div>
              {alerts.length > 0 && (
                <div className="transform transition-all duration-300 hover:translate-y-[-2px]">
                  <AlertsPanel items={alerts} />
                </div>
              )}
            </div>
          </div>

          {/* Activity History Section - Enhanced */}
          <div className="w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-sm">
                <Activity className="h-5 w-5 text-slate-700 dark:text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Aktivitas Terbaru
              </h2>
            </div>

            {/* Follow-up Reminders - Full Width */}
            <div className="mb-6">
              <RecentFollowUps />
            </div>

            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
              {/* Cover Letters History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#8e68fd] bg-gradient-to-br from-[#8e68fd]/10 via-[#8e68fd]/5 to-transparent dark:from-[#8e68fd]/20 dark:via-[#8e68fd]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd]/0 to-[#8e68fd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Surat Lamaran</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentCoverLetters />
                </CardContent>
              </Card>

              {/* CV Creative History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/20 dark:via-purple-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform duration-300">
                        <Palette className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">CV Creative</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentCreativeCVs />
                </CardContent>
              </Card>

              {/* Interview Prep History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                        <Target className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Interview Prep</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentInterviewPrep />
                </CardContent>
              </Card>

              {/* Emails History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#3977d3] bg-gradient-to-br from-[#3977d3]/10 via-[#3977d3]/5 to-transparent dark:from-[#3977d3]/20 dark:via-[#3977d3]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3977d3]/0 to-[#3977d3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <Mail className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">Email</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentEmails />
                </CardContent>
              </Card>

              {/* PDF Tools History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#00d1dc] bg-gradient-to-br from-[#00d1dc]/10 via-[#00d1dc]/5 to-transparent dark:from-[#00d1dc]/20 dark:via-[#00d1dc]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d1dc]/0 to-[#00d1dc]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">PDF Tools</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentPDFOperations />
                </CardContent>
              </Card>

              {/* WhatsApp History */}
              <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#00acc7] bg-gradient-to-br from-[#00acc7]/10 via-[#00acc7]/5 to-transparent dark:from-[#00acc7]/20 dark:via-[#00acc7]/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00acc7]/0 to-[#00acc7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <CardHeader className="pb-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">WhatsApp</CardTitle>
                    </div>
                    <div className="h-6 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <RecentWhatsAppMessages />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tools Grid */}
          <ToolsGrid />

          {/* PWA Install Popup - Mobile Only */}
          <PWAInstallWrapper />
        </div>
      </div>
    </AppShell>
  );
}
