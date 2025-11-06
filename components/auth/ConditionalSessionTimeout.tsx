"use client";

import { usePathname } from "next/navigation";
import { SessionTimeout } from "./SessionTimeout";

/**
 * Wrapper for SessionTimeout that only renders on protected routes
 * Public routes don't need session timeout checking
 */
export function ConditionalSessionTimeout() {
  const pathname = usePathname();

  // Define PUBLIC routes first (explicit list, same as middleware)
  const publicRoutes = [
    "/",
    "/sign-in",
    "/login",
    "/reset",
    "/verify",
    "/ajukan-akun",
    "/cek-status-pengajuan",
    "/toolsjobmate",
    "/revisi",
    "/test-public",
    "/generate-thumbnails",
    "/admin-login", // ← Admin login is PUBLIC
    "/payment",
  ];

  // Check if current path is public (must check pathname exists first)
  if (!pathname) return null;
  
  const isPublic = publicRoutes.some(route => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname === route || pathname.startsWith(route + "/");
  });

  // If public, skip SessionTimeout
  if (isPublic) {
    // Don't log for every render to reduce console spam
    return null;
  }

  // Define PROTECTED routes (routes that REQUIRE login)
  const protectedRoutes = [
    "/vip",           // VIP Career Portal
    "/dashboard",     // User dashboard
    "/tools/",        // JobMate Premium tools (with trailing slash to avoid /toolsjobmate)
    "/admin/",        // Admin panel (but NOT /admin-login)
    "/settings",      // User settings
    "/applications",  // Job applications
    "/surat-lamaran-sederhana", // Surat lamaran tool
  ];

  // Check if current path is protected
  const isProtected = protectedRoutes.some(route => {
    if (route === "/tools/") {
      // Special handling: /tools/ is protected, but /toolsjobmate is not
      return pathname.startsWith("/tools/") || pathname === "/tools";
    }
    if (route === "/admin/") {
      // Special handling: /admin/* is protected, but /admin-login is not (handled above)
      return pathname.startsWith("/admin/");
    }
    return pathname.startsWith(route);
  });

  // Only render SessionTimeout on protected routes
  if (!isProtected) {
    return null;
  }

  return <SessionTimeout timeoutMinutes={120} />;
}
