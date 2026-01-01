"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { VIPHeader } from "@/components/vip/VIPHeader";
import { BottomBar } from "@/components/mobile/BottomBar";
import { shouldHideBottomBar, getMainPaddingClass } from "@/lib/navigation-config";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  isAdmin?: boolean;
  hideMobileHeader?: boolean;
  isFullScreen?: boolean;
}

export function AppShell({ children, user, isAdmin = false, hideMobileHeader = false, isFullScreen = false }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const hideBottomBar = shouldHideBottomBar(pathname);

  // Prevent body scroll when mobile menu is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // Close mobile menu when screen becomes large
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isAdmin={isAdmin}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* VIP Header with theme toggle & notifications - Replaces MobileHeader */}
        {!hideMobileHeader && (
          <div className="lg:hidden">
            <VIPHeader user={user} />
          </div>
        )}

        {/* Desktop Topbar - hidden on mobile */}
        <div className="hidden lg:block">
          <Topbar user={user} />
        </div>

        {/* Main content */}
        <main className={`flex-1 bg-background ${isFullScreen
          ? 'overflow-hidden flex flex-col'
          : `overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 ${hideMobileHeader ? '' : 'pt-12 sm:pt-14'} lg:pt-8 ${getMainPaddingClass(hideBottomBar)}`
          }`}>
          {isFullScreen ? (
            children
          ) : (
            <div className="mx-auto max-w-7xl w-full">{children}</div>
          )}
        </main>

        {/* Mobile Bottom Navigation Bar - Always visible on mobile */}
        {!isFullScreen && <BottomBar />}
      </div>
    </div>
  );
}
