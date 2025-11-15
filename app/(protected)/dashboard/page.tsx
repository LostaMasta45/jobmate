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
      <div className="space-y-5 sm:space-y-6">
        {/* Welcome Header */}
        <WelcomeHero 
          userName={userName}
          userEmail={userEmail}
          avatarUrl={profile?.avatar_url}
          totalApplications={stats?.total || 0}
        />

        {/* Stats Cards */}
        <StatCards data={stats} />

        {/* Pipeline & Recent Applications Row */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-2">
          <PipelineMini data={pipeline} />
          <div className="space-y-4 sm:space-y-5">
            <RecentTable rows={recent} />
            {alerts.length > 0 && <AlertsPanel items={alerts} />}
          </div>
        </div>

        {/* Activity History Section */}
        <div className="w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
          </div>

          {/* Follow-up Reminders - Full Width */}
          <div className="mb-4 sm:mb-5">
            <RecentFollowUps />
          </div>
          
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full">
            {/* Cover Letters History */}
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-[#8e68fd] bg-gradient-to-br from-[#8e68fd]/10 to-transparent dark:from-[#8e68fd]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#8e68fd]/10">
                    <FileText className="h-4 w-4 text-[#8e68fd] dark:text-[#8e68fd]" />
                  </div>
                  <CardTitle className="text-sm">Surat Lamaran</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RecentCoverLetters />
              </CardContent>
            </Card>

            {/* Emails History */}
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-[#3977d3] bg-gradient-to-br from-[#3977d3]/10 to-transparent dark:from-[#3977d3]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#3977d3]/10">
                    <Mail className="h-4 w-4 text-[#3977d3] dark:text-[#3977d3]" />
                  </div>
                  <CardTitle className="text-sm">Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RecentEmails />
              </CardContent>
            </Card>

            {/* PDF Tools History */}
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-[#00d1dc] bg-gradient-to-br from-[#00d1dc]/10 to-transparent dark:from-[#00d1dc]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#00d1dc]/10">
                    <Sparkles className="h-4 w-4 text-[#00d1dc] dark:text-[#00d1dc]" />
                  </div>
                  <CardTitle className="text-sm">PDF Tools</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <RecentPDFOperations />
              </CardContent>
            </Card>

            {/* WhatsApp History */}
            <Card className="group hover:shadow-lg transition-all border-l-4 border-l-[#00acc7] bg-gradient-to-br from-[#00acc7]/10 to-transparent dark:from-[#00acc7]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#00acc7]/10">
                    <MessageCircle className="h-4 w-4 text-[#00acc7] dark:text-[#00acc7]" />
                  </div>
                  <CardTitle className="text-sm">WhatsApp</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
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
