import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getApplications } from "@/actions/admin";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <AppShell isAdmin={true}>
      <PageHeader
        title="Dashboard Admin - Persetujuan Akun"
        description="Kelola pengajuan akun baru dan kirim notifikasi otomatis via Telegram"
      />
      <div className="space-y-6">
        <ApplicationsTable applications={applications} />
      </div>
    </AppShell>
  );
}
