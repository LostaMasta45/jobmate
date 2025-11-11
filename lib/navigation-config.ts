/**
 * Navigation Configuration
 * Centralized config for bottom bar visibility rules
 */

// Routes where bottom bar should be HIDDEN on mobile
// (tools in editor/working mode that need full screen space)
export const hideBottomBarRoutes = [
  '/tools/cv-ats',
  '/tools/cv-creative',
  '/tools/cv-profile',
  '/tools/surat-lamaran',
  '/tools/cover-letter',
  '/tools/interview-prep',
  '/tools/email-generator',
  '/tools/email-template',
  '/tools/wa-generator',
  '/tools/tracker',
  '/tools/pdf-tools',
] as const;

/**
 * Check if bottom bar should be hidden for current pathname
 * @param pathname - Current route pathname
 * @returns true if bottom bar should be hidden
 */
export function shouldHideBottomBar(pathname: string): boolean {
  // Always show on exact /tools page (menu selection)
  if (pathname === '/tools') {
    return false;
  }
  
  // Always show on history pages (browsing mode, not editing)
  if (pathname.includes('/history')) {
    return false;
  }
  
  // Always show on followups pages (tracker sub-pages)
  if (pathname.includes('/followups')) {
    return false;
  }
  
  // Check if current path matches any hide routes
  return hideBottomBarRoutes.some(route => pathname.startsWith(route));
}

/**
 * Get appropriate bottom padding class based on bottom bar visibility
 * @param hideBottomBar - Whether bottom bar is hidden
 * @returns Tailwind padding class
 */
export function getMainPaddingClass(hideBottomBar: boolean): string {
  // When bottom bar hidden: normal padding (pb-8)
  // When bottom bar shown: extra padding for bottom bar space (pb-36 on mobile, pb-8 on desktop)
  return hideBottomBar ? 'pb-8' : 'pb-36 lg:pb-8';
}
