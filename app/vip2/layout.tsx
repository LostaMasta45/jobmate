'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// Lazy load heavy components for better initial load performance
const VIPSidebarImproved = dynamic(
  () => import('@/components/vip/VIPSidebarImproved').then(mod => ({ default: mod.VIPSidebarImproved })),
  { ssr: false } // Sidebar not needed for SSR
)

const VIPHeader = dynamic(
  () => import('@/components/vip/VIPHeader').then(mod => ({ default: mod.VIPHeader })),
  { ssr: true } // Header needed for SEO
)

// Use the NEW V2 Bottom Bar here
const VIPBottomBar = dynamic(
  () => import('@/components/mobile/VIPBottomBarV2').then(mod => ({ default: mod.VIPBottomBarV2 })),
  { ssr: false } // Bottom bar not needed for SSR
)

const VerificationBanner = dynamic(
  () => import('@/components/vip/VerificationBanner').then(mod => ({ default: mod.VerificationBanner })),
  { ssr: false }
)

const VerificationSuccessToast = dynamic(
  () => import('@/components/vip/VerificationBanner').then(mod => ({ default: mod.VerificationSuccessToast })),
  { ssr: false }
)

export default function VIPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header - Fixed Top, z-50 - Hide hamburger on mobile */}
      <VIPHeader onMenuToggle={() => setSidebarOpen(true)} />
      
      {/* Verification Banner - Below header, z-30 */}
      <VerificationBanner />
      <VerificationSuccessToast />
      
      {/* Mobile Sidebar - Only accessible on desktop when clicking menu */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} modal={false}>
        <SheetContent side="left" className="w-[280px] sm:w-80 p-0 border-r z-40 lg:hidden">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <VIPSidebarImproved />
        </SheetContent>
      </Sheet>
      
      {/* Desktop Layout */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar - Fixed, below header, z-40 */}
        <aside className="hidden lg:block w-72 fixed left-0 top-16 bottom-0 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden z-40">
          <VIPSidebarImproved />
        </aside>
        
        {/* Main Content Area - Proper spacing + bottom padding for mobile nav + overflow handling */}
        <main className="flex-1 w-full pt-20 sm:pt-24 pb-24 lg:pb-8 lg:ml-72 bg-gray-50 dark:bg-slate-900 min-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - Replaces Sidebar on Mobile */}
      <VIPBottomBar />
    </div>
  )
}
