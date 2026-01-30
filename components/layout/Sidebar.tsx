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
  Target,
  BookOpen,
  GraduationCap,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  admin?: boolean;
  vip?: boolean;
  premiumOnly?: boolean;
}

interface NavGroup {
  label?: string; // Optional header for the group
  items: NavItem[];
  admin?: boolean; // If true, the whole group is admin only
}

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Job Tracker",
        href: "/tools/tracker",
        icon: KanbanSquare,
        premiumOnly: true,
      },
    ],
  },
  {
    label: "Job Portal",
    items: [
      {
        title: "Lowongan Kerja",
        href: "/vip",
        icon: Briefcase,
        vip: true,
      },
      {
        title: "Perusahaan",
        href: "/vip/perusahaan",
        icon: Building2,
        vip: true,
      },
    ],
  },
  {
    label: "Productivity Tools",
    items: [
      {
        title: "Surat Lamaran",
        href: "/surat-lamaran-sederhana",
        icon: FileSignature,
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
        title: "CV Creative",
        href: "/tools/cv-creative",
        icon: Palette,
        premiumOnly: true,
      },
      {
        title: "Interview Prep",
        href: "/tools/interview-prep",
        icon: Target,
        premiumOnly: true,
      },
      {
        title: "WA Generator",
        href: "/tools/wa-generator",
        icon: MessageSquareText,
        premiumOnly: true,
      },
      {
        title: "PDF Tools",
        href: "/tools/pdf-tools",
        icon: FileCog,
        premiumOnly: true,
      },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        title: "Panduan & Tutorial",
        href: "/docs",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings2,
      },
    ],
  },
  {
    label: "Admin Panel",
    admin: true,
    items: [
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
    ],
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
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jobmate_sidebar_collapsed") === "true";
    }
    return false;
  });
  const [membership, setMembership] = React.useState(membershipProp);
  const [toolsExpanded, setToolsExpanded] = React.useState(false);
  const fetchedRef = React.useRef(false);

  // Fetch user's membership if not provided as prop - only once
  React.useEffect(() => {
    if (fetchedRef.current) return;
    if (membershipProp && membershipProp !== 'free') return;

    fetchedRef.current = true;

    const fetchMembership = async () => {
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
    };

    fetchMembership();
  }, [membershipProp]);

  const toggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    if (typeof window !== "undefined") {
      localStorage.setItem("jobmate_sidebar_collapsed", String(newState));
    }
  };

  // Filter items based on role and membership - memoized for performance
  const filteredGroups = React.useMemo(() => {
    return navGroups.reduce<NavGroup[]>((acc, group) => {
      if (group.admin && !isAdmin) return acc;

      const filteredItems = group.items.filter((item) => {
        if (item.admin && !isAdmin) return false;
        if (item.premiumOnly && membership !== 'vip_premium') return false;
        return true;
      });

      if (filteredItems.length > 0) {
        acc.push({ ...group, items: filteredItems });
      }

      return acc;
    }, []);
  }, [isAdmin, membership]);

  const handleLinkClick = React.useCallback(() => {
    onMobileClose?.();
  }, [onMobileClose]);

  // Desktop Sidebar Content
  const DesktopSidebarContent = () => (
    <div className="flex flex-col h-full bg-background/60 dark:bg-black/90 backdrop-blur-xl border-r border-border/40 transition-all duration-300 shadow-[1px_0_20px_rgba(0,0,0,0.02)]">
      <div className="flex h-16 items-center justify-center border-b border-border/40 px-4">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center justify-center hover:scale-105 transition-transform duration-200 group">
            <div className="relative h-9 w-36 flex-shrink-0">
              <Image
                src="/Logo/x.png"
                alt="JobMate Logo"
                fill
                className="object-contain filter drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300"
                priority
              />
            </div>
          </Link>
        ) : (
          <Link href="/dashboard" className="mx-auto flex items-center hover:scale-110 transition-transform duration-200 group">
            <div className="relative h-8 w-8 flex-shrink-0">
              <Image
                src="/Logo/x.png"
                alt="JobMate Logo"
                fill
                className="object-contain filter drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all duration-300"
                priority
              />
            </div>
          </Link>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/30">
        {filteredGroups.map((group, groupIndex) => (
          <div key={group.label || groupIndex} className="space-y-1">
            {!collapsed && group.label && (
              <h4 className="px-2 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-2 font-mono">
                {group.label}
              </h4>
            )}
            {collapsed && group.label && (
              <div className="flex justify-center mb-1">
                <span className="w-4 h-[1px] bg-border/60"></span>
              </div>
            )}

            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary shadow-[0_2px_10px_rgba(var(--primary),0.05)]"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:translate-x-1"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                  )}

                  <Icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-all duration-300 group-hover:scale-110",
                    isActive ? "text-primary filter drop-shadow-sm" : "group-hover:text-foreground",
                    item.vip && !isActive && "text-blue-500/80 dark:text-blue-400/80"
                  )} />

                  {!collapsed && (
                    <span className="truncate flex items-center gap-2 transition-all duration-300">
                      {item.title}
                      {item.vip && !isActive && (
                        <span className="text-[9px] px-1.5 py-px rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold shadow-sm">
                          VIP
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Tools Jobmate Preview Section - For VIP Basic users */}
        {membership === 'vip_basic' && !collapsed && (
          <div className="mt-4 border-t border-border/40 pt-3">
            <div className="px-2 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-2 font-mono">
              Premium
            </div>
            <button
              onClick={() => setToolsExpanded(!toolsExpanded)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-purple-500/10">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>Unlock Tools</span>
              </div>
              {toolsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {toolsExpanded && (
              <div className="mt-2 space-y-1 rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 p-2 animate-in slide-in-from-top duration-300">
                <div className="space-y-0.5 mb-2">
                  {[
                    "Surat Lamaran AI",
                    "CV ATS Optimizer",
                    "CV Creative",
                    "Email Generator",
                    "Job Tracker",
                    "PDF Tools",
                    "WA Generator"
                  ].map((tool, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2 py-1.5 text-xs text-muted-foreground/80 hover:text-foreground transition-colors">
                      <Lock className="h-3 w-3 text-purple-500/70" />
                      <span className="font-medium truncate">{tool}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-purple-500/10">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs h-8 shadow-lg shadow-purple-500/20"
                  >
                    <a
                      href="https://t.me/jobmate_support"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Crown className="mr-1.5 h-3 w-3" />
                      Get Premium
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Membership Badge */}
      {membership === 'vip_basic' && !collapsed && (
        <div className="border-t border-border/40 p-3 space-y-3 bg-gradient-to-t from-background/50 to-transparent">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
            <div className="p-1.5 rounded-full bg-blue-500/20">
              <Crown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              VIP Basic Member
            </span>
          </div>
          <Button
            asChild
            size="sm"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-500/20 transition-all hover:scale-[1.02]"
          >
            <Link href="/pricing?upgrade=premium">
              Upgrade Premium ⭐
            </Link>
          </Button>
        </div>
      )}

      <div className="border-t border-border/40 p-3">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          onClick={toggleCollapse}
          className={cn(
            "w-full transition-all duration-200 hover:bg-muted/60 text-muted-foreground",
            collapsed ? "px-0" : "justify-between px-3"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <span className="flex items-center gap-2 font-medium">
                <ChevronLeft className="h-4 w-4" />
                <span className="text-xs uppercase tracking-wider">Collapse</span>
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Mobile Sidebar Content
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between border-b border-border/40 px-4 bg-transparent">
        <Link href="/dashboard" className="flex items-center justify-center flex-1" onClick={handleLinkClick}>
          <div className="relative h-9 w-36 flex-shrink-0">
            <Image
              src="/Logo/x.png"
              alt="JobMate Logo"
              fill
              className="object-contain filter custom-drop-shadow"
              priority
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileClose}
          className="flex-shrink-0 hover:bg-muted/50 rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">
        {filteredGroups.map((group, groupIndex) => (
          <div key={group.label || groupIndex} className="space-y-1">
            {group.label && (
              <h4 className="px-2 text-[10px] uppercase font-bold text-muted-foreground/60 tracking-widest mb-2 font-mono">
                {group.label}
              </h4>
            )}

            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-primary/10 to-transparent text-primary shadow-sm border-l-4 border-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", item.vip && !isActive && "text-blue-500")} />
                  <span className="flex items-center gap-2">
                    {item.title}
                    {item.vip && !isActive && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/20">
                        VIP
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}

        {membership === 'vip_basic' && (
          <div className="mt-4 border-t border-border/40 pt-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/10 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-sm">Premium Tools</span>
              </div>
              <Button
                asChild
                size="sm"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs h-9 shadow-lg"
                onClick={handleLinkClick}
              >
                <a href="https://t.me/jobmate_support" target="_blank">
                  <Crown className="mr-1.5 h-3 w-3" />
                  Upgrade Now
                </a>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <DesktopSidebarContent />
      </aside>
      {/* Spacer to push content since sidebar is fixed */}
      <div className={cn("hidden lg:block flex-shrink-0 transition-all duration-300", collapsed ? "w-20" : "w-72")} />

      {/* Mobile Sidebar - Drawer */}
      {mobileOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            onClick={onMobileClose}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-80 bg-background/95 backdrop-blur-2xl z-50 flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl border-r border-border/50">
            <MobileSidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
