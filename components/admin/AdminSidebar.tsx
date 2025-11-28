"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Activity,
  LogOut,
  Briefcase,
  Building2,
  Crown,
  Bot,
  Upload,
  FolderOpen,
  Menu,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
  section?: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    section: "Main",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    section: "Main",
  },
  {
    title: "Kelola Loker",
    href: "/admin/vip-loker",
    icon: Briefcase,
    section: "Content",
  },
  {
    title: "Upload Poster",
    href: "/admin/vip-loker/tambah",
    icon: Upload,
    badge: "AI",
    badgeColor: "bg-purple-500",
    section: "Content",
  },
  {
    title: "Batch Upload",
    href: "/admin/vip-loker/batch-upload",
    icon: FolderOpen,
    badge: "NEW",
    badgeColor: "bg-emerald-500",
    section: "Content",
  },
  {
    title: "Perusahaan",
    href: "/admin/perusahaan",
    icon: Building2,
    section: "Content",
  },
  {
    title: "Member VIP",
    href: "/admin/member",
    icon: Crown,
    section: "Users",
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: Users,
    section: "Users",
  },
  {
    title: "Tools AI",
    href: "/admin/tools-ai",
    icon: Bot,
    section: "System",
  },
  {
    title: "Observability",
    href: "/admin/observability",
    icon: Activity,
    section: "System",
  },
  {
    title: "Live Monitor",
    href: "/admin/observability/realtime",
    icon: Activity,
    badge: "LIVE",
    badgeColor: "bg-red-500 animate-pulse",
    section: "System",
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
  // Group items by section
  const groupedItems = menuItems.reduce((acc, item) => {
    const section = item.section || "Other";
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
            <span className="text-lg font-bold">JM</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none">JobMate</span>
            <span className="text-xs font-medium text-muted-foreground">Admin Workspace</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-6 overflow-y-auto py-2 scrollbar-hide">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="space-y-1">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
              {section}
            </h3>
            {items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavClick}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white shadow-sm", item.badgeColor || "bg-blue-500")}>
                        {item.badge}
                      </span>
                    )}
                    {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 mt-auto border-t bg-muted/30">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-background border shadow-sm">
          <Avatar className="h-9 w-9 border-2 border-background">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate">Administrator</span>
            <span className="text-xs text-muted-foreground truncate">admin@jobmate.id</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="px-1">
          <p className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">Preferences</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await signOut();
      // Force hard reload to clear all states
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
      {/* Mobile Header - Improved */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <span className="text-sm font-bold">JM</span>
          </div>
          <span className="font-bold text-lg tracking-tight">JobMate Admin</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
             <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent
              pathname={pathname}
              isLoggingOut={isLoggingOut}
              handleLogout={handleLogout}
              onNavClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar - Refined */}
      <aside className="hidden lg:flex h-screen w-72 flex-col border-r bg-card sticky top-0 z-40 shadow-sm">
        <SidebarContent
          pathname={pathname}
          isLoggingOut={isLoggingOut}
          handleLogout={handleLogout}
        />
      </aside>
    </>
  );
}
