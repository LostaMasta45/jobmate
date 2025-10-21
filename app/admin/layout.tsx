import { getProfile } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: Admin login page is at /admin-login (outside /admin directory)
  // This prevents parent layout from running and causing redirect loop
  
  const profile = await getProfile();

  if (!profile) {
    redirect("/admin-login");
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
