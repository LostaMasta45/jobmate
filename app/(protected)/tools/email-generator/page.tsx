import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";
import { EmailGeneratorV2Main } from "@/components/email-generator/EmailGeneratorV2Main";

export const dynamic = 'force-dynamic';

export default async function EmailGenerator2Page() {
    const profile = await getProfile();
    const isAdmin = profile?.role === 'admin';

    return (
        <AppShell isAdmin={isAdmin} isFullScreen>
            <EmailGeneratorV2Main userName={profile?.full_name || ''} />
        </AppShell>
    );
}

