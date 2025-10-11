import { getAdminSettings } from "@/actions/admin";
import { TelegramSettingsForm } from "@/components/admin/TelegramSettingsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-2">
          Konfigurasi bot Telegram, notifikasi sistem, dan preferensi admin
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <TelegramSettingsForm initialSettings={settings} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the admin panel appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">Theme Mode</label>
                <ThemeToggle />
                <p className="text-xs text-muted-foreground mt-2">
                  Switch between light and dark mode for the admin panel
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Info</CardTitle>
              <CardDescription>
                Current admin panel information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Version</span>
                <span className="text-sm font-medium">2.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Environment</span>
                <span className="text-sm font-medium">Production</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="text-sm font-medium">10 Oct 2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
