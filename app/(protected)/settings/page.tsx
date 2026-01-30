import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile as getUserProfile } from "@/lib/supabase/server";
import { getProfile } from "@/actions/settings";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { SecuritySection } from "@/components/settings/SecuritySection";

export default async function SettingsPage() {
  const userProfile = await getUserProfile();

  let profile;
  try {
    profile = await getProfile();
  } catch (error) {
    console.error("Failed to get profile in settings page:", error);
    // Return error page with helpful message
    return (
      <AppShell isAdmin={userProfile?.role === 'admin'}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl font-bold text-red-600">Error Loading Profile</h2>
            <p className="text-muted-foreground">
              Failed to load your profile. This might be due to:
            </p>
            <ul className="text-sm text-left space-y-2 bg-muted p-4 rounded-lg">
              <li>• Database policies not configured correctly</li>
              <li>• Profile table missing required columns</li>
              <li>• Database trigger not created</li>
            </ul>
            <div className="text-sm font-mono bg-red-50 dark:bg-red-950 p-3 rounded">
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
            <p className="text-sm">
              Please run the setup SQL scripts in Supabase Dashboard:
              <br />
              1. <code className="bg-muted px-2 py-1 rounded">db/fix-profiles-rls-clean.sql</code>
              <br />
              2. <code className="bg-muted px-2 py-1 rounded">db/setup-profiles-columns.sql</code>
              <br />
              3. <code className="bg-muted px-2 py-1 rounded">db/create-profile-trigger.sql</code>
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const isAdmin = userProfile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin} isFullScreen>
      <div className="h-full w-full overflow-y-auto bg-background dark:bg-[#050505] p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
          <PageHeader
            title="Pengaturan"
            description="Kelola profil, keamanan, dan preferensi akun Anda"
          />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-muted/50 dark:bg-white/5 p-1">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileSection profile={profile} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecuritySection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppShell>
  );
}
