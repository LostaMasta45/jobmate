'use client'

import { useState, useEffect } from 'react'
import { ModernLokerCard } from './ModernLokerCard'
import { JobCardMobile } from '@/components/mobile/JobCardMobile'
import { JobCardModern } from '@/components/mobile/JobCardModern'
import { QuickFilterChips } from '@/components/mobile/QuickFilterChips'
import { SuggestedJobsCarousel } from '@/components/mobile/SuggestedJobsCarousel'
import { FilterBottomSheet, FilterState } from '@/components/mobile/FilterBottomSheet'
import { TabFilterNavigation } from './TabFilterNavigation'
import { FloatingActionMenu } from './FloatingActionMenu'
import { ScrollToTop } from './ScrollToTop'
import { NewJobsBanner } from './NewJobsBanner'
import { LokerCardSkeleton } from './LokerCardSkeleton'
import { toast } from '@/components/mobile/ToastNotification'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Sparkles } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface ModernLokerListProps {
  initialLoker: Loker[]
  totalResults: number
}

export function ModernLokerList({ initialLoker, totalResults }: ModernLokerListProps) {
  const [lokerList, setLokerList] = useState<Loker[]>(initialLoker)
  const [filters, setFilters] = useState({ category: 'all', location: 'Semua Lokasi', search: '', timeFilter: 'all' })
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [mobileFilters, setMobileFilters] = useState<FilterState>({
    locations: [],
    categories: [],
    jobTypes: [],
    timeRange: 'all'
  })

  // Count new jobs posted today
  const getNewJobsCount = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return lokerList.filter((loker) => {
      if (!loker.published_at) return false
      const publishedDate = new Date(loker.published_at)
      publishedDate.setHours(0, 0, 0, 0)
      return publishedDate.getTime() === today.getTime()
    }).length
  }

  const newJobsCount = getNewJobsCount()

  // Helper function to check if date matches time filter
  const matchesTimeFilter = (publishedAt: string | null | undefined, timeFilter: string): boolean => {
    if (!publishedAt || timeFilter === 'all') return true

    const publishedDate = new Date(publishedAt)
    publishedDate.setHours(0, 0, 0, 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    const weekStart = new Date(today)
    weekStart.setDate(weekStart.getDate() - 7)
    
    const monthStart = new Date(today)
    monthStart.setMonth(monthStart.getMonth() - 1)

    switch (timeFilter) {
      case 'today':
        return publishedDate.getTime() === today.getTime()
      case 'yesterday':
        return publishedDate.getTime() === yesterday.getTime()
      case 'week':
        return publishedDate >= weekStart && publishedDate <= today
      case 'month':
        return publishedDate >= monthStart && publishedDate <= today
      default:
        return true
    }
  }

  // Handle share
  const handleShare = async (loker: Loker) => {
    const shareData = {
      title: loker.title,
      text: `${loker.title} - ${loker.perusahaan_name}`,
      url: `${window.location.origin}/vip/loker/${loker.id}`
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Berhasil membagikan lowongan!')
      } catch (err) {
        // User cancelled, don't show error
        if ((err as Error).name !== 'AbortError') {
          toast.error('Gagal membagikan lowongan')
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareData.url)
        toast.success('Link berhasil disalin ke clipboard!')
      } catch (err) {
        toast.error('Gagal menyalin link')
      }
    }
  }

  // Handle bookmark
  const handleBookmark = async (id: string) => {
    const loker = lokerList.find((l) => l.id === id)
    const wasBookmarked = loker?.is_bookmarked

    // Optimistic UI update
    setLokerList((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, is_bookmarked: !l.is_bookmarked } : l
      )
    )

    // Show toast feedback
    if (wasBookmarked) {
      toast.info('Dihapus dari tersimpan')
    } else {
      toast.success('Ditambahkan ke tersimpan!')
    }

    // TODO: Call API to persist bookmark
    try {
      // await fetch('/api/vip/bookmark', { method: 'POST', body: JSON.stringify({ loker_id: id }) })
    } catch (err) {
      // Revert on error
      setLokerList((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, is_bookmarked: wasBookmarked } : l
        )
      )
      toast.error('Gagal menyimpan perubahan')
    }
  }

  // Apply mobile filters
  const handleApplyMobileFilters = (newFilters: FilterState) => {
    setMobileFilters(newFilters)
  }

  // Client-side filtering (combine desktop & mobile filters)
  const filteredLoker = lokerList.filter((loker) => {
    let matches = true

    // Desktop search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      matches = matches && (
        loker.title.toLowerCase().includes(query) ||
        loker.perusahaan_name.toLowerCase().includes(query)
      )
    }

    // Desktop location filter
    if (filters.location && filters.location !== 'Semua Lokasi') {
      matches = matches && loker.lokasi === filters.location
    }

    // Mobile location filter
    if (mobileFilters.locations.length > 0) {
      matches = matches && mobileFilters.locations.includes(loker.lokasi)
    }

    // Desktop category filter
    if (filters.category && filters.category !== 'all') {
      const categoryMap: { [key: string]: string[] } = {
        it: ['IT', 'Web Development', 'Mobile Development', 'Technology'],
        marketing: ['Marketing', 'Content Creator', 'Design'],
        sales: ['Sales'],
        fnb: ['F&B'],
        retail: ['Retail'],
      }
      const categories = categoryMap[filters.category] || []
      matches = matches && loker.kategori?.some(k => categories.includes(k))
    }

    // Mobile category filter
    if (mobileFilters.categories.length > 0) {
      matches = matches && loker.kategori?.some(k => mobileFilters.categories.includes(k))
    }

    // Mobile job type filter
    if (mobileFilters.jobTypes.length > 0) {
      matches = matches && loker.tipe_pekerjaan && mobileFilters.jobTypes.includes(loker.tipe_pekerjaan)
    }

    // Time filter (both desktop & mobile)
    const timeFilter = filters.timeFilter !== 'all' ? filters.timeFilter : mobileFilters.timeRange
    if (timeFilter && timeFilter !== 'all') {
      matches = matches && matchesTimeFilter(loker.published_at, timeFilter)
    }

    return matches
  })

  const activeFilterCount = mobileFilters.locations.length + mobileFilters.categories.length + mobileFilters.jobTypes.length + (mobileFilters.timeRange !== 'all' ? 1 : 0)

  return (
    <div className="space-y-4 lg:space-y-8">
      {/* New Jobs Banner */}
      {newJobsCount > 0 && <NewJobsBanner count={newJobsCount} />}

      {/* Desktop Filter Navigation - Sticky */}
      <div className="hidden lg:block sticky top-20 z-40 bg-gray-50 dark:bg-gray-950 py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 shadow-sm">
        <TabFilterNavigation onFilterChange={setFilters} />
      </div>

      {/* Mobile: Quick Filter Chips + Filter Button */}
      <div className="lg:hidden sticky top-16 z-40 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent dark:from-gray-950 dark:via-gray-950 dark:to-transparent py-3 space-y-3">
        {/* Quick Filter Chips */}
        <QuickFilterChips onFilterChange={(filterId) => {
          // Handle quick filter change
          console.log('Quick filter:', filterId)
        }} />

        {/* Advanced Filter Button */}
        <div className="px-4">
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl h-11 font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
          >
            <SlidersHorizontal className="w-4.5 h-4.5 mr-2" />
            Advanced Filters
            {activeFilterCount > 0 && (
              <span className="ml-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <div>
          <p className="text-sm text-muted-foreground">
            Menampilkan{' '}
            <span className="font-bold text-foreground">{filteredLoker.length}</span>{' '}
            dari{' '}
            <span className="font-bold text-foreground">{totalResults}</span>{' '}
            lowongan
          </p>
        </div>
      </div>

      {/* Suggested Jobs Carousel - Mobile Only */}
      {!isLoading && filteredLoker.length > 5 && (
        <div className="lg:hidden">
          <SuggestedJobsCarousel 
            jobs={filteredLoker.slice(0, 10)} 
            title="🔥 Hot Jobs"
          />
        </div>
      )}

      {/* Loker Grid - Mobile: Stack, Desktop: Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LokerCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredLoker.length > 0 ? (
        <>
          {/* Mobile: Modern Stack Cards */}
          <div className="lg:hidden space-y-3">
            {filteredLoker.map((loker) => (
              <JobCardModern
                key={loker.id}
                loker={loker}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>

          {/* Desktop: Grid layout */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLoker.map((loker) => (
              <ModernLokerCard key={loker.id} loker={loker} />
            ))}
          </div>
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-950 dark:to-teal-950 flex items-center justify-center">
            <svg className="w-16 h-16 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">Tidak ada lowongan ditemukan</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Coba ubah filter atau kata kunci pencarian untuk hasil yang lebih baik
          </p>
        </div>
      )}

      {/* Floating Action Button - Desktop only */}
      <div className="hidden lg:block">
        <FloatingActionMenu />
      </div>

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Mobile Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyMobileFilters}
        initialFilters={mobileFilters}
      />
    </div>
  )
}
