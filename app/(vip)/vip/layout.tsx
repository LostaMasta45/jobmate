'use client'

import { useState } from 'react'
import { VIPSidebarImproved } from '@/components/vip/VIPSidebarImproved'
import { VIPHeader } from '@/components/vip/VIPHeader'
import { VerificationBanner, VerificationSuccessToast } from '@/components/vip/VerificationBanner'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

export default function VIPLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header - Fixed Top, z-50 */}
      <VIPHeader onMenuToggle={() => setSidebarOpen(true)} />
      
      {/* Verification Banner - Below header, z-30 */}
      <VerificationBanner />
      <VerificationSuccessToast />
      
      {/* Mobile Sidebar - No Overlay */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen} modal={false}>
        <SheetContent side="left" className="w-[280px] sm:w-80 p-0 border-r z-40">
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
        
        {/* Main Content Area - Proper spacing */}
        <main className="flex-1 w-full pt-16 lg:ml-72 bg-gray-50 dark:bg-slate-950 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
