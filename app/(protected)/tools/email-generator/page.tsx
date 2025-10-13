import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { EmailGeneratorMain } from "@/components/email-generator/EmailGeneratorMain";

export const dynamic = 'force-dynamic';

export default async function EmailGeneratorPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <EmailGeneratorMain />
    </AppShell>
  );
}
