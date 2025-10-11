import { getApplications } from "@/actions/admin";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Applications</h1>
        <p className="text-muted-foreground mt-2">
          Kelola pengajuan akun baru dan kirim notifikasi otomatis via Telegram
        </p>
      </div>
      <ApplicationsTable applications={applications} />
    </>
  );
}
