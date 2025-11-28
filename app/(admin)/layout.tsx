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
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar - Fixed on Desktop, Drawer on Mobile */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {/* Add top padding on mobile to account for fixed header */}
        <div className="h-full w-full p-4 pt-20 lg:p-8 lg:pt-8 max-w-[1920px] mx-auto">
          <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
