/**
 * Demo Mode Detection & Utilities
 * Determines if user is in demo mode or has premium access
 */

import { createClient } from "@/lib/supabase/client";

export interface DemoStatus {
  isDemoMode: boolean;
  isLoggedIn: boolean;
  isPremium: boolean;
  membership?: string;
  reason?: string;
}

/**
 * Check if user is in demo mode
 * Returns true if user is not logged in or doesn't have premium
 */
export async function getDemoStatus(): Promise<DemoStatus> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Not logged in = demo mode
    if (!user) {
      return {
        isDemoMode: true,
        isLoggedIn: false,
        isPremium: false,
        reason: 'not_logged_in'
      };
    }
    
    // Check membership
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("membership, membership_status")
      .eq("id", user.id)
      .single();
    
    if (error || !profile) {
      console.error('[DemoMode] Failed to get profile:', error);
      return {
        isDemoMode: true,
        isLoggedIn: true,
        isPremium: false,
        reason: 'profile_error'
      };
    }
    
    // Check if premium member
    const isPremium = profile.membership === 'vip_premium' && 
                      profile.membership_status === 'active';
    
    return {
      isDemoMode: !isPremium,
      isLoggedIn: true,
      isPremium,
      membership: profile.membership,
      reason: isPremium ? 'premium_active' : 'not_premium'
    };
  } catch (error) {
    console.error('[DemoMode] Error checking demo status:', error);
    return {
      isDemoMode: true,
      isLoggedIn: false,
      isPremium: false,
      reason: 'error'
    };
  }
}

/**
 * Simple check if user is in demo mode (client-side only)
 * Use this for quick checks without async/await
 */
export function isLikelyDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if there's a session cookie
  const hasCookie = document.cookie.includes('sb-');
  return !hasCookie;
}

/**
 * Show upgrade modal/prompt
 */
export function showUpgradePrompt(toolName: string, context?: any): void {
  if (typeof window === 'undefined') return;
  
  const event = new CustomEvent('show-upgrade-modal', {
    detail: { 
      toolName,
      context,
      timestamp: Date.now()
    }
  });
  
  window.dispatchEvent(event);
  
  // Track analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', 'upgrade_prompt_shown', {
      tool_name: toolName,
      context: JSON.stringify(context)
    });
  }
}

/**
 * Get demo limitations for a specific tool
 */
export function getDemoLimitations(toolName: string): string[] {
  const limitations: { [key: string]: string[] } = {
    'cv-ats': [
      'Download PDF/DOCX dikunci',
      'Save to dashboard dikunci',
      'ATS score checker read-only'
    ],
    'email-generator': [
      'Copy to clipboard dikunci',
      'Send to email dikunci',
      'Save template dikunci'
    ],
    'tracker': [
      'Add new application dikunci',
      'Edit existing dikunci',
      'Data tidak disimpan (session only)'
    ],
    'surat-lamaran': [
      'Download Word dikunci',
      'Download PDF dikunci',
      'Save template dikunci'
    ],
    'wa-generator': [
      'Copy to clipboard dikunci',
      'Generate more variations dikunci',
      'Save favorites dikunci'
    ],
    'pdf-tools': [
      'Download result dikunci',
      'Max 2 files, 5MB each',
      'Batch processing (3+ files) dikunci'
    ]
  };
  
  return limitations[toolName] || ['Download dan save dikunci'];
}

/**
 * Get upgrade benefits for a specific tool
 */
export function getUpgradeBenefits(toolName: string): string[] {
  const benefits: { [key: string]: string[] } = {
    'cv-ats': [
      'Download PDF professional',
      'Download DOCX editable',
      'Save ke dashboard',
      'Unlimited CV generation',
      'Full ATS checker access'
    ],
    'email-generator': [
      'Copy to clipboard (1-click)',
      'Send directly to email',
      'Save unlimited templates',
      'Generate 5+ variations'
    ],
    'tracker': [
      'Track unlimited aplikasi',
      'Auto-save ke cloud',
      'Reminder follow-up via email',
      'Export ke Excel/PDF',
      'Analytics & statistics'
    ],
    'surat-lamaran': [
      'Download Word (.docx)',
      'Download PDF',
      'Save unlimited templates',
      'Edit anytime from dashboard'
    ],
    'wa-generator': [
      'Copy ke clipboard',
      'Generate 10+ variasi',
      'Save template favorites',
      'Spintax advanced features'
    ],
    'pdf-tools': [
      'Download merged/compressed PDF',
      'Unlimited files & size',
      'Batch processing',
      'Priority processing speed'
    ]
  };
  
  return benefits[toolName] || [
    'Download hasil unlimited',
    'Save ke dashboard',
    'Akses 5 tools lainnya',
    'Update selamanya'
  ];
}

/**
 * Format upgrade URL with tracking params
 */
export function getUpgradeUrl(source: string, toolName?: string): string {
  const params = new URLSearchParams({
    plan: 'premium',
    source: source
  });
  
  if (toolName) {
    params.append('tool', toolName);
  }
  
  return `/vip?${params.toString()}`;
}

/**
 * Check if feature is available in demo mode
 */
export function isDemoFeatureAllowed(feature: string): boolean {
  const allowedFeatures = [
    'view',
    'preview',
    'generate',
    'fill_form',
    'select_template',
    'drag_drop',
    'calculate'
  ];
  
  return allowedFeatures.includes(feature);
}

/**
 * Get demo CTA text based on context
 */
export function getDemoCTAText(action: 'download' | 'save' | 'copy' | 'export'): string {
  const texts = {
    download: 'Download - Upgrade Required',
    save: 'Save - Upgrade Required',
    copy: 'Copy - Upgrade Required',
    export: 'Export - Upgrade Required'
  };
  
  return texts[action] || 'Upgrade Required';
}
