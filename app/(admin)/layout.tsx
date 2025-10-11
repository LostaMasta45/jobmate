import { getProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
