"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Wrench,
  Activity,
  LogOut,
  Briefcase,
  Building2,
  Crown,
  Bot,
  Upload,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kelola Loker",
    href: "/admin/vip-loker",
    icon: Briefcase,
  },
  {
    title: "Upload Poster",
    href: "/admin/vip-loker/tambah",
    icon: Upload,
    badge: "AI",
  },
  {
    title: "Batch Upload",
    href: "/admin/vip-loker/batch-upload",
    icon: FolderOpen,
    badge: "NEW",
  },
  {
    title: "Perusahaan",
    href: "/admin/perusahaan",
    icon: Building2,
  },
  {
    title: "Member VIP",
    href: "/admin/member",
    icon: Crown,
  },
  {
    title: "Laporan",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Tools AI",
    href: "/admin/tools-ai",
    icon: Bot,
    badge: "NEW",
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: Users,
  },
  {
    title: "Observability",
    href: "/admin/observability",
    icon: Activity,
  },
  {
    title: "Real-time Monitor",
    href: "/admin/observability/realtime",
    icon: Activity,
    badge: "LIVE",
  },
];

function SidebarContent({ 
  pathname, 
  isLoggingOut, 
  handleLogout,
  onNavClick
}: { 
  pathname: string | null;
  isLoggingOut: boolean;
  handleLogout: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="text-lg font-bold text-white">JM</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">JobMate</h1>
            <p className="text-xs text-muted-foreground">Admin Panel ⚙️</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4 space-y-2">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signOut();
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/admin-login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/admin-login";
    }
  };

  // Close mobile menu when pathname changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <span className="text-sm font-bold text-white">JM</span>
            </div>
            <div>
              <h1 className="font-bold text-sm">JobMate Admin</h1>
            </div>
          </div>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="flex flex-col h-full">
                <SidebarContent
                  pathname={pathname}
                  isLoggingOut={isLoggingOut}
                  handleLogout={handleLogout}
                  onNavClick={() => setMobileOpen(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-64 flex-col border-r bg-card flex-shrink-0">
        <SidebarContent
          pathname={pathname}
          isLoggingOut={isLoggingOut}
          handleLogout={handleLogout}
        />
      </div>
    </>
  );
}
