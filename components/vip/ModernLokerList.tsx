'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'
import { ModernLokerCard } from './ModernLokerCard'
import { DesktopCard2Overlay } from '@/components/vip/designs/desktop-variants/DesktopCard2Overlay'
import { JobCardMobile } from '@/components/mobile/JobCardMobile'
import { JobCardModern } from '@/components/mobile/JobCardModern'
import { JobCardGlass } from '@/components/mobile/JobCardGlass'
import { MatchRecommendations } from '@/components/mobile/MatchRecommendations'
import { JobsTodayHorizontal } from '@/components/mobile/JobsTodayHorizontal'
// New Card Components
import { JobCardTicket } from '@/components/mobile/cards/JobCardTicket'
import { JobCardStacked } from '@/components/mobile/cards/JobCardStacked'
import { JobCardBubble } from '@/components/mobile/cards/JobCardBubble'
import { JobCardBanner } from '@/components/mobile/cards/JobCardBanner'
import { JobCardCompact } from '@/components/mobile/cards/JobCardCompact'

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
import { SlidersHorizontal, Sparkles, MapPin, Search, Bell, ChevronDown, ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface ModernLokerListProps {
  initialLoker: Loker[]
  totalResults: number
  user?: User | null
}

export function ModernLokerList({ initialLoker, totalResults, user }: ModernLokerListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [lokerList, setLokerList] = useState<Loker[]>(initialLoker)
  const [mounted, setMounted] = useState(false)

  // Initialize mounted state for portals
  useEffect(() => {
    setMounted(true)
  }, [])

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

  // New Logic for Categories - WITH FALLBACKS to ensure UI visibility
  let trendingJobs = [...lokerList].sort((a, b) => b.view_count - a.view_count).slice(0, 6)
  if (trendingJobs.length === 0) trendingJobs = lokerList.slice(0, 6)

  let topCompanyJobs = lokerList.filter(l =>
    l.is_featured || (l.gaji_min && l.gaji_min >= 5000000)
  ).slice(0, 6)
  if (topCompanyJobs.length === 0) topCompanyJobs = lokerList.slice(0, 6) // Fallback

  let freshGradJobs = lokerList.filter(l =>
    (l.tipe_pekerjaan as string) === 'Internship' ||
    (l.tipe_pekerjaan as string) === 'Magang' ||
    l.title?.toLowerCase().includes('magang') ||
    l.title?.toLowerCase().includes('intern') ||
    l.title?.toLowerCase().includes('fresh')
  ).slice(0, 6)
  if (freshGradJobs.length === 0) freshGradJobs = [...lokerList].reverse().slice(0, 6) // Fallback

  let featuredJobs = lokerList.filter(l => l.is_featured).slice(0, 3)
  if (featuredJobs.length === 0) featuredJobs = lokerList.slice(0, 2) // Fallback

  // Mock History (Last Viewed) - using random subset for now as requested
  const historyJobs = lokerList.slice(4, 7)

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
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userAvatar = user?.user_metadata?.avatar_url

  return (
    <div className="space-y-6 pb-safe overflow-x-hidden">

      {/* 2. STATIC HERO Header - Perusahaan Style */}
      {/* Placed FIRST to avoid space-y margin gap */}
      <div className="lg:hidden bg-gradient-to-br from-[#00acc7] to-[#00d1dc] dark:from-[#155e75] dark:to-[#0e7490] rounded-b-[2.5rem] pt-32 pb-12 px-6 shadow-xl -mt-20 relative z-10">
        <div className="space-y-6">

          {/* Top Row: Brand/Headline & User */}
          <div className="flex justify-between items-start text-white">
            <div>
              <div className="flex items-center gap-1.5 opacity-90 mb-1">
                <span className="bg-white/20 p-1 rounded-md backdrop-blur-sm">
                  <Sparkles className="w-3 h-3 text-yellow-300" />
                </span>
                <p className="text-xs font-medium text-blue-50 tracking-wide uppercase">Bursa Kerja Jombang</p>
              </div>
              <h2 className="text-2xl font-bold leading-tight tracking-tight">Temukan<br />Karir Impian</h2>
              <p className="text-xs text-blue-100 mt-1.5 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                {totalResults} Lowongan Aktif
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-blue-600 rounded-full"></span>
              </button>
              <div className="relative w-10 h-10 rounded-full bg-white/20 border border-white/30 overflow-hidden shadow-sm">
                {userAvatar ? (
                  <Image src={userAvatar} alt={userName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar - Integrated in Blue Card */}
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
              <input
                type="text"
                placeholder="Cari pekerjaan, perusahaan..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-black/20 hover:bg-black/25 focus:bg-black/30 border-none text-white placeholder:text-blue-200/70 focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
              />
            </div>

            <Button
              size="icon"
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 shadow-lg border-2 border-yellow-300 relative"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-yellow-300 shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>

          {/* Location Badge */}
          <div className="flex items-center gap-1.5 px-1">
            <MapPin className="w-3.5 h-3.5 text-blue-200" />
            <span className="text-xs font-medium text-blue-100/90 truncate max-w-[200px]">
              {searchParams.get('lokasi') || 'Lokasi: Seluruh Jombang'}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-200" />
          </div>

        </div>
      </div>

      {/* 1. FIXED Header (Portal to Body for Perfect Positioning) */}
      {mounted && createPortal(
        <div className={`lg:hidden fixed top-0 left-0 right-0 z-[9999] !bg-gradient-to-r !from-[#00acc7] !to-[#00d1dc] dark:!from-[#155e75] dark:!to-[#0e7490] shadow-xl transition-all duration-300 ease-in-out ${scrollY > 80
          ? 'translate-y-0 !opacity-100'
          : '-translate-y-full opacity-0 pointer-events-none'
          }`}>
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-black/20 border-none text-sm text-white placeholder:text-blue-300 focus:ring-2 focus:ring-white/20"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 text-white relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-blue-600">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* New Jobs Banner */}
      {newJobsCount > 0 && <NewJobsBanner count={newJobsCount} />}

      {/* Desktop Filter Navigation - Sticky */}
      <div className="hidden lg:block sticky top-16 z-40 bg-gray-50 dark:bg-slate-950 pt-2 pb-4 -mx-4 px-4 lg:-mx-8 lg:px-8 border-b border-gray-200 dark:border-slate-800">
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
      <div className="mt-2 lg:hidden">
        <QuickFilterChipsAdvanced
          onFilterSelect={handleQuickFilter}
          activeFilters={quickFilters}
          onClearAll={handleClearQuickFilters}
          counts={filterCounts}
        />
      </div>

      {/* 2. Job Statistics - Mobile Only - REDUCED SPACING */}
      <div className="mt-3 lg:hidden">
        <JobStatistics
          newJobsCount={newJobsCount}
          totalCompanies={companies.length}
          totalJobsCount={totalResults}
        />
      </div>

      {/* PROPOSAL ORDER:
          1. Header & Search (Sticky) - ALREADY AT TOP
          2. Stories Perusahaan (Top Companies)
          3. Hero/Welcome Message - ALREADY AT TOP
          4. Rekomendasi Match
          5. Sedang Tren
          6. Lanjutkan Melihat (History)
          7. Highlight
          8. Perusahaan Top
          9. Fresh Graduate
          10. Lowongan Terbaru
      */}

      {/* 2. STORIES PERUSAHAAN (Moved Up) */}
      {
        companies.length > 0 && (
          <div className="mt-3 lg:hidden">
            <PerusahaanHiring companies={companies} />
          </div>
        )
      }

      {/* 3. HERO/WELCOME is at the top (lines 440-513) */}

      {/* 4. MATCH RECOMMENDATIONS (AI Picks) */}
      {
        !isPending && filteredLoker.length > 5 && (
          <div className="lg:hidden mt-0">
            <MatchRecommendations jobs={filteredLoker} />
          </div>
        )
      }

      {/* 5. SEDANG TREN (Ticket Style) */}
      {
        trendingJobs.length > 0 && (
          <div className="lg:hidden px-4 mt-6">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🔥 Sedang Tren
              </h3>
              <span className="text-xs text-gray-400">Paling Dilihat</span>
            </div>
            <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide -mx-4 px-6 snap-x snap-mandatory">
              {trendingJobs.map(job => (
                <div key={job.id} className="snap-center">
                  <JobCardTicket loker={job} />
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* 6. LANJUTKAN MELIHAT (History - Compact Style) */}
      {
        historyJobs.length > 0 && (
          <div className="lg:hidden px-6 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                ↺ Lanjutkan
              </h3>
              <span className="text-xs text-gray-400">Terakhir Dilihat</span>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
              {historyJobs.map(job => (
                <JobCardCompact key={job.id} loker={job} />
              ))}
            </div>
          </div>
        )
      }

      {/* 7. HIGHLIGHT (Banner Style) */}
      {
        featuredJobs.length > 0 && (
          <div className="lg:hidden px-4 mt-8">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                ⭐ Highlight
              </h3>
            </div>
            <div className="space-y-4">
              {featuredJobs.slice(0, 2).map(job => (
                <JobCardBanner key={job.id} loker={job} />
              ))}
            </div>
          </div>
        )
      }

      {/* 8. PERUSAHAAN TOP (Stacked Style) */}
      {
        topCompanyJobs.length > 0 && (
          <div className="lg:hidden px-4 mt-8">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🏢 Perusahaan Top
              </h3>
              <span className="text-xs text-gray-400">Verified</span>
            </div>
            <div className="flex overflow-x-auto gap-4 py-2 pb-4 scrollbar-hide -mx-4 px-6 snap-x snap-mandatory">
              {topCompanyJobs.map(job => (
                <div key={job.id} className="snap-center">
                  <JobCardStacked loker={job} />
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* 9. FRESH GRADUATE (Bubble Style) */}
      {
        freshGradJobs.length > 0 && (
          <div className="lg:hidden px-4 mt-6 mb-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🎓 Fresh Graduate
              </h3>
              <span className="text-xs text-gray-400">Start Here</span>
            </div>
            <div className="flex overflow-x-auto gap-4 py-2 scrollbar-hide -mx-4 px-6 snap-x snap-mandatory">
              {freshGradJobs.map(job => (
                <div key={job.id} className="snap-center">
                  <JobCardBubble loker={job} />
                </div>
              ))}
            </div>
          </div>
        )
      }

      {/* 10. Lowongan Terbaru Hari Ini - Mobile Only - REDUCED SPACING */}
      {
        todayJobs.length > 0 && (
          <div className="lg:hidden px-4 py-2 mt-3">
            {/* Header Removed - Included in Component */}
            <div className="lg:-mx-4">
              <JobsTodayHorizontal jobs={todayJobs} />
            </div>
          </div>
        )
      }

      {/* 6. Mobile: Suggested Jobs Section Header - REDUCED SPACING */}
      <div className="hidden"></div>

      {/* Suggested Jobs Carousel - MOVED UP - REPLACED BY NEW SECTIONS */}

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
      {
        isPending && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-900 dark:text-white">Memuat data...</p>
              </div>
            </div>
          </div>
        )
      }

      {/* Loker Grid - Mobile: Stack, Desktop: Grid - REDUCED SPACING */}
      {
        filteredLoker.length > 0 ? (
          <>
            <div className="lg:hidden space-y-4 px-4 pb-24 mt-6">
              {filteredLoker.map((loker) => (
                <JobCardStacked
                  key={loker.id}
                  loker={loker}
                  className="w-full"
                />
              ))}

              {/* Load More / See All Button */}
              {filteredLoker.length < totalResults && (
                <div className="pt-4 pb-8 flex justify-center">
                  <Button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('limit', totalResults.toString())
                      router.push(`/vip/loker?${params.toString()}`, { scroll: false })
                    }}
                    variant="outline"
                    className="rounded-full px-8 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30"
                  >
                    Lihat Semuanya ({totalResults - filteredLoker.length} lagi)
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>


            {/* Desktop: Grid layout */}
            {/* Desktop: Grid layout */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-12 mt-32">
              {filteredLoker.map((loker) => (
                <DesktopCard2Overlay key={loker.id} loker={loker} />
              ))}
            </div>

            {/* Desktop Load More / See All Button */}
            {filteredLoker.length < totalResults && (
              <div className="hidden lg:flex justify-center pt-2 pb-12">
                <Button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    params.set('limit', totalResults.toString())
                    router.push(`/vip/loker?${params.toString()}`, { scroll: false })
                  }}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-10 h-12 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 font-semibold"
                >
                  Lihat Semuanya ({totalResults - filteredLoker.length} lagi)
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
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
        )
      }

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
    </div >
  )
}
