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
    <div className="space-y-4 lg:space-y-6 overflow-x-hidden">
      {/* Modern Search Section - Mobile Optimized with Gradient */}
      <div className="sticky top-16 lg:top-20 z-30 bg-gradient-to-br from-[#00acc7] via-[#00bed1] to-[#00d1dc] dark:from-[#00acc7] dark:to-[#00d1dc] -mx-4 px-4 lg:-mx-8 lg:px-8 py-4 lg:py-5 shadow-xl max-w-full">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-3.5 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-focus-within:text-[#00acc7] transition-colors z-10" />
            <Input
              type="text"
              placeholder="Cari perusahaan, lokasi, industri..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 lg:pl-12 pr-4 h-11 lg:h-13 text-sm lg:text-base rounded-2xl bg-white dark:bg-gray-900 border-0 shadow-lg focus:shadow-xl focus:ring-2 focus:ring-white/50 dark:focus:ring-white/20 transition-all placeholder:text-gray-400 font-medium"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-300 text-xs">✕</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count - Modern Badge Style */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00acc7] to-[#00d1dc]"></span>
            Ditemukan <span className="font-bold text-gray-900 dark:text-white">{totalResults}</span> perusahaan
          </span>
        </p>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearch('')}
            className="h-7 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Reset Filter
          </Button>
        )}
      </div>

      {/* Modern Perusahaan Grid - Mobile: 2 cols, Desktop: 3 cols */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
          {perusahaan.map((company) => (
            <Link 
              key={company.id}
              href={`/vip/perusahaan/${company.slug}`}
            >
              <Card 
                className="group h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#00acc7] dark:hover:border-[#00d1dc] hover:shadow-2xl hover:shadow-[#00acc7]/20 dark:hover:shadow-[#00d1dc]/10 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4 lg:p-5 flex flex-col h-full">
                  {/* Logo Section */}
                  <div className="flex flex-col items-center mb-3 lg:mb-4">
                    {company.logo_url ? (
                      <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-2 border-gray-100 dark:border-gray-700 overflow-hidden group-hover:border-[#00acc7]/30 dark:group-hover:border-[#00d1dc]/30 transition-all shadow-sm group-hover:shadow-md">
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-[#00acc7] via-[#00bed1] to-[#00d1dc] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#00acc7]/50 transition-all">
                        <Building2 className="w-7 h-7 lg:w-8 lg:h-8 text-white group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                  </div>

                  {/* Company Name */}
                  <h3 className="text-sm lg:text-base font-bold text-gray-900 dark:text-white text-center line-clamp-2 mb-2 lg:mb-2.5 min-h-[2.5rem] lg:min-h-[3rem] group-hover:text-[#00acc7] dark:group-hover:text-[#00d1dc] transition-colors">
                    {company.name}
                  </h3>

                  {/* Industry Badge */}
                  {company.industri && (
                    <div className="flex justify-center mb-3">
                      <Badge 
                        variant="outline" 
                        className="text-[10px] lg:text-xs px-2 py-0.5 bg-gradient-to-r from-[#00acc7]/10 to-[#00d1dc]/10 border-[#00acc7]/30 dark:border-[#00d1dc]/30 text-[#00acc7] dark:text-[#00d1dc] font-medium"
                      >
                        {company.industri}
                      </Badge>
                    </div>
                  )}

                  {/* Description - Hidden on Mobile, visible on desktop */}
                  {company.deskripsi && (
                    <p className="hidden lg:block text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 text-center">
                      {company.deskripsi}
                    </p>
                  )}

                  {/* Info Section */}
                  <div className="mt-auto space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    {/* Location */}
                    {company.lokasi && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                        </div>
                        <span className="truncate font-medium">{company.lokasi}</span>
                      </div>
                    )}
                    {/* Job Count */}
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#00acc7] to-[#00d1dc] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Briefcase className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                      </div>
                      <span className="text-xs lg:text-sm font-bold bg-gradient-to-r from-[#00acc7] to-[#00d1dc] bg-clip-text text-transparent">
                        {company.loker_count} Loker Aktif
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        // Modern Empty State
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="relative w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00acc7] to-[#00d1dc] rounded-3xl opacity-10 blur-xl"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-[#00acc7] to-[#00d1dc] rounded-3xl flex items-center justify-center shadow-lg">
                <Building2 className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2">
              Tidak Ada Perusahaan Ditemukan
            </h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Coba ubah kata kunci pencarian atau hapus filter untuk melihat semua perusahaan
            </p>
            <Button 
              onClick={() => handleSearch('')} 
              className="h-10 lg:h-11 px-6 bg-gradient-to-r from-[#00acc7] to-[#00d1dc] hover:from-[#00bed1] hover:to-[#00acc7] text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Search className="w-4 h-4 mr-2" />
              Reset Pencarian
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
