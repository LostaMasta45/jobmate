'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ModernLokerCardV2 } from './ModernLokerCardV2'
import { JobCardModernV2 } from './JobCardModernV2'
import { QuickFilterChipsAdvancedV2 } from './QuickFilterChipsAdvancedV2'
import { FilterBottomSheet, FilterState } from '@/components/mobile/FilterBottomSheet'
import { FloatingActionMenu } from '@/components/vip/FloatingActionMenu'
import { ScrollToTop } from '@/components/vip/ScrollToTop'
import { toast } from '@/components/mobile/ToastNotification'
import { SlidersHorizontal, MapPin, Search, Bell, ChevronDown, Briefcase, Grid } from 'lucide-react'
import type { Loker } from '@/types/vip'

// New imports for matching /vip/loker exact layout
import { NewJobsBanner } from '@/components/vip/NewJobsBanner'
import { JobStatistics } from '@/components/mobile/JobStatistics'
import { KategoriPopulerV2 } from '@/components/mobile/KategoriPopulerV2'
import { PerusahaanHiring } from '@/components/mobile/PerusahaanHiring'
import { SuggestedJobsCarouselV2 } from './SuggestedJobsCarouselV2'

interface ModernLokerListV2Props {
  initialLoker: Loker[]
  totalResults: number
}

export function ModernLokerListV2({ initialLoker, totalResults }: ModernLokerListV2Props) {
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

  // Handle scroll for dynamic header with RAF throttling
  useEffect(() => {
    lastScrollY.current = window.scrollY

    const updateHeader = () => {
      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - lastScrollY.current

      // Always show header at the very top
      if (currentScrollY < 50) {
        setIsHeaderVisible(true)
      }
      // Show header when scrolling up
      else if (scrollDifference < -3) {
        setIsHeaderVisible(true)
      }
      // Hide header when scrolling down
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

  // --- Stats Calculation Logic from ModernLokerList.tsx ---

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

  const newJobsCount = getNewJobsCount()
  const todayJobs = getTodayJobs()
  const urgentJobsCount = getUrgentJobs()
  const companies = getUniqueCompanies()

  // Calculate counts for filters
  const getFilterCounts = () => {
    return {
      remote: lokerList.filter(l => l.tipe_pekerjaan?.toLowerCase().includes('remote')).length,
      fulltime: lokerList.filter(l => l.tipe_pekerjaan?.toLowerCase().includes('full')).length,
      freshgrad: lokerList.filter(l => l.title?.toLowerCase().includes('fresh')).length,
      salaryHigh: lokerList.filter(l => l.gaji_min && l.gaji_min >= 5000000).length,
      today: todayJobs.length,
      urgent: urgentJobsCount,
      internship: lokerList.filter(l => l.tipe_pekerjaan?.toLowerCase().includes('magang')).length,
    }
  }

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

  // Update URL params function
  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      params.delete(key)
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) return
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value)
      }
    })

    params.delete('page')
    startTransition(() => {
      router.push(`/vip/loker?${params.toString()}`, { scroll: false })
    })
  }

  const handleKategoriSelect = (kategoriId: string) => {
    if (kategoriId === 'all') {
      updateFilters({ kategori: null })
    } else {
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

  // Handle search debounce
  useEffect(() => {
    if (searchQuery === (searchParams.get('search') || '')) return
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery || null })
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleBookmark = async (id: string) => {
    toast.success('Disimpan ke favorit')
  }

  const handleShare = async (loker: Loker) => {
    toast.success('Link disalin')
  }

  const activeFilterCount = mobileFilters.locations.length + mobileFilters.categories.length + mobileFilters.jobTypes.length + (mobileFilters.timeRange !== 'all' ? 1 : 0)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24 -mt-20 sm:-mt-24">

      {/* Mobile: Fixed Search Bar - Minimalist White Design */}
      <div className={`lg:hidden fixed left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-all duration-300 ease-in-out ${scrollY > 50
          ? 'top-0 pt-safe border-b border-gray-50 dark:border-slate-800'
          : 'top-12 sm:top-14 pt-2'
        }`}>
        <div className="px-5 pb-3 space-y-4">

          {/* Top Row: Location (Visible when not scrolled or when scrolled up) */}
          <div className={`flex items-center justify-between transition-all duration-300 overflow-hidden ${scrollY > 50 && !isHeaderVisible ? 'h-0 opacity-0' : 'h-auto opacity-100'
            }`}>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Lokasi</span>
              <button className="flex items-center gap-1.5 text-gray-900 dark:text-white font-bold text-sm group">
                <MapPin className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                <span className="truncate max-w-[200px] tracking-tight">{searchParams.get('lokasi') || 'Jombang, Jawa Timur'}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>
            <button className="relative p-2 bg-gray-50 dark:bg-slate-800 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-900 dark:text-white stroke-[1.5]" />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
            </button>
          </div>

          {/* Search & Filter Row - Pill Shaped */}
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform">
                <Search className="w-4 h-4 text-gray-400 stroke-[2]" />
              </div>
              <input
                type="text"
                placeholder="Cari pekerjaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-100 dark:bg-slate-800 border-transparent focus:border-[#8e68fd] text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-1 focus:ring-[#8e68fd] focus:bg-white dark:focus:bg-slate-800 transition-all shadow-none"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 rounded-full bg-[#8e68fd] dark:bg-[#8e68fd] hover:bg-[#5547d0] dark:hover:bg-[#5547d0] flex items-center justify-center text-white dark:text-white shadow-none transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
              {activeFilterCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#00d1dc] rounded-full text-[10px] font-bold border-2 border-white flex items-center justify-center text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header (Sticky) - Minimalist */}
      <div className="hidden lg:block sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 px-8 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Desktop Search UI */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2]" />
              <input
                type="text"
                placeholder="Cari lowongan pekerjaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-full bg-gray-50 dark:bg-slate-800 border-0 focus:ring-1 focus:ring-gray-200 dark:focus:ring-slate-700 text-sm font-medium shadow-sm hover:bg-gray-100 transition-colors"
              />
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-slate-800 mx-2"></div>
            <QuickFilterChipsAdvancedV2
              onFilterSelect={(id) => setQuickFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
              activeFilters={quickFilters}
              onClearAll={() => setQuickFilters([])}
              counts={filterCounts}
            />
          </div>
        </div>
      </div>

      {/* Spacer for Fixed Mobile Header */}
      <div className={`lg:hidden transition-all duration-300 ${scrollY > 50 ? 'h-[100px]' : 'h-[150px]'
        }`} />

      {/* New Jobs Banner (Original Feature) */}
      {newJobsCount > 0 && <div className="lg:hidden"><NewJobsBanner count={newJobsCount} /></div>}

      {/* Main Content */}
      <div className="px-5 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto">

        {/* 1. Quick Filters - Mobile Horizontal Scroll - Cleaner Chips */}
        <div className="lg:hidden -mx-5 px-5 overflow-x-auto scrollbar-hide pb-2">
          <QuickFilterChipsAdvancedV2
            onFilterSelect={(id) => setQuickFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])}
            activeFilters={quickFilters}
            onClearAll={() => setQuickFilters([])}
            counts={filterCounts}
          />
        </div>

        {/* 2. Job Statistics - Mobile Only - Minimalist Cards */}
        <div className="lg:hidden">
          <JobStatistics
            newJobsCount={newJobsCount}
            totalCompanies={companies.length}
            totalJobsCount={totalResults}
          />
        </div>

        {/* 3. Kategori Populer - Mobile Only - Minimalist Icons */}
        <div className="lg:hidden">
          <KategoriPopulerV2
            onKategoriSelect={handleKategoriSelect}
            counts={categoryCounts}
          />
        </div>

        {/* 4. Perusahaan Sedang Hiring - Mobile Only - Clean Logos */}
        {companies.length > 0 && (
          <div className="lg:hidden">
            <PerusahaanHiring companies={companies} />
          </div>
        )}

        {/* 5. Lowongan Terbaru Hari Ini - Mobile Only - Stacked Clean Cards */}
        {todayJobs.length > 0 && (
          <div className="lg:hidden mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
                Baru Tayang
                <span className="w-1.5 h-1.5 rounded-full bg-[#00d1dc] animate-pulse"></span>
              </h3>
              <span className="text-xs font-bold bg-[#8e68fd] text-white dark:bg-[#8e68fd] dark:text-white px-3 py-1 rounded-full">
                {todayJobs.length}
              </span>
            </div>
            <div className="space-y-4">
              {todayJobs.slice(0, 3).map((loker) => (
                <JobCardModernV2
                  key={loker.id}
                  loker={loker}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              ))}
            </div>
          </div>
        )}

        {/* 6. Mobile: Suggested Jobs Section Header */}
        <div className="lg:hidden flex items-center justify-between mt-4 mb-2">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Rekomendasi
          </h2>
          <button
            onClick={() => {
              updateFilters({ sort: 'paling_dilihat', timeFilter: 'week' })
              setTimeout(() => {
                const allJobsSection = document.getElementById('semua-lowongan')
                if (allJobsSection) {
                  allJobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }, 100)
            }}
            className="text-sm font-semibold text-[#8e68fd] hover:text-[#5547d0] dark:text-[#8e68fd] dark:hover:text-[#00d1dc] transition-colors"
          >
            Lihat semua
          </button>
        </div>

        {/* Suggested Jobs Carousel - Mobile Only - Clean Cards */}
        {!isPending && lokerList.length > 5 && (
          <div className="lg:hidden -mx-5">
            <SuggestedJobsCarouselV2
              jobs={lokerList.slice(0, 10)}
            />
          </div>
        )}

        {/* 7. Semua Lowongan Header - Mobile Only */}
        <div id="semua-lowongan" className="lg:hidden mt-4 scroll-mt-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              Semua Lowongan
            </h3>
            <p className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
              {totalResults} total
            </p>
          </div>
        </div>

        {/* Desktop Only: Job List Header - Clean Typography */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
            Lowongan Terbaru
            <span className="text-xs font-bold text-[#8e68fd] bg-[#8e68fd]/10 px-3 py-1 rounded-full">
              {totalResults}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Urutkan</span>
            <select
              className="bg-transparent text-sm font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer p-0 pr-6"
              value={searchParams.get('sort') || 'terbaru'}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              <option value="terbaru">Terbaru</option>
              <option value="gaji_tertinggi">Gaji Tertinggi</option>
              <option value="paling_dilihat">Populer</option>
            </select>
          </div>
        </div>

        {newJobsCount > 0 && <div className="hidden lg:block mb-6"><NewJobsBanner count={newJobsCount} /></div>}

        {/* Loker Grid - Mobile: Stack, Desktop: Grid - REDUCED SPACING */}
        {lokerList.length > 0 ? (
          <>
            {/* Mobile: Modern Stack Cards - TIGHTER SPACING */}
            <div className="lg:hidden space-y-2.5 px-4 pb-24">
              {lokerList.map((loker) => (
                <JobCardModernV2
                  key={loker.id}
                  loker={loker}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              ))}
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-5 pb-24">
              {lokerList.map((loker) => (
                <ModernLokerCardV2
                  key={loker.id}
                  loker={loker}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Search className="w-8 h-8 text-[#00d1dc] dark:text-[#00d1dc]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Tidak ada lowongan</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              Coba ubah kata kunci atau filter pencarian Anda untuk menemukan hasil yang sesuai.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                updateFilters({ search: null, lokasi: null, kategori: null, tipe_kerja: null })
              }}
              className="mt-6 px-6 py-2.5 bg-[#8e68fd] dark:bg-[#8e68fd] text-white dark:text-white rounded-full text-sm font-bold hover:shadow-lg transition-all active:scale-95 hover:bg-[#5547d0]"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Floating Menu & Scroll Top */}
      <div className="hidden lg:block">
        <FloatingActionMenu />
      </div>
      <ScrollToTop />

      {/* Mobile Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          setMobileFilters(filters)
          // Apply logic here
        }}
        initialFilters={mobileFilters}
      />
    </div>
  )
}
