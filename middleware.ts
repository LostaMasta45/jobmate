import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow webhook endpoints (no auth required)
  if (pathname.startsWith('/api/webhooks/')) {
    console.log('[MIDDLEWARE] Webhook endpoint, bypassing auth:', pathname);
    return NextResponse.next();
  }

  // Allow payment routes (public access for checkout)
  if (pathname.startsWith('/payment') || pathname.startsWith('/api/payment/')) {
    console.log('[MIDDLEWARE] Payment route, public access:', pathname);
    return NextResponse.next();
  }

  // Allow admin login page (public access)
  if (pathname === '/admin-login' || pathname.startsWith('/admin-login/')) {
    console.log('[MIDDLEWARE] Admin login page, public access');
    return NextResponse.next();
  }

  // Define PUBLIC routes (routes that DO NOT require login)
  const publicRoutes = [
    '/',
    '/sign-in',
    '/login',
    '/reset',
    '/verify',
    '/ajukan-akun',
    '/cek-status-pengajuan',
    '/toolsjobmate',
    '/revisi',
    '/test-public',
    '/generate-thumbnails',
    '/admin-login', // Admin login is public
  ];

  // Check if current path is public
  const isPublic = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname === route || pathname.startsWith(route + '/');
  });

  // If public, allow access immediately
  if (isPublic) {
    console.log('[MIDDLEWARE] Public route, bypassing auth:', pathname);
    return NextResponse.next();
  }

  // Define PROTECTED routes (routes that REQUIRE login)
  const protectedRoutes = [
    '/vip',           // VIP Career Portal
    '/dashboard',     // User dashboard
    '/tools/',        // JobMate Premium tools (with trailing slash to avoid matching /toolsjobmate)
    '/admin',         // Admin panel (but NOT /admin-login)
    '/settings',      // User settings
    '/applications',  // Job applications
    '/surat-lamaran-sederhana', // Surat lamaran tool
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

  // Get cached data
  let userRole: string | undefined = cachedRole;
  let membership: string | undefined = request.cookies.get('user_membership')?.value;
  let membershipStatus: string | undefined = request.cookies.get('user_membership_status')?.value;
  let membershipExpiry: string | undefined;

  // Determine if we need to query database
  // Query if: accessing protected routes OR cache is missing/incomplete
  const isProtectedRoute = pathname.startsWith("/vip") || 
                          pathname.startsWith("/admin/") || 
                          pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/tools") ||
                          pathname.startsWith("/settings");
  
  const needsProfileQuery = isProtectedRoute || 
                           (!userRole && user) ||
                           (membership && !membershipStatus); // Has membership but missing status

  if (user && needsProfileQuery) {
    try {
      // Query profile data only when needed
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, membership, membership_status, membership_expiry")
        .eq("id", user.id)
        .single();
      
      userRole = profile?.role;
      membership = profile?.membership;
      membershipStatus = profile?.membership_status;
      membershipExpiry = profile?.membership_expiry;
      
      // Cache role, membership, and status in cookies (1 hour)
      if (userRole) {
        supabaseResponse.cookies.set('user_role', userRole, {
          maxAge: 3600,
          httpOnly: true,
          sameSite: 'lax',
          path: '/'
        });
      }
      if (membership) {
        supabaseResponse.cookies.set('user_membership', membership, {
          maxAge: 3600,
          httpOnly: true,
          sameSite: 'lax',
          path: '/'
        });
      }
      if (membershipStatus) {
        supabaseResponse.cookies.set('user_membership_status', membershipStatus, {
          maxAge: 3600,
          httpOnly: true,
          sameSite: 'lax',
          path: '/'
        });
      }
    } catch (error) {
      console.error("[MIDDLEWARE] Profile query error:", error);
      userRole = undefined;
    }
  }
  
  // Clear cache if user is logged out
  if (!user && (cachedRole || membership || membershipStatus)) {
    supabaseResponse.cookies.delete('user_role');
    supabaseResponse.cookies.delete('user_membership');
    supabaseResponse.cookies.delete('user_membership_status');
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
    let isActive = false;
    
    if (membership === 'vip_premium') {
      // VIP Premium is LIFETIME - only check status, ignore expiry
      isActive = membershipStatus === 'active';
    } else if (membership === 'vip_basic') {
      // VIP Basic has expiry - check both status and expiry date
      isActive = membershipStatus === 'active' && 
                 (!membershipExpiry || new Date(membershipExpiry) > new Date());
    }
    
    if (!isActive) {
      console.log('[MIDDLEWARE] VIP membership expired or inactive');
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
      // VIP Premium is LIFETIME - only check status, ignore expiry
      const isPremiumActive = membershipStatus === 'active';
      
      if (isPremiumActive) {
        console.log('[MIDDLEWARE] VIP Premium access granted to JobMate');
        return supabaseResponse;
      } else {
        console.log('[MIDDLEWARE] VIP Premium status is not active');
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

  // AUTH ENABLED - Protect admin routes (but exclude /admin-login)
  if (pathname.startsWith("/admin")) {
    // Skip auth check if it's admin-login page (already handled as public)
    if (pathname === "/admin-login" || pathname.startsWith("/admin-login/")) {
      console.log('[MIDDLEWARE] Admin login page, skipping admin auth check');
      return NextResponse.next();
    }

    // For other admin routes, require authentication
    if (!user) {
      console.log('[MIDDLEWARE] Admin route requires auth, redirecting to admin-login');
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }

    if (userRole !== "admin") {
      console.log('[MIDDLEWARE] User is not admin, access denied');
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
