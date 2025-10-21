'use client'

import { useState, useEffect } from 'react'
import { LokerCardRedesigned } from './LokerCardRedesigned'
import { LokerCardSkeleton } from './LokerCardSkeleton'
import { FilterBarRedesigned } from './FilterBarRedesigned'
import { NewJobsBanner } from './NewJobsBanner'
import { ScrollToTop } from './ScrollToTop'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface LokerListRedesignedProps {
  initialLoker: Loker[]
  totalResults: number
  currentPage: number
  totalPages: number
}

export function LokerListRedesigned({
  initialLoker,
  totalResults,
  currentPage,
  totalPages,
}: LokerListRedesignedProps) {
  const [lokerList, setLokerList] = useState<Loker[]>(initialLoker)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Count new jobs (posted today)
  const newJobsCount = lokerList.filter((loker) => {
    if (!loker.published_at) return false
    const publishedDate = new Date(loker.published_at)
    const today = new Date()
    return (
      publishedDate.getDate() === today.getDate() &&
      publishedDate.getMonth() === today.getMonth() &&
      publishedDate.getFullYear() === today.getFullYear()
    )
  }).length

  // Client-side filtering (basic implementation)
  const filteredLoker = lokerList.filter((loker) => {
    let matches = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matches = matches && (
        loker.title.toLowerCase().includes(query) ||
        loker.perusahaan_name.toLowerCase().includes(query)
      )
    }

    if (selectedLocation && selectedLocation !== 'Semua Lokasi') {
      matches = matches && loker.lokasi === selectedLocation
    }

    if (selectedCategory) {
      matches = matches && loker.kategori?.includes(selectedCategory)
    }

    return matches
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleLocationChange = (location: string | null) => {
    setSelectedLocation(location)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  return (
    <div className="space-y-6">
      {/* New Jobs Banner */}
      {newJobsCount > 0 && <NewJobsBanner count={newJobsCount} />}

      {/* Filter Bar */}
      <FilterBarRedesigned
        onSearch={handleSearch}
        onLocationChange={handleLocationChange}
        onCategoryChange={handleCategoryChange}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Menampilkan{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {filteredLoker.length}
          </span>{' '}
          dari{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            {totalResults}
          </span>{' '}
          lowongan
        </p>
      </div>

      {/* Loker Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LokerCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredLoker.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLoker.map((loker) => (
            <LokerCardRedesigned key={loker.id} loker={loker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tidak ada lowongan ditemukan
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            className="h-10 w-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNum = i + 1
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="icon"
                  className={`h-10 w-10 ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : ''
                  }`}
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            className="h-10 w-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Scroll to Top */}
      <ScrollToTop />
    </div>
  )
}
