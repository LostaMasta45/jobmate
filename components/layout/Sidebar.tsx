"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileBadge2,
  IdCard,
  Mails,
  KanbanSquare,
  FileCog,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  admin?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Cover Letter",
    href: "/tools/cover-letter",
    icon: FileText,
  },
  {
    title: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileBadge2,
  },
  {
    title: "CV Profile",
    href: "/tools/cv-profile",
    icon: IdCard,
  },
  {
    title: "Email Template",
    href: "/tools/email-template",
    icon: Mails,
  },
  {
    title: "Tracker",
    href: "/tools/tracker",
    icon: KanbanSquare,
  },
  {
    title: "PDF Tools",
    href: "/tools/pdf-tools",
    icon: FileCog,
  },
  {
    title: "WA Generator",
    href: "/tools/wa-generator",
    icon: MessageSquareText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2,
  },
  {
    title: "Applications",
    href: "/admin/applications",
    icon: ShieldCheck,
    admin: true,
  },
  {
    title: "Admin Settings",
    href: "/admin/settings",
    icon: SlidersHorizontal,
    admin: true,
  },
];

interface SidebarProps {
  isAdmin?: boolean;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isAdmin = false, mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Load collapsed state from localStorage after component mounts
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("jobmate_sidebar_collapsed");
      // Only set to true if explicitly stored as "true", otherwise default to false (open)
      setCollapsed(stored === "true");
    }
  }, []);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("jobmate_sidebar_collapsed", String(newState));
    }
  };

  const filteredItems = navItems.filter((item) => !item.admin || isAdmin);

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Desktop Sidebar Content
  const DesktopSidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              JM
            </div>
            <span className="text-lg font-semibold">JobMate</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto flex items-center hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              JM
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5"
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="outline"
          size={collapsed ? "icon" : "default"}
          onClick={toggleCollapse}
          className={cn(
            "w-full transition-all duration-200",
            collapsed ? "px-0" : "justify-between"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <span className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-sm">Hide Sidebar</span>
              </span>
            </>
          )}
        </Button>
      </div>
    </>
  );

  // Mobile Sidebar Content
  const MobileSidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            JM
          </div>
          <span className="text-lg font-semibold">JobMate</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Always visible on large screens */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card h-screen transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <DesktopSidebarContent />
      </aside>

      {/* Mobile Sidebar - Drawer overlay */}
      {mobileOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-40 animate-in fade-in duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 w-72 bg-card border-r z-50 flex flex-col animate-in slide-in-from-left duration-300">
            <MobileSidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
