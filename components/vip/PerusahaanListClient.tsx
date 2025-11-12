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
    <div className="space-y-4 lg:space-y-6">
      {/* Search - Mobile Optimized */}
      <div className="sticky top-16 lg:top-20 z-30 bg-gray-50 dark:bg-gray-950 py-3 -mx-4 px-4 lg:-mx-8 lg:px-8 shadow-sm border-b border-gray-200 dark:border-gray-800 lg:border-0">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan, lokasi, industri..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 lg:pl-11 h-10 lg:h-12 text-sm lg:text-base rounded-xl bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 px-1">
        Ditemukan <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> perusahaan
      </p>

      {/* Perusahaan Grid - Mobile: 2 cols, Desktop: 3 cols */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
          {perusahaan.map((company) => (
            <Card 
              key={company.id} 
              className="group hover:shadow-lg active:scale-95 transition-all hover:border-teal-300 dark:hover:border-teal-700 cursor-pointer"
            >
              <CardContent className="p-3 lg:p-6">
                <Link href={`/vip/perusahaan/${company.slug}`} className="block">
                  {/* Logo - Centered on Mobile */}
                  <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4 mb-3 lg:mb-4">
                    {company.logo_url ? (
                      <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex items-center justify-center border border-teal-200 dark:border-teal-800 overflow-hidden">
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-contain p-1.5 lg:p-2"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                        <Building2 className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 text-center lg:text-left">
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 mb-1.5 lg:mb-1">
                        {company.name}
                      </h3>
                      {company.industri && (
                        <Badge variant="outline" className="text-xs bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400">
                          {company.industri}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description - Hidden on Mobile */}
                  {company.deskripsi && (
                    <p className="hidden lg:block text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {company.deskripsi}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-1.5 lg:space-y-2">
                    {company.lokasi && (
                      <div className="flex items-center justify-center lg:justify-start gap-1.5 lg:gap-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                        <span className="truncate">{company.lokasi}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center lg:justify-start gap-1.5 lg:gap-2 text-xs lg:text-sm">
                      <Briefcase className="w-3 h-3 lg:w-4 lg:h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                      <span className="font-medium text-teal-600 dark:text-teal-400">
                        {company.loker_count} Loker
                      </span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Empty State
        <Card>
          <CardContent className="p-8 lg:p-12 text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak Ada Perusahaan Ditemukan
            </h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 lg:mb-6">Coba ubah kata kunci pencarian Anda</p>
            <Button variant="outline" onClick={() => handleSearch('')} className="h-9 lg:h-10 text-sm lg:text-base">
              Reset Pencarian
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
