"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
  };
  isAdmin?: boolean;
}

export function AppShell({ children, user, isAdmin = false }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

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
        {/* Mobile Header with Hamburger */}
        <header className="flex items-center gap-3 h-16 border-b bg-card px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              JM
            </div>
            <span className="text-lg font-semibold">JobMate</span>
          </div>
        </header>
        
        <Topbar user={user} />
        <main className="flex-1 overflow-y-auto bg-background p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
