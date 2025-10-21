/**
 * Membership Access Control Utilities
 * 
 * Membership Tiers:
 * - free: Basic access to dashboard only
 * - vip_basic: Access to VIP Career (Loker VIP) only
 * - vip_premium: Full access to VIP Career + JobMate Tools
 * 
 * Access Rules:
 * - VIP Basic: Can ONLY access /vip routes (VIP Career/Loker)
 * - VIP Premium: Can access /vip + /dashboard + /tools (full JobMate)
 * - Free users: No access to VIP or premium features
 */

export type MembershipTier = 'free' | 'vip_basic' | 'vip_premium';

export interface MembershipAccess {
  tier: MembershipTier;
  canAccessVIP: boolean;
  canAccessJobMate: boolean;
  canAccessTools: boolean;
  isActive: boolean;
  expiresAt?: string | null;
  daysLeft?: number;
}

/**
 * Check if membership is active
 */
export function isMembershipActive(
  status: string | null | undefined,
  expiresAt: string | null | undefined
): boolean {
  if (status !== 'active') return false;
  
  // Lifetime membership (no expiry)
  if (!expiresAt) return true;
  
  // Check if not expired
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  return expiryDate > now;
}

/**
 * Calculate days left until membership expires
 */
export function getDaysLeft(expiresAt: string | null | undefined): number | null {
  if (!expiresAt) return null; // Lifetime
  
  const expiryDate = new Date(expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

/**
 * Get membership access details
 */
export function getMembershipAccess(
  membership: string | null | undefined,
  membershipStatus: string | null | undefined,
  membershipExpiry: string | null | undefined
): MembershipAccess {
  const tier = (membership || 'free') as MembershipTier;
  const isActive = isMembershipActive(membershipStatus, membershipExpiry);
  const daysLeft = getDaysLeft(membershipExpiry);

  // VIP Basic: Only VIP Career access
  if (tier === 'vip_basic') {
    return {
      tier: 'vip_basic',
      canAccessVIP: isActive,
      canAccessJobMate: false, // ❌ Cannot access JobMate tools
      canAccessTools: false, // ❌ No tools access
      isActive,
      expiresAt: membershipExpiry,
      daysLeft: daysLeft ?? undefined,
    };
  }

  // VIP Premium: Full access
  if (tier === 'vip_premium') {
    return {
      tier: 'vip_premium',
      canAccessVIP: isActive,
      canAccessJobMate: isActive, // ✅ Full JobMate access
      canAccessTools: isActive, // ✅ All tools access
      isActive,
      expiresAt: membershipExpiry,
      daysLeft: daysLeft ?? undefined,
    };
  }

  // Free user: No special access
  return {
    tier: 'free',
    canAccessVIP: false,
    canAccessJobMate: false,
    canAccessTools: false,
    isActive: true, // Free is always "active"
    expiresAt: null,
  };
}

/**
 * Check if user can access VIP Career routes
 */
export function canAccessVIPCareer(
  membership: string | null | undefined,
  membershipStatus: string | null | undefined,
  membershipExpiry: string | null | undefined
): boolean {
  const access = getMembershipAccess(membership, membershipStatus, membershipExpiry);
  return access.canAccessVIP;
}

/**
 * Check if user can access JobMate tools
 */
export function canAccessJobMateTools(
  membership: string | null | undefined,
  membershipStatus: string | null | undefined,
  membershipExpiry: string | null | undefined
): boolean {
  const access = getMembershipAccess(membership, membershipStatus, membershipExpiry);
  return access.canAccessJobMate;
}

/**
 * Get user-friendly membership label
 */
export function getMembershipLabel(tier: MembershipTier): string {
  switch (tier) {
    case 'vip_basic':
      return 'VIP Basic';
    case 'vip_premium':
      return 'VIP Premium';
    case 'free':
    default:
      return 'Free User';
  }
}

/**
 * Get membership badge color
 */
export function getMembershipBadgeColor(tier: MembershipTier): string {
  switch (tier) {
    case 'vip_premium':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    case 'vip_basic':
      return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300';
    case 'free':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300';
  }
}

/**
 * Get restricted feature message for VIP Basic users
 */
export function getUpgradeMessage(feature: string): string {
  return `Fitur ${feature} hanya tersedia untuk VIP Premium. Upgrade sekarang untuk akses penuh ke semua tools JobMate!`;
}

/**
 * List of JobMate tool routes that require Premium
 */
export const PREMIUM_ONLY_ROUTES = [
  '/dashboard',
  '/tools/cv-generator',
  '/tools/cv-ats',
  '/tools/cover-letter',
  '/tools/email-generator',
  '/tools/wa-generator',
  '/tools/pdf-tools',
  '/tools/tracker',
  '/settings',
] as const;

/**
 * List of VIP Career routes (available for Basic and Premium)
 */
export const VIP_CAREER_ROUTES = [
  '/vip',
  '/vip/loker',
  '/vip/perusahaan',
] as const;

/**
 * Check if route requires premium access
 */
export function isPremiumRoute(pathname: string): boolean {
  return PREMIUM_ONLY_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if route is VIP Career route
 */
export function isVIPCareerRoute(pathname: string): boolean {
  return VIP_CAREER_ROUTES.some(route => pathname.startsWith(route));
}
