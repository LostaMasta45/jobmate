import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // Get user profile to check role (do this first before any checks)
  let userRole = null;
  if (user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      userRole = profile?.role;
    } catch (error) {
      // If profile check fails, clear the session
      console.error("Profile check failed:", error);
      userRole = null;
    }
  }

  // Allow admin login page (public, no auth required)
  // Don't redirect logged-in admins away from login page to avoid loops
  if (pathname === "/admin/login") {
    // Only redirect if we have a VALID admin session
    if (user && userRole === "admin") {
      // Double check the session is actually valid
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        return NextResponse.redirect(new URL("/admin/applications", request.url));
      }
    }
    // Allow access to login page for everyone else
    return supabaseResponse;
  }

  // AUTH ENABLED - Protect admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/settings")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Redirect after login based on role
  if (
    (pathname.startsWith("/sign-in") || pathname === "/ajukan-akun") &&
    user &&
    userRole
  ) {
    // Admin redirect to admin dashboard
    if (userRole === "admin") {
      return NextResponse.redirect(new URL("/admin/applications", request.url));
    }
    // Regular user redirect to user dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
