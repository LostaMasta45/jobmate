import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { EmailWizard } from "@/components/email-generator/EmailWizard";

export const dynamic = 'force-dynamic';

export default async function EmailGeneratorPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <EmailWizard />
    </AppShell>
  );
}
