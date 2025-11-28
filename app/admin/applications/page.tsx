import { getApplications } from "@/actions/admin";
import { ApplicationsTable } from "@/components/admin/ApplicationsTable";

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Account Applications
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage account requests and automated Telegram notifications.
          </p>
        </div>
      </div>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
