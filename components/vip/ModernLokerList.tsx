'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ModernLokerCard } from './ModernLokerCard'
import { JobCardMobile } from '@/components/mobile/JobCardMobile'
import { JobCardModern } from '@/components/mobile/JobCardModern'
import { QuickFilterChips } from '@/components/mobile/QuickFilterChips'
import { QuickFilterChipsAdvanced } from '@/components/mobile/QuickFilterChipsAdvanced'
import { JobStatistics } from '@/components/mobile/JobStatistics'
import { KategoriPopuler } from '@/components/mobile/KategoriPopuler'
import { PerusahaanHiring } from '@/components/mobile/PerusahaanHiring'
import { SuggestedJobsCarousel } from '@/components/mobile/SuggestedJobsCarousel'
import { FilterBottomSheet, FilterState } from '@/components/mobile/FilterBottomSheet'
import { TabFilterNavigation } from './TabFilterNavigation'
import { FloatingActionMenu } from './FloatingActionMenu'
import { ScrollToTop } from './ScrollToTop'
import { NewJobsBanner } from './NewJobsBanner'
import { LokerCardSkeleton } from './LokerCardSkeleton'
import { toast } from '@/components/mobile/ToastNotification'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, Sparkles, MapPin, Search, Bell, ChevronDown } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface ModernLokerListProps {
  initialLoker: Loker[]
  totalResults: number
}

export function ModernLokerList({ initialLoker, totalResults }: ModernLokerListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [lokerList, setLokerList] = useState<Loker[]>(initialLoker)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [quickFilters, setQuickFilters] = useState<string[]>([])
  
  // Scroll state for dynamic header
  const [scrollY, setScrollY] = useState(0)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  
  // Initialize mobile filters from URL params
  const [mobileFilters, setMobileFilters] = useState<FilterState>({
    locations: searchParams.getAll('lokasi'),
    categories: searchParams.getAll('kategori'),
    jobTypes: searchParams.get('tipe_kerja') ? [searchParams.get('tipe_kerja')!] : [],
    timeRange: searchParams.get('timeFilter') || 'all'
  })

  // Update lokerList when initialLoker changes (server refetch)
  useEffect(() => {
    setLokerList(initialLoker)
  }, [initialLoker])

  // Handle scroll for dynamic header with RAF throttling - Improved for mobile app feel
  useEffect(() => {
    lastScrollY.current = window.scrollY
    
    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - lastScrollY.current
      
      // Always show header at the very top (within 50px)
      if (currentScrollY < 50) {
        setIsHeaderVisible(true)
      }
      // Show header when scrolling up (sensitive for mobile)
      else if (scrollDifference < -3) {
        setIsHeaderVisible(true)
      }
      // Hide header when scrolling down past threshold (more aggressive)
      else if (scrollDifference > 5 && currentScrollY > 80) {
        setIsHeaderVisible(false)
      }
      
      lastScrollY.current = currentScrollY
      setScrollY(currentScrollY)
      ticking.current = false
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateHeader)
        ticking.current = true
      }
    }

    // Initial check
    updateHeader()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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

  // Get today's jobs
  const getTodayJobs = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return lokerList.filter((loker) => {
      if (!loker.published_at) return false
      const publishedDate = new Date(loker.published_at)
      publishedDate.setHours(0, 0, 0, 0)
      return publishedDate.getTime() === today.getTime()
    })
  }

  // Get urgent jobs (deadline this week)
  const getUrgentJobs = () => {
    const today = new Date()
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    
    return lokerList.filter((loker) => {
      if (!loker.deadline) return false
      const deadline = new Date(loker.deadline)
      return deadline >= today && deadline <= weekFromNow
    }).length
  }

  // Get unique companies
  const getUniqueCompanies = () => {
    const uniqueCompanies = new Map()
    lokerList.forEach((loker) => {
      if (loker.perusahaan_id && !uniqueCompanies.has(loker.perusahaan_id)) {
        uniqueCompanies.set(loker.perusahaan_id, {
          id: loker.perusahaan_id,
          name: loker.perusahaan_name,
          logo_url: loker.perusahaan?.logo_url,
          job_count: 1
        })
      } else if (loker.perusahaan_id) {
        const company = uniqueCompanies.get(loker.perusahaan_id)
        company.job_count++
      }
    })
    return Array.from(uniqueCompanies.values()).sort((a, b) => b.job_count - a.job_count)
  }

  const todayJobs = getTodayJobs()
  const urgentJobsCount = getUrgentJobs()
  const companies = getUniqueCompanies()

  // Calculate real counts for filters
  const getFilterCounts = () => {
    return {
      remote: lokerList.filter(l => l.tipe_pekerjaan?.toLowerCase().includes('remote')).length,
      fulltime: lokerList.filter(l => l.tipe_pekerjaan?.toLowerCase().includes('full') || l.tipe_pekerjaan?.toLowerCase().includes('penuh')).length,
      freshgrad: lokerList.filter(l => 
        l.title?.toLowerCase().includes('fresh graduate') || 
        l.title?.toLowerCase().includes('freshgraduate')
      ).length,
      salaryHigh: lokerList.filter(l => l.gaji_min && l.gaji_min >= 5000000).length,
      today: todayJobs.length,
      urgent: urgentJobsCount,
      internship: lokerList.filter(l => 
        l.title?.toLowerCase().includes('magang') || 
        l.title?.toLowerCase().includes('intern') ||
        l.tipe_pekerjaan?.toLowerCase().includes('magang') ||
        l.tipe_pekerjaan?.toLowerCase().includes('intern')
      ).length,
    }
  }

  // Calculate real counts for categories
  const getCategoryCounts = () => {
    return {
      it: lokerList.filter(l => 
        l.kategori?.some(k => ['IT', 'Technology', 'Web Development', 'Mobile Development', 'Software', 'Developer'].some(tech => k.includes(tech)))
      ).length,
      marketing: lokerList.filter(l => 
        l.kategori?.some(k => ['Marketing', 'Content', 'Design', 'Creative'].some(mark => k.includes(mark)))
      ).length,
      sales: lokerList.filter(l => 
        l.kategori?.some(k => ['Sales', 'Penjualan'].some(s => k.includes(s)))
      ).length,
      fnb: lokerList.filter(l => 
        l.kategori?.some(k => ['F&B', 'Food', 'Beverage', 'Restaurant', 'Cafe'].some(f => k.includes(f)))
      ).length,
      retail: lokerList.filter(l => 
        l.kategori?.some(k => ['Retail', 'Store', 'Toko'].some(r => k.includes(r)))
      ).length,
      admin: lokerList.filter(l => 
        l.kategori?.some(k => ['Admin', 'Administration', 'Office'].some(a => k.includes(a)))
      ).length,
      engineer: lokerList.filter(l => 
        l.kategori?.some(k => ['Engineer', 'Engineering', 'Technical'].some(e => k.includes(e)))
      ).length,
      hrd: lokerList.filter(l => 
        l.kategori?.some(k => ['HRD', 'HR', 'Human Resource', 'Recruitment'].some(h => k.includes(h)))
      ).length,
    }
  }

  const filterCounts = getFilterCounts()
  const categoryCounts = getCategoryCounts()

  // Handle quick filter
  // Update URL params function
  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      // Remove existing params with this key
      params.delete(key)
      
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
        // Remove param if null/empty
        return
      }
      
      if (Array.isArray(value)) {
        // Add multiple values for array params
        value.forEach((v) => params.append(key, v))
      } else {
        // Add single value
        params.set(key, value)
      }
    })
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    startTransition(() => {
      router.push(`/vip/loker?${params.toString()}`, { scroll: false })
    })
  }

  const handleQuickFilter = (filterId: string) => {
    setQuickFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((id) => id !== filterId)
      }
      return [...prev, filterId]
    })
  }

  const handleClearQuickFilters = () => {
    setQuickFilters([])
  }

  const handleKategoriSelect = (kategoriId: string) => {
    if (kategoriId === 'all') {
      updateFilters({ kategori: null })
    } else {
      // Map kategori ID to actual category names
      const categoryMap: { [key: string]: string[] } = {
        it: ['IT', 'Technology', 'Web Development', 'Mobile Development', 'Software', 'Developer'],
        marketing: ['Marketing', 'Content', 'Design', 'Creative'],
        sales: ['Sales', 'Penjualan'],
        fnb: ['F&B', 'Food', 'Beverage', 'Restaurant', 'Cafe'],
        retail: ['Retail', 'Store', 'Toko'],
        admin: ['Admin', 'Administration', 'Office'],
        engineer: ['Engineer', 'Engineering', 'Technical'],
        hrd: ['HRD', 'HR', 'Human Resource', 'Recruitment'],
      }
      const categories = categoryMap[kategoriId] || [kategoriId]
      updateFilters({ kategori: categories })
    }
  }

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  // Debounce search
  useEffect(() => {
    // Skip if search query matches URL param (already set)
    if (searchQuery === (searchParams.get('search') || '')) {
      return
    }
    
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery || null })
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

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

  // Apply mobile filters - update URL params
  const handleApplyMobileFilters = (newFilters: FilterState) => {
    setMobileFilters(newFilters)
    
    // Convert job types array to single value for tipe_kerja param
    const tipeKerja = newFilters.jobTypes.length > 0 ? newFilters.jobTypes[0] : null
    
    updateFilters({
      lokasi: newFilters.locations.length > 0 ? newFilters.locations : null,
      kategori: newFilters.categories.length > 0 ? newFilters.categories : null,
      tipe_kerja: tipeKerja,
      timeFilter: newFilters.timeRange !== 'all' ? newFilters.timeRange : null,
    })
  }

  // No client-side filtering needed - server handles it
  // Just display the lokerList as-is from server
  const filteredLoker = lokerList

  const activeFilterCount = mobileFilters.locations.length + mobileFilters.categories.length + mobileFilters.jobTypes.length + (mobileFilters.timeRange !== 'all' ? 1 : 0)

  return (
    <div className="lg:space-y-8 pb-safe overflow-x-hidden -mt-20 sm:-mt-24">
      {/* Mobile: Dynamic Sticky Search Bar - Full to top when scrolled */}
      <div className={`lg:hidden fixed left-0 right-0 z-40 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] dark:from-[#5547d0] dark:to-[#6366F1] transition-all duration-300 ease-in-out ${
        scrollY > 50 
          ? 'top-0 shadow-[0_4px_20px_rgba(0,0,0,0.15)] backdrop-blur-xl' 
          : 'top-12 sm:top-14 shadow-lg'
      }`}>
        {/* Header Row - Slides up when scrolling */}
        <div className={`flex items-center justify-between px-3 transition-all duration-300 ease-in-out ${
          isHeaderVisible ? 'pt-1.5 pb-1.5 opacity-100 max-h-20' : 'pt-0 pb-0 opacity-0 max-h-0 overflow-hidden pointer-events-none'
        }`}>
          {/* Location Selector */}
          <button className="flex items-center gap-1 text-white hover:bg-white/10 active:bg-white/20 rounded-lg px-1.5 py-0.5 -ml-1.5 transition-all">
            <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-0.5 min-w-0">
              <span className="text-[11px] font-semibold truncate">
                {searchParams.get('lokasi') || 'Jombang, Indonesia'}
              </span>
              <ChevronDown className="w-2.5 h-2.5 flex-shrink-0" />
            </div>
          </button>

          {/* Notification Icon */}
          <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all flex-shrink-0 relative">
            <Bell className="w-3.5 h-3.5 text-white" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-indigo-600" />
          </button>
        </div>

        {/* Search Bar - Always visible, ultra compact when scrolled to top */}
        <div className={`px-3 transition-all duration-300 ease-in-out ${
          scrollY > 50 ? 'pt-safe py-2.5' : (isHeaderVisible ? 'pt-0 pb-2' : 'py-2')
        }`}>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 relative">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                <Search className={`transition-all duration-300 text-gray-400 ${
                  scrollY > 50 ? 'w-4 h-4' : 'w-3.5 h-3.5'
                }`} />
              </div>
              <input
                type="text"
                placeholder="Cari pekerjaan, perusahaan..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pr-3 rounded-lg bg-white dark:bg-gray-800 border-0 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 ${
                  scrollY > 50 
                    ? 'h-10 pl-10 shadow-md font-medium' 
                    : 'h-9 pl-9 shadow-sm'
                }`}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`relative rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all duration-300 flex-shrink-0 ${
                scrollY > 50 ? 'w-10 h-10' : 'w-9 h-9'
              }`}
            >
              <SlidersHorizontal className={`text-white transition-all duration-300 ${
                scrollY > 50 ? 'w-4 h-4' : 'w-3.5 h-3.5'
              }`} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold border border-white px-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Spacer - Adjusts based on scroll position */}
      <div className={`lg:hidden transition-all duration-300 ${
        scrollY > 50 ? 'h-[60px] sm:h-[60px]' : 'h-[130px] sm:h-[134px]'
      }`} />

      {/* New Jobs Banner */}
      {newJobsCount > 0 && <NewJobsBanner count={newJobsCount} />}

      {/* Desktop Filter Navigation - Sticky */}
      <div className="hidden lg:block sticky top-20 z-40 bg-gray-50 dark:bg-gray-950 py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 shadow-sm">
        <TabFilterNavigation onFilterChange={(desktopFilters) => {
          updateFilters({
            search: desktopFilters.search || null,
            kategori: desktopFilters.category !== 'all' ? [desktopFilters.category] : null,
            lokasi: desktopFilters.location ? [desktopFilters.location] : null,
            timeFilter: desktopFilters.timeFilter !== 'all' ? desktopFilters.timeFilter : null,
          })
        }} />
      </div>

      {/* 1. Quick Filter Chips - Mobile Only - REDUCED SPACING */}
      <div className="mt-2">
        <QuickFilterChipsAdvanced
          onFilterSelect={handleQuickFilter}
          activeFilters={quickFilters}
          onClearAll={handleClearQuickFilters}
          counts={filterCounts}
        />
      </div>

      {/* 2. Job Statistics - Mobile Only - REDUCED SPACING */}
      <div className="mt-3">
        <JobStatistics
          newJobsCount={newJobsCount}
          totalCompanies={companies.length}
          urgentJobsCount={urgentJobsCount}
        />
      </div>

      {/* 3. Kategori Populer - Mobile Only - REDUCED SPACING */}
      <div className="mt-3">
        <KategoriPopuler 
          onKategoriSelect={handleKategoriSelect}
          counts={categoryCounts}
        />
      </div>

      {/* 4. Perusahaan Sedang Hiring - Mobile Only - REDUCED SPACING */}
      {companies.length > 0 && (
        <div className="mt-3">
          <PerusahaanHiring companies={companies} />
        </div>
      )}

      {/* 5. Lowongan Terbaru Hari Ini - Mobile Only - REDUCED SPACING */}
      {todayJobs.length > 0 && (
        <div className="lg:hidden px-4 py-2 mt-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Lowongan Baru Hari Ini
            </h3>
            <span className="text-xs font-bold bg-gradient-to-r from-[#00d1dc] to-[#00acc7] text-white px-2.5 py-1 rounded-full">
              {todayJobs.length} loker
            </span>
          </div>
          <div className="space-y-2.5">
            {todayJobs.slice(0, 3).map((loker) => (
              <JobCardModern
                key={loker.id}
                loker={loker}
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* 6. Mobile: Suggested Jobs Section Header - REDUCED SPACING */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 mt-2 mb-1">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Lowongan Disarankan
        </h2>
        <button 
          onClick={() => {
            // Navigate to all loker with recommended sorting
            updateFilters({ sort: 'paling_dilihat', timeFilter: 'week' })
            // Then scroll to the section
            setTimeout(() => {
              const allJobsSection = document.getElementById('semua-lowongan')
              if (allJobsSection) {
                allJobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }, 100)
          }}
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors active:scale-95"
        >
          Lihat semua
        </button>
      </div>

      {/* Suggested Jobs Carousel - Mobile Only */}
      {!isPending && filteredLoker.length > 5 && (
        <div className="lg:hidden">
          <SuggestedJobsCarousel 
            jobs={filteredLoker.slice(0, 10)}
          />
        </div>
      )}

      {/* 7. Semua Lowongan Header - Mobile Only - REDUCED SPACING */}
      <div id="semua-lowongan" className="lg:hidden px-4 py-2 mt-2 scroll-mt-16">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Semua Lowongan
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {filteredLoker.length} lowongan
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {isPending && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">Memuat data...</p>
            </div>
          </div>
        </div>
      )}

      {/* Loker Grid - Mobile: Stack, Desktop: Grid - REDUCED SPACING */}
      {filteredLoker.length > 0 ? (
        <>
          {/* Mobile: Modern Stack Cards - TIGHTER SPACING */}
          <div className="lg:hidden space-y-2.5 px-4 pb-24">
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
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-[#8e68fd]/20 to-[#00d1dc]/20 dark:from-[#5547d0]/30 dark:to-[#00acc7]/30 flex items-center justify-center">
            <svg className="w-16 h-16 text-[#00d1dc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Tidak ada lowongan ditemukan</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
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
