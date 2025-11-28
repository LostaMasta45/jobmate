import { getApplications } from "@/actions/admin";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="space-y-8 pb-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Applications</h1>
        <p className="text-muted-foreground mt-1">
          Manage account requests and automated Telegram notifications.
        </p>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
