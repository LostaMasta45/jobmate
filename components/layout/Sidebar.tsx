"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileBadge2,
  KanbanSquare,
  FileCog,
  MessageSquareText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  FileSignature,
  MailPlus,
  Briefcase,
  Building2,
  Bell,
  Crown,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  admin?: boolean;
  vip?: boolean; // VIP Career routes (available for both Basic and Premium)
  premiumOnly?: boolean; // JobMate tools (Premium only)
  divider?: boolean;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lowongan Kerja",
    href: "/vip/loker",
    icon: Briefcase,
    vip: true,
  },
  {
    title: "Perusahaan",
    href: "/vip/perusahaan",
    icon: Building2,
    vip: true,
  },
  {
    title: "Surat Lamaran",
    href: "/surat-lamaran",
    icon: FileSignature,
    premiumOnly: true,
    divider: true,
  },
  {
    title: "Surat Lamaran Sederhana",
    href: "/surat-lamaran-sederhana/history",
    icon: FileText,
    premiumOnly: true,
  },
  {
    title: "Email Generator",
    href: "/tools/email-generator",
    icon: MailPlus,
    premiumOnly: true,
  },
  {
    title: "CV ATS",
    href: "/tools/cv-ats",
    icon: FileBadge2,
    premiumOnly: true,
  },
  {
    title: "Tracker",
    href: "/tools/tracker",
    icon: KanbanSquare,
    premiumOnly: true,
  },
  {
    title: "PDF Tools",
    href: "/tools/pdf-tools",
    icon: FileCog,
    premiumOnly: true,
  },
  {
    title: "WA Generator",
    href: "/tools/wa-generator",
    icon: MessageSquareText,
    premiumOnly: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings2,
    divider: true,
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
  membership?: string; // 'free', 'vip_basic', 'vip_premium'
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isAdmin = false, membership: membershipProp = 'free', mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [membership, setMembership] = React.useState(membershipProp);
  const [toolsExpanded, setToolsExpanded] = React.useState(false);

  // Load collapsed state from localStorage after component mounts
  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("jobmate_sidebar_collapsed");
      // Only set to true if explicitly stored as "true", otherwise default to false (open)
      setCollapsed(stored === "true");
    }
  }, []);

  // Fetch user's membership if not provided as prop
  React.useEffect(() => {
    async function fetchMembership() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('membership')
            .eq('id', user.id)
            .single();
          
          if (profile?.membership) {
            setMembership(profile.membership);
          }
        }
      } catch (error) {
        console.error('Error fetching membership:', error);
      }
    }

    // Only fetch if membership not provided as prop
    if (!membershipProp || membershipProp === 'free') {
      fetchMembership();
    }
  }, [membershipProp]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("jobmate_sidebar_collapsed", String(newState));
    }
  };

  // Filter items based on role and membership
  const filteredItems = navItems.filter((item) => {
    // Filter admin items
    if (item.admin && !isAdmin) return false;
    
    // Filter premium-only items for non-premium users
    if (item.premiumOnly && membership !== 'vip_premium') return false;
    
    return true;
  });

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Desktop Sidebar Content
  const DesktopSidebarContent = () => (
    <>
      <div className="flex h-16 items-center justify-center border-b px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center justify-center hover:opacity-80 transition-opacity">
            <div className="relative h-12 w-48 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="JobMate Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto flex items-center hover:opacity-80 transition-opacity">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="JobMate Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {filteredItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const prevItem = index > 0 ? filteredItems[index - 1] : null;
          const showDivider = prevItem?.divider;

          return (
            <React.Fragment key={item.href}>
              {showDivider && (
                <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              )}
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : item.vip
                    ? "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 hover:translate-x-0.5"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-0.5"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 shrink-0", item.vip && !isActive && "text-blue-600 dark:text-blue-400")} />
                {!collapsed && (
                  <span className="truncate flex items-center gap-2">
                    {item.title}
                    {item.vip && !isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                        VIP
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </React.Fragment>
          );
        })}

        {/* Tools Jobmate Preview Section - For VIP Basic users */}
        {membership === 'vip_basic' && !collapsed && (
          <div className="mt-4 border-t pt-3">
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/30 dark:hover:to-pink-950/30"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Tools Jobmate</span>
                <Crown className="h-3 w-3 text-yellow-500 animate-pulse" />
              </div>
              {toolsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {toolsExpanded && (
              <div className="mt-2 space-y-1 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 p-2 border border-purple-100 dark:border-purple-900/30 animate-in slide-in-from-top duration-300">
                {/* Premium Tools List */}
                <div className="space-y-0.5 mb-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Surat Lamaran AI</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">CV ATS Optimizer</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Email Generator</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Job Tracker</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">PDF Tools</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">WA Generator</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                  <p className="text-[10px] text-muted-foreground text-center mb-2 px-1">
                    Unlock semua tools productivity untuk pencarian kerja
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs h-8"
                  >
                    <a 
                      href="https://t.me/jobmate_support"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Crown className="mr-1.5 h-3 w-3" />
                      Upgrade ke Premium
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Membership Badge & Upgrade CTA for VIP Basic */}
      {membership === 'vip_basic' && !collapsed && (
        <div className="border-t p-3 space-y-2">
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
            <Crown className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
              VIP Basic Member
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs"
          >
            <Link href="/pricing?upgrade=premium">
              Upgrade ke Premium ⭐
            </Link>
          </Button>
          <p className="text-[10px] text-center text-muted-foreground px-2">
            Unlock semua JobMate tools!
          </p>
        </div>
      )}

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
        <Link href="/dashboard" className="flex items-center justify-center flex-1" onClick={handleLinkClick}>
          <div className="relative h-12 w-48 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="JobMate Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="flex-shrink-0"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {filteredItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          const prevItem = index > 0 ? filteredItems[index - 1] : null;
          const showDivider = prevItem?.divider;

          return (
            <React.Fragment key={item.href}>
              {showDivider && (
                <div className="my-2 border-t border-gray-200 dark:border-gray-700" />
              )}
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : item.vip
                    ? "text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", item.vip && !isActive && "text-blue-600 dark:text-blue-400")} />
                <span className="flex items-center gap-2">
                  {item.title}
                  {item.vip && !isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold">
                      VIP
                    </span>
                  )}
                </span>
              </Link>
            </React.Fragment>
          );
        })}

        {/* Tools Jobmate Preview Section - For VIP Basic users on Mobile */}
        {membership === 'vip_basic' && (
          <div className="mt-4 border-t pt-3">
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/30 dark:hover:to-pink-950/30"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>Tools Jobmate</span>
                <Crown className="h-3 w-3 text-yellow-500 animate-pulse" />
              </div>
              {toolsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {toolsExpanded && (
              <div className="mt-2 space-y-1 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 p-2 border border-purple-100 dark:border-purple-900/30 animate-in slide-in-from-top duration-300">
                {/* Premium Tools List */}
                <div className="space-y-0.5 mb-2">
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Surat Lamaran AI</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">CV ATS Optimizer</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Email Generator</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">Job Tracker</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">PDF Tools</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">WA Generator</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                  <p className="text-[10px] text-muted-foreground text-center mb-2 px-1">
                    Unlock semua tools productivity untuk pencarian kerja
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs h-8"
                    onClick={handleLinkClick}
                  >
                    <a 
                      href="https://t.me/jobmate_support"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Crown className="mr-1.5 h-3 w-3" />
                      Upgrade ke Premium
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
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
