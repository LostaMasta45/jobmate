import { AppShell } from "@/components/layout/AppShell";
import { createClient } from "@/lib/supabase/server";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let userData = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single();

    if (profile) {
      userData = {
        name: profile.full_name || user.email?.split("@")[0] || "User",
        email: profile.email || user.email || "",
      };
      isAdmin = profile.role === "admin";
    }
  }

  return (
    <AppShell user={userData || undefined} isAdmin={isAdmin}>
      {children}
    </AppShell>
  );
}
