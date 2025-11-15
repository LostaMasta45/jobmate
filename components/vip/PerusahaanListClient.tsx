'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Building2, MapPin, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Perusahaan } from '@/types/vip'

interface PerusahaanWithCount extends Perusahaan {
  loker_count: number
}

interface PerusahaanListClientProps {
  perusahaan: PerusahaanWithCount[]
  totalResults: number
  initialSearch: string
}

export function PerusahaanListClient({
  perusahaan,
  totalResults,
  initialSearch,
}: PerusahaanListClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState(initialSearch)

  const handleSearch = (value: string) => {
    setSearch(value)
    if (value) {
      router.push(`/vip/perusahaan?search=${encodeURIComponent(value)}`)
    } else {
      router.push('/vip/perusahaan')
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-5 overflow-x-hidden">
      {/* Clean Search Section - Minimalist Design */}
      <div className="relative">
        <div className="relative group">
          <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400 group-focus-within:text-[#00acc7] transition-colors z-10" />
          <Input
            type="text"
            placeholder="Cari perusahaan, lokasi, industri..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 sm:pl-10 pr-10 h-10 sm:h-11 text-sm sm:text-base rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#00acc7] dark:hover:border-[#00d1dc] focus:border-[#00acc7] dark:focus:border-[#00d1dc] focus:ring-2 focus:ring-[#00acc7]/20 dark:focus:ring-[#00d1dc]/20 transition-all placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg w-full"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors group"
              aria-label="Clear search"
            >
              <span className="text-gray-500 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-gray-200">✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count - Clean & Simple */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          Menampilkan <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> perusahaan
          {search && <span className="text-[#00acc7] dark:text-[#00d1dc] ml-1">untuk "{search}"</span>}
        </p>
      </div>

      {/* Clean Company Grid - Mobile: 2 cols, Desktop: 3 cols */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
          {perusahaan.map((company) => (
            <Link 
              key={company.id}
              href={`/vip/perusahaan/${company.slug}`}
            >
              <Card 
                className="group h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#00acc7] dark:hover:border-[#00d1dc] hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <CardContent className="p-3 sm:p-4 flex flex-col h-full">
                  {/* Logo Section */}
                  <div className="flex flex-col items-center mb-2.5 sm:mb-3">
                    {company.logo_url ? (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-contain p-1.5 sm:p-2"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#00acc7] to-[#00d1dc] flex items-center justify-center">
                        <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center line-clamp-2 mb-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-[#00acc7] dark:group-hover:text-[#00d1dc] transition-colors">
                    {company.name}
                  </h3>

                  {/* Industry Badge */}
                  {company.industri && (
                    <div className="flex justify-center mb-2">
                      <Badge 
                        variant="outline" 
                        className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-[#00acc7]/5 border-[#00acc7]/20 text-[#00acc7] dark:text-[#00d1dc]"
                      >
                        {company.industri}
                      </Badge>
                    </div>
                  )}

                  {/* Info Section */}
                  <div className="mt-auto space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {/* Location */}
                    {company.lokasi && (
                      <div className="flex items-center justify-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{company.lokasi}</span>
                      </div>
                    )}
                    {/* Job Count */}
                    <div className="flex items-center justify-center gap-1">
                      <Briefcase className="w-3 h-3 text-[#00acc7] flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-semibold text-[#00acc7] dark:text-[#00d1dc]">
                        {company.loker_count} Loker
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        // Clean Empty State
        <Card className="border-dashed border-2">
          <CardContent className="p-8 sm:p-10 lg:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak Ada Perusahaan Ditemukan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Coba ubah kata kunci pencarian Anda
            </p>
            <Button 
              variant="outline"
              onClick={() => handleSearch('')}
              className="h-9 sm:h-10"
            >
              Reset Pencarian
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
