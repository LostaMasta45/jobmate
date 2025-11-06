"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/actions/auth";

interface SessionTimeoutProps {
  timeoutMinutes?: number; // Inactivity timeout in minutes (default: 120 = 2 hours)
  warningMinutes?: number; // Show warning before logout (default: 5 minutes before)
}

export function SessionTimeout({
  timeoutMinutes = 120, // 2 hours default
  warningMinutes = 5,
}: SessionTimeoutProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const isPublicRoute = () => {
    // Define PROTECTED routes (routes that REQUIRE login)
    const protectedRoutes = [
      "/vip",           // VIP Career Portal
      "/dashboard",     // User dashboard
      "/tools",         // JobMate Premium tools
      "/admin",         // Admin panel
      "/settings",      // User settings
      "/applications",  // Job applications
      "/surat-lamaran-sederhana", // Surat lamaran tool
    ];
    
    // Check if current path is protected
    const isProtected = protectedRoutes.some(route => pathname?.startsWith(route));
    
    // Return true if NOT protected (i.e., it's public)
    return !isProtected;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      
      // Hard redirect to clear all state
      if (pathname?.startsWith("/admin")) {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/sign-in";
      }
    } catch (error) {
      console.error("Auto-logout error:", error);
      // Force redirect even on error
      if (pathname?.startsWith("/admin")) {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/sign-in";
      }
    }
  };

  const resetTimeout = () => {
    lastActivityRef.current = Date.now();

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Skip timeout on public routes
    if (isPublicRoute()) {
      return;
    }

    // Set new timeout
    const timeoutMs = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, timeoutMs);
  };

  useEffect(() => {
    // Skip session check on public routes
    if (isPublicRoute()) {
      return;
    }

    // Monitor auth state changes (don't check session immediately, middleware already did)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        resetTimeout();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  useEffect(() => {
    // Skip if on public route
    if (isPublicRoute()) {
      return;
    }

    // Activity event listeners
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      resetTimeout();
    };

    // Add event listeners for user activity
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Initialize timeout
    resetTimeout();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, timeoutMinutes]);

  // This component doesn't render anything
  return null;
}
