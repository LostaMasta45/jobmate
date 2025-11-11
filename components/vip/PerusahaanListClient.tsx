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
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari nama perusahaan, lokasi, atau industri..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Ditemukan <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> perusahaan
      </p>

      {/* Perusahaan Grid */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {perusahaan.map((company) => (
            <Card 
              key={company.id} 
              className="group hover:shadow-lg transition-all hover:border-teal-300 dark:hover:border-teal-700"
            >
              <CardContent className="p-4 sm:p-6">
                <Link href={`/vip/perusahaan/${company.slug}`}>
                  {/* Logo */}
                  <div className="flex items-start gap-4 mb-4">
                    {company.logo_url ? (
                      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 flex items-center justify-center border border-teal-200 dark:border-teal-800 overflow-hidden">
                        <img
                          src={company.logo_url}
                          alt={company.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md">
                        <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2 mb-1">
                        {company.name}
                      </h3>
                      {company.industri && (
                        <Badge variant="outline" className="text-xs bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400">
                          {company.industri}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {company.deskripsi && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                      {company.deskripsi}
                    </p>
                  )}

                  {/* Info */}
                  <div className="space-y-2">
                    {company.lokasi && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span>{company.lokasi}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      <span className="font-medium text-teal-600 dark:text-teal-400">
                        {company.loker_count} Loker Aktif
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
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tidak Ada Perusahaan Ditemukan
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Coba ubah kata kunci pencarian Anda</p>
            <Button variant="outline" onClick={() => handleSearch('')}>
              Reset Pencarian
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
