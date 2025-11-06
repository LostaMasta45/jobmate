'use client'

import { useState, useEffect } from 'react'
import { ModernLokerCard } from './ModernLokerCard'
import { TabFilterNavigation } from './TabFilterNavigation'
import { FloatingActionMenu } from './FloatingActionMenu'
import { ScrollToTop } from './ScrollToTop'
import { NewJobsBanner } from './NewJobsBanner'
import { LokerCardSkeleton } from './LokerCardSkeleton'
import type { Loker } from '@/types/vip'

interface ModernLokerListProps {
  initialLoker: Loker[]
  totalResults: number
}

export function ModernLokerList({ initialLoker, totalResults }: ModernLokerListProps) {
  const [lokerList, setLokerList] = useState<Loker[]>(initialLoker)
  const [filters, setFilters] = useState({ category: 'all', location: 'Semua Lokasi', search: '', timeFilter: 'all' })
  const [isLoading, setIsLoading] = useState(false)

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

  // Client-side filtering
  const filteredLoker = lokerList.filter((loker) => {
    let matches = true

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase()
      matches = matches && (
        loker.title.toLowerCase().includes(query) ||
        loker.perusahaan_name.toLowerCase().includes(query)
      )
    }

    // Location filter
    if (filters.location && filters.location !== 'Semua Lokasi') {
      matches = matches && loker.lokasi === filters.location
    }

    // Category filter
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

    // Time filter
    if (filters.timeFilter && filters.timeFilter !== 'all') {
      matches = matches && matchesTimeFilter(loker.published_at, filters.timeFilter)
    }

    return matches
  })

  return (
    <div className="space-y-8">
      {/* New Jobs Banner */}
      {newJobsCount > 0 && <NewJobsBanner count={newJobsCount} />}

      {/* Filter Navigation - Sticky */}
      <div className="sticky top-20 z-40 bg-gray-50 dark:bg-gray-950 py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 shadow-sm">
        <TabFilterNavigation onFilterChange={setFilters} />
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
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

      {/* Loker Grid dengan Bento Layout */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LokerCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredLoker.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoker.map((loker) => (
            <ModernLokerCard key={loker.id} loker={loker} />
          ))}
        </div>
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

      {/* Floating Action Button */}
      <FloatingActionMenu />

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}
