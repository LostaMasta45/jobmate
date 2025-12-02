import { Metadata } from "next";
import { ToolsPageClient2 } from "@/components/tools/ToolsPageClient2";
import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tools Redesign | JobMate",
  description: "Menu tools untuk membantu perjalanan karir Anda"
};

export default async function ToolsPage2() {
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
      <ToolsPageClient2 userName={userName} />
    </AppShell>
  );
}
