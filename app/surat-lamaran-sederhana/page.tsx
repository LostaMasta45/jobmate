import { SuratLamaranClient } from "@/components/surat-lamaran-sederhana/SuratLamaranClient";
import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";

export default async function SuratLamaranSederhanaPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin} isFullScreen>
      <div className="h-full w-full overflow-hidden">
        <SuratLamaranClient />
      </div>
    </AppShell>
  );
}
