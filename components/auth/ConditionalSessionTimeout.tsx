"use client";

import { usePathname } from "next/navigation";
import { SessionTimeout } from "./SessionTimeout";

/**
 * Wrapper for SessionTimeout that only renders on protected routes
 * Public routes don't need session timeout checking
 */
export function ConditionalSessionTimeout() {
  const pathname = usePathname();

  // Define PROTECTED routes (routes that REQUIRE login)
  const protectedRoutes = [
    "/vip",           // VIP Career Portal
    "/dashboard",     // User dashboard
    "/tools/",        // JobMate Premium tools (with trailing slash to avoid /toolsjobmate)
    "/admin",         // Admin panel
    "/settings",      // User settings
    "/applications",  // Job applications
    "/surat-lamaran", // Surat lamaran tool
  ];

  // Check if current path is protected
  // Important: /tools/ vs /toolsjobmate distinction
  const isProtected = protectedRoutes.some(route => {
    if (route === "/tools/") {
      // Special handling: /tools/ is protected, but /toolsjobmate is not
      return pathname?.startsWith("/tools/") || pathname === "/tools";
    }
    return pathname?.startsWith(route);
  });

  // Only render SessionTimeout on protected routes
  if (!isProtected) {
    console.log('[ConditionalSessionTimeout] Public route, skipping SessionTimeout:', pathname);
    return null;
  }

  console.log('[ConditionalSessionTimeout] Protected route, enabling SessionTimeout:', pathname);
  return <SessionTimeout timeoutMinutes={120} />;
}
