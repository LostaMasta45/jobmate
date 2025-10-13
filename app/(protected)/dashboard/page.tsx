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
    <AppShell isAdmin={isAdmin}>
      <WelcomeHero 
        userName={userName}
        userEmail={userEmail}
        avatarUrl={profile?.avatar_url}
        totalApplications={stats?.total || 0}
      />

      <div className="space-y-6">
        <StatCards data={stats} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <PipelineMini data={pipeline} />
            <RecentTable rows={recent} />
          </div>
          
          <div className="space-y-6">
            <RecentCoverLetters />
            {alerts.length > 0 && <AlertsPanel items={alerts} />}
          </div>
        </div>

        <ToolsGrid />
      </div>
    </AppShell>
  );
}
