'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Building2, MapPin, Briefcase, Command, Bell, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CompanyCardModern } from './CompanyCardModern'
import type { Perusahaan } from '@/types/vip'
import { User } from '@supabase/supabase-js'

interface PerusahaanWithCount extends Perusahaan {
  loker_count: number
}

interface PerusahaanListClientProps {
  perusahaan: PerusahaanWithCount[]
  totalResults: number
  initialSearch: string
  user: User
}

export function PerusahaanListClient({
  perusahaan,
  totalResults,
  initialSearch,
  user,
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

  // Get user initials or name
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userAvatar = user.user_metadata?.avatar_url

  return (
    <div className="space-y-6">
      {/* Native Blue Header Container */}
      <div className="bg-gradient-to-br from-[#5547d0] to-[#8e68fd] dark:from-[#1e1b4b] dark:to-[#4c1d95] rounded-b-[2.5rem] pt-6 pb-12 px-6 shadow-xl -mx-4 -mt-12 sm:-mx-6 sm:-mt-16 lg:-mx-8 lg:-mt-14">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Top Row: User & Notifications */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                {userAvatar ? (
                  <Image src={userAvatar} alt={userName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-[#5547d0] rounded-full"></span>
              </div>
              <div>
                <p className="text-xs text-purple-100 font-medium opacity-90">Selamat Datang,</p>
                <h2 className="text-lg font-bold leading-tight">{userName}</h2>
              </div>
            </div>

            <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10">
              <Bell className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Row */}
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Cari perusahaan..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-gray-900 border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 shadow-lg ring-2 ring-transparent focus:ring-purple-300/50 transition-all font-medium"
              />
            </div>

            <Button size="icon" className="w-12 h-12 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 shadow-lg border-2 border-yellow-300">
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Optional: Location / Badge Row (like reference image) */}
          <div className="flex items-center gap-2 text-blue-100 text-sm opacity-80 pl-1">
            <MapPin className="w-4 h-4" />
            <span>Jombang, Jawa Timur</span>
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
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
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
