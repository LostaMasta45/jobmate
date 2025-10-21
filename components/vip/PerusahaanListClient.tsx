'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Building2, MapPin, Briefcase } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
      <p className="text-sm text-gray-600">
        Ditemukan <span className="font-semibold text-gray-900">{totalResults}</span> perusahaan
      </p>

      {/* Perusahaan Grid */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perusahaan.map((company) => (
            <Link
              key={company.id}
              href={`/vip/perusahaan/${company.slug}`}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              {/* Logo */}
              <div className="flex items-start gap-4 mb-4">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {company.name}
                  </h3>
                  {company.industri && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {company.industri}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {company.deskripsi && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {company.deskripsi}
                </p>
              )}

              {/* Info */}
              <div className="space-y-2">
                {company.lokasi && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{company.lokasi}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">
                    {company.loker_count} Loker Aktif
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tidak Ada Perusahaan Ditemukan
          </h3>
          <p className="text-gray-600 mb-6">Coba ubah kata kunci pencarian Anda</p>
          <Button variant="outline" onClick={() => handleSearch('')}>
            Reset Pencarian
          </Button>
        </div>
      )}
    </div>
  )
}
