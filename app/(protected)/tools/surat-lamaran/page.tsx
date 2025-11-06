import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { SuratLamaranMain } from "@/components/surat-lamaran-sederhana/SuratLamaranMain";

export const dynamic = 'force-dynamic';

export default async function SuratLamaranToolsPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <SuratLamaranMain />
    </AppShell>
  );
}
