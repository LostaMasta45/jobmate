import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getJobApplications } from "@/actions/tools";
import { TrackerClient } from "@/components/tools/TrackerClient";

export const dynamic = "force-dynamic";

export default async function TrackerPage() {
  let applications = [];
  let error = null;

  try {
    applications = await getJobApplications();
  } catch (e) {
    console.error("Error loading applications:", e);
    error = e instanceof Error ? e.message : "Failed to load applications";
    applications = [];
  }

  return (
    <AppShell>
      <PageHeader
        title="Job Application Tracker"
        description="Kelola dan pantau semua lamaran kerja Anda"
      />
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}
      <TrackerClient applications={applications} />
    </AppShell>
  );
}
