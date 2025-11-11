import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { getJobApplications } from "@/actions/tools";
import { TrackerClient } from "@/components/tools/TrackerClient";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  let applications = [];
  let error = null;
  let userId = "";

  try {
    applications = await getJobApplications();
    const { getUser } = await import("@/lib/supabase/server");
    const user = await getUser();
    userId = user?.id || "";
  } catch (e) {
    console.error("Error loading applications:", e);
    error = e instanceof Error ? e.message : "Failed to load applications";
    applications = [];
  }

  return (
    <AppShell>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="Job Tracker"
        description="Kelola lamaran kerja"
      />
      
      <PageHeader
        title="Job Application Tracker"
        description="Kelola dan pantau semua lamaran kerja Anda"
        hideOnMobile
      />
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
      <TrackerClient applications={applications} userId={userId} />
    </AppShell>
  );
}
