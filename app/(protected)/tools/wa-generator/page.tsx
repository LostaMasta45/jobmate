import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { WAGeneratorV2Main } from "@/components/wa-generator/WAGeneratorV2Main";

export const dynamic = 'force-dynamic';

export default async function WAGeneratorPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin} isFullScreen>
      <WAGeneratorV2Main userName={profile?.full_name || ''} />
    </AppShell>
  );
}
