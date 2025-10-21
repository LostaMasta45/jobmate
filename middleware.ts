import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define PROTECTED routes (routes that REQUIRE login)
  const protectedRoutes = [
    '/vip',           // VIP Career Portal
    '/dashboard',     // User dashboard
    '/tools/',        // JobMate Premium tools (with trailing slash to avoid matching /toolsjobmate)
    '/admin',         // Admin panel
    '/settings',      // User settings
    '/applications',  // Job applications
    '/surat-lamaran', // Surat lamaran tool
  ];

  // Check if current path is protected
  // Special handling for /tools/ vs /toolsjobmate
  const isProtected = protectedRoutes.some(route => {
    if (route === '/tools/') {
      // Match /tools or /tools/* but NOT /toolsjobmate
      return pathname === '/tools' || pathname.startsWith('/tools/');
    }
    return pathname.startsWith(route);
  });
  
  // If NOT protected, allow public access
  if (!isProtected) {
    console.log('[MIDDLEWARE] Public route detected:', pathname);
    return NextResponse.next();
  }

  const { supabaseResponse, user, supabase, cachedRole } = await updateSession(request);

  // Get user role & membership
  // IMPORTANT: Always query for logged-in users to get fresh membership data
  let userRole: string | undefined = cachedRole;
  let membership: string | undefined;
  let membershipStatus: string | undefined;
  let membershipExpiry: string | undefined;

  if (user) {
    try {
      // Query profile data (including membership) for every request
      // This ensures membership is always fresh
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership, membership_status, membership_expiry")
        .eq("id", user.id)
        .single();
      
      userRole = profile?.role;
      membership = profile?.membership;
      membershipStatus = profile?.membership_status;
      membershipExpiry = profile?.membership_expiry;
      
      // DEBUG LOG - Remove after testing
      console.log('[MIDDLEWARE] User:', user.email);
      console.log('[MIDDLEWARE] Role:', userRole);
      console.log('[MIDDLEWARE] Membership:', membership);
      console.log('[MIDDLEWARE] Membership Status:', membershipStatus);
      console.log('[MIDDLEWARE] Path:', pathname);
      
      // Cache role in cookie for 1 hour (optional optimization)
      if (userRole && !cachedRole) {
        supabaseResponse.cookies.set('user_role', userRole, {
          maxAge: 3600, // 1 hour
          httpOnly: true,
          sameSite: 'lax',
          path: '/'
        });
      }
    } catch (error) {
      console.error("[MIDDLEWARE] Profile check failed:", error);
      userRole = undefined;
    }
  }
  
  // Clear role cache if user is logged out
  if (!user && cachedRole) {
    supabaseResponse.cookies.delete('user_role');
  }

  // VIP Career routes - require login & VIP membership (Basic or Premium)
  if (pathname.startsWith("/vip")) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Admin always has access
    if (userRole === "admin") {
      return supabaseResponse;
    }

    // Check if user has VIP Basic or VIP Premium
    if (!['vip_basic', 'vip_premium'].includes(membership || '')) {
      console.log('[MIDDLEWARE] No VIP membership, user needs to subscribe');
      // User doesn't have VIP membership → redirect to sign-in with message
      return NextResponse.redirect(new URL("/sign-in?message=vip_required", request.url));
    }

    // Check membership status for VIP users
    const isActive = membershipStatus === 'active' && 
                     (!membershipExpiry || new Date(membershipExpiry) > new Date());
    
    if (!isActive) {
      console.log('[MIDDLEWARE] VIP membership expired');
      // Membership expired → redirect with message
      return NextResponse.redirect(new URL("/sign-in?message=membership_expired", request.url));
    }

    // All good - VIP user (Basic or Premium) with active membership
    console.log('[MIDDLEWARE] VIP access granted:', membership);
    return supabaseResponse;
  }

  // JobMate routes (dashboard, tools, settings) - VIP PREMIUM ONLY
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tools") ||
    pathname.startsWith("/settings")
  ) {
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Admin always has access
    if (userRole === "admin") {
      return supabaseResponse;
    }

    // Only VIP PREMIUM users can access JobMate Tools
    if (membership === 'vip_premium') {
      // Check if premium is still active
      const isPremiumActive = membershipStatus === 'active' && 
                              (!membershipExpiry || new Date(membershipExpiry) > new Date());
      
      if (isPremiumActive) {
        console.log('[MIDDLEWARE] VIP Premium access granted to JobMate');
        return supabaseResponse;
      } else {
        console.log('[MIDDLEWARE] VIP Premium expired');
        return NextResponse.redirect(new URL("/sign-in?message=membership_expired", request.url));
      }
    }

    // VIP Basic users trying to access Premium features → redirect to VIP home
    if (membership === 'vip_basic') {
      console.log('[MIDDLEWARE] VIP Basic user blocked from JobMate tools, redirecting to VIP home');
      return NextResponse.redirect(new URL("/vip?message=premium_only", request.url));
    }

    // Free users or non-members → redirect to VIP home
    console.log('[MIDDLEWARE] Non-member trying to access JobMate');
    return NextResponse.redirect(new URL("/vip?message=premium_required", request.url));
  }

  // AUTH ENABLED - Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Note: Redirect after login is now handled in the login page itself
  // No need to redirect from middleware to avoid conflicts

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
