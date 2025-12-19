import { AppShell } from "@/components/layout/AppShell";
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
import { getProfile } from "@/lib/supabase/server";
import { EmailGeneratorMain } from "@/components/email-generator/EmailGeneratorMain";

export const dynamic = 'force-dynamic';

export default async function EmailGeneratorPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      {/* Mobile Tool Header */}
      <MobileToolHeader
        title="Email Generator"
        description="Buat email profesional"
      />
      
      <EmailGeneratorMain />
    </AppShell>
  );
}
