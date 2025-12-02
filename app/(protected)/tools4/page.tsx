import { Metadata } from "next";
import { ToolsPageClient4 } from "@/components/tools/ToolsPageClient4";
import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tools | JobMate",
  description: "Menu tools untuk membantu perjalanan karir Anda"
};

export default async function ToolsPage4() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';
  const userName = profile?.full_name || profile?.name || "User";
  const userEmail = profile?.email || "";

  return (
    <AppShell 
      isAdmin={isAdmin}
      user={{
        name: userName,
        email: userEmail,
        avatar: profile?.avatar_url
      }}
    >
      <ToolsPageClient4 userName={userName} />
    </AppShell>
  );
}
