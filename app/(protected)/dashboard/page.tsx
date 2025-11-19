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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Mail, Sparkles, MessageCircle, TrendingUp, Activity, Bell } from "lucide-react";

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
    >
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Header */}
        <WelcomeHero 
          userName={userName}
          userEmail={userEmail}
          avatarUrl={profile?.avatar_url}
          totalApplications={stats?.total || 0}
        />

        {/* Stats Cards - Enhanced Section */}
        <div className="relative">
          {/* Decorative gradient background */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#8e68fd]/5 via-[#00d1dc]/5 to-[#3977d3]/5 dark:from-[#8e68fd]/10 dark:via-[#00d1dc]/10 dark:to-[#3977d3]/10 rounded-3xl blur-3xl -z-10 opacity-50" />
          <StatCards data={stats} />
        </div>

        {/* Pipeline & Recent Applications Row */}
        <div className="grid gap-5 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <PipelineMini data={pipeline} />
          </div>
          <div className="space-y-5 sm:space-y-6">
            <div className="transform transition-all duration-300 hover:scale-[1.01]">
              <RecentTable rows={recent} />
            </div>
            {alerts.length > 0 && (
              <div className="transform transition-all duration-300 hover:scale-[1.01]">
                <AlertsPanel items={alerts} />
              </div>
            )}
          </div>
        </div>

        {/* Activity History Section - Enhanced */}
        <div className="w-full overflow-hidden">
          <div className="flex items-center gap-3 mb-5 sm:mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8e68fd]/10 to-[#00d1dc]/10 dark:from-[#8e68fd]/20 dark:to-[#00d1dc]/20 border border-[#8e68fd]/20">
              <Activity className="h-5 w-5 text-[#8e68fd] dark:text-[#00d1dc]" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#8e68fd] to-[#00d1dc] bg-clip-text text-transparent">
              Aktivitas Terbaru
            </h2>
          </div>

          {/* Follow-up Reminders - Full Width */}
          <div className="mb-5 sm:mb-6">
            <RecentFollowUps />
          </div>
          
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {/* Cover Letters History */}
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#8e68fd] bg-gradient-to-br from-[#8e68fd]/10 via-[#8e68fd]/5 to-transparent dark:from-[#8e68fd]/20 dark:via-[#8e68fd]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd]/0 to-[#8e68fd]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#8e68fd]/10 group-hover:bg-[#8e68fd]/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <FileText className="h-4 w-4 text-[#8e68fd] dark:text-[#8e68fd]" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Surat Lamaran</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <RecentCoverLetters />
              </CardContent>
            </Card>

            {/* Emails History */}
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#3977d3] bg-gradient-to-br from-[#3977d3]/10 via-[#3977d3]/5 to-transparent dark:from-[#3977d3]/20 dark:via-[#3977d3]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3977d3]/0 to-[#3977d3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#3977d3]/10 group-hover:bg-[#3977d3]/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Mail className="h-4 w-4 text-[#3977d3] dark:text-[#3977d3]" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <RecentEmails />
              </CardContent>
            </Card>

            {/* PDF Tools History */}
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#00d1dc] bg-gradient-to-br from-[#00d1dc]/10 via-[#00d1dc]/5 to-transparent dark:from-[#00d1dc]/20 dark:via-[#00d1dc]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d1dc]/0 to-[#00d1dc]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#00d1dc]/10 group-hover:bg-[#00d1dc]/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <Sparkles className="h-4 w-4 text-[#00d1dc] dark:text-[#00d1dc]" />
                  </div>
                  <CardTitle className="text-sm font-semibold">PDF Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <RecentPDFOperations />
              </CardContent>
            </Card>

            {/* WhatsApp History */}
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-[#00acc7] bg-gradient-to-br from-[#00acc7]/10 via-[#00acc7]/5 to-transparent dark:from-[#00acc7]/20 dark:via-[#00acc7]/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00acc7]/0 to-[#00acc7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#00acc7]/10 group-hover:bg-[#00acc7]/20 transition-colors duration-300 group-hover:scale-110 transform">
                    <MessageCircle className="h-4 w-4 text-[#00acc7] dark:text-[#00acc7]" />
                  </div>
                  <CardTitle className="text-sm font-semibold">WhatsApp</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <RecentWhatsAppMessages />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tools Grid */}
        <ToolsGrid />
      </div>
    </AppShell>
  );
}
