import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getProfile } from "@/lib/supabase/server";
import {
  getDashboardStats,
  getPipelineSnapshot,
  getUpcoming,
  getRecentApplications,
  getResumeHealth,
} from "@/actions/dashboard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { PipelineSnapshot } from "@/components/dashboard/PipelineSnapshot";
import { UpcomingList } from "@/components/dashboard/UpcomingList";
import { RecentApplicationsTable } from "@/components/dashboard/RecentApplicationsTable";
import { ResumeHealth } from "@/components/dashboard/ResumeHealth";
import { ToolsGrid } from "@/components/dashboard/ToolsGrid";

export default async function DashboardPage() {
  const profile = await getProfile();
  const stats = await getDashboardStats();
  const pipeline = await getPipelineSnapshot();
  const upcoming = await getUpcoming();
  const recentApplications = await getRecentApplications();
  const resumeHealth = await getResumeHealth();

  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <PageHeader
        title={`Halo, ${profile?.name || "Demo User"} 👋`}
        description="Ringkasan progres lamaran dan alat bantu karier"
      />

      <div className="space-y-5 sm:space-y-6">
        <DashboardStats stats={stats} />

        <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-2">
          <PipelineSnapshot data={pipeline} />
          <UpcomingList items={upcoming} />
        </div>

        <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <RecentApplicationsTable applications={recentApplications} />
          </div>
          <div className="lg:col-span-5">
            <ResumeHealth data={resumeHealth} />
          </div>
        </div>

        <ToolsGrid />
      </div>
    </AppShell>
  );
}
