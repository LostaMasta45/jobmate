import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { getAdminSettings } from "@/actions/admin";
import { TelegramSettingsForm } from "@/components/admin/TelegramSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <AppShell isAdmin={true}>
      <PageHeader
        title="Pengaturan Admin"
        description="Konfigurasi bot Telegram dan notifikasi sistem"
      />
      <div className="max-w-2xl space-y-6">
        <TelegramSettingsForm initialSettings={settings} />
      </div>
    </AppShell>
  );
}
