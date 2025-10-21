import { getProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Fixed */}
      <AdminSidebar />
      
      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
