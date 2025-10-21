'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { LokerFilters } from './LokerFilters'
import { LokerCard } from './LokerCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Briefcase } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface LokerListClientProps {
  initialLoker: Loker[]
  totalResults: number
  currentPage: number
  totalPages: number
  initialFilters: {
    search: string
    kategori: string[]
    lokasi: string[]
    tipe_pekerjaan: string
    sort: string
  }
}

export function LokerListClient({
  initialLoker,
  totalResults,
  currentPage,
  totalPages,
  initialFilters,
}: LokerListClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (filters: any) => {
    const params = new URLSearchParams()

    if (filters.search) params.set('search', filters.search)
    if (filters.kategori && filters.kategori.length > 0) {
      filters.kategori.forEach((k: string) => params.append('kategori', k))
    }
    if (filters.lokasi && filters.lokasi.length > 0) {
      filters.lokasi.forEach((l: string) => params.append('lokasi', l))
    }
    if (filters.tipe_pekerjaan) params.set('tipe_pekerjaan', filters.tipe_pekerjaan)
    if (filters.sort) params.set('sort', filters.sort)

    // Reset to page 1 when filters change
    params.set('page', '1')

    router.push(`/vip/loker?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.push(`/vip/loker?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <LokerFilters onFilterChange={handleFilterChange} totalResults={totalResults} />

      {/* Loker Grid */}
      {initialLoker.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialLoker.map((loker) => (
              <LokerCard key={loker.id} loker={loker} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak Ada Loker Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">
            Coba ubah filter atau kata kunci pencarian Anda
          </p>
          <Button
            variant="outline"
            onClick={() => {
              router.push('/vip/loker')
            }}
          >
            Reset Filter
          </Button>
        </div>
      )}
    </div>
  )
}

