"use client";

import * as React from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { signOut } from "@/actions/auth";
import { createClient } from "@/lib/supabase/client";

interface TopbarProps {
  user?: {
    name: string;
    email: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleSignOut = async () => {
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
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect anyway
      window.location.href = "/sign-in";
    }
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-10 h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg border bg-background pl-8 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" disabled>
          <Bell className="h-5 w-5" />
        </Button>

        <ThemeToggle />

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="rounded-full"
          >
            <User className="h-5 w-5" />
          </Button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-card p-2 shadow-lg">
              <div className="px-2 py-2 border-b">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push("/settings")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
