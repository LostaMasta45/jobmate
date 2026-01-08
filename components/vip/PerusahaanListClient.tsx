'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Building2, MapPin, Briefcase, Command } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CompanyCardModern } from './CompanyCardModern'
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
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (value: string) => {
    setSearch(value)
    if (value) {
      router.push(`/vip/perusahaan?search=${encodeURIComponent(value)}`)
    } else {
      router.push('/vip/perusahaan')
    }
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      {/* Modern Floating Search Bar */}
      <div className="relative max-w-2xl mx-auto -mt-8 lg:-mt-12 z-30 px-4">
        <div className={`relative group transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          {/* Enhanced Glow Effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl blur-lg transition-all duration-500 ${isFocused ? 'opacity-40 group-hover:opacity-60' : 'opacity-20 group-hover:opacity-40'}`} />

          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center p-2 border border-white/20 dark:border-gray-700/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="pl-4 pr-3 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Cari perusahaan impianmu..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 text-sm sm:text-base h-11"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 transition-colors"
                aria-label="Hapus pencarian"
              >
                <span className="text-xs font-bold">✕</span>
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 px-3 border-l border-gray-100 dark:border-gray-700 ml-2">
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-gray-50 dark:bg-gray-900 px-2 font-mono text-[10px] font-medium text-gray-500 ring-1 ring-inset ring-gray-200 dark:ring-gray-700">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Perusahaan Terdaftar
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800">
            {totalResults}
          </span>
        </h2>
        {/* Simple Sort/Filter could go here */}
      </div>

      {/* Premium Company Grid */}
      {perusahaan.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {perusahaan.map((company) => (
            <CompanyCardModern key={company.id} company={company} />
          ))}
        </div>
      ) : (
        // Modern Empty State
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full animate-ping opacity-20" />
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-full flex items-center justify-center border border-dashed border-blue-200 dark:border-blue-800">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Tidak Ada Perusahaan Ditemukan
          </h3>
          <p className="text-gray-500 max-w-xs mx-auto mb-8">
            Kami tidak dapat menemukan perusahaan yang cocok dengan pencarian "{search}"
          </p>
          <Button
            variant="outline"
            onClick={() => handleSearch('')}
            className="rounded-full px-6"
          >
            Reset Pencarian
          </Button>
        </div>
      )}
    </div>
  )
}
