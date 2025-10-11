import { getProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth already handled by middleware, no need to check again here
  // This prevents infinite redirect loops
  return <>{children}</>;
}
