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
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

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
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear client-side session FIRST
      const supabase = createClient();
      await supabase.auth.signOut();
      
      // Clear server-side session
      await signOut();
      
      // Small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force a hard redirect to clear all state
      window.location.href = "/admin-login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect anyway
      window.location.href = "/admin-login";
    }
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
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

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
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
    </div>
  );
}
