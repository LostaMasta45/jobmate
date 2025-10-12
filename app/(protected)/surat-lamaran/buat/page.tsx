import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { CoverLetterWizard } from "@/components/surat-lamaran/CoverLetterWizard";

export default async function BuatSuratLamaranPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <CoverLetterWizard profile={profile} />
    </AppShell>
  );
}
