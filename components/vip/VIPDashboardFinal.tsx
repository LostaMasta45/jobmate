'use client'

import Link from 'next/link'
import Image from 'next/image'
import { 
  Briefcase, 
  TrendingUp, 
  BookmarkCheck, 
  Clock,
  Crown,
  Sparkles,
  MapPin,
  DollarSign,
  Eye,
  Calendar,
  Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface VIPDashboardFinalProps {
  memberName: string
  memberTier: 'basic' | 'premium'
  membershipExpiry: string | null
  stats: {
    totalLoker: number
    totalPerusahaan: number
    saved: number
    viewedLast7Days: number
  }
  lokerList: Loker[]
}

const LOCATIONS = ['Semua', 'Jombang Kota', 'Sumobito', 'Diwek', 'Mojowarno', 'Ploso']
const CATEGORIES = ['Semua', 'IT', 'Marketing', 'Sales', 'Administrasi', 'F&B', 'Retail']

export function VIPDashboardFinal({
  memberName,
  memberTier,
  membershipExpiry,
  stats,
  lokerList,
}: VIPDashboardFinalProps) {
  const [activeTab, setActiveTab] = useState<'rekomendasi' | 'terbaru'>('rekomendasi')
  const [selectedLocation, setSelectedLocation] = useState('Semua')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const isPremium = memberTier === 'premium'

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)} jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} jt+`
    }
    return 'Nego'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: idLocale 
      })
    } catch {
      return ''
    }
  }

  // Filter loker
  const filteredLoker = lokerList.filter((loker) => {
    let matches = true
    
    if (selectedLocation !== 'Semua') {
      matches = matches && loker.lokasi === selectedLocation
    }
    
    if (selectedCategory !== 'Semua') {
      matches = matches && loker.kategori?.includes(selectedCategory)
    }
    
    return matches
  })

  return (
    <div className="space-y-6">
      {/* Hero Section - Gradient Blue to Purple */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold">
                  Hai, {memberName}! 👋
                </h1>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1">
                  {isPremium ? (
                    <>
                      <Crown className="w-3.5 h-3.5 mr-1" />
                      VIP Premium
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      VIP Basic
                    </>
                  )}
                </Badge>
              </div>
              <p className="text-white/90 text-lg mb-2">
                Akses penuh ke loker eksklusif Jombang (Rp 10K/bulan)
              </p>
              {membershipExpiry && (
                <p className="text-white/70 text-sm">
                  Aktif sampai {new Date(membershipExpiry).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} (perpanjang otomatis)
                </p>
              )}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-white/90 hover:scale-105 transition-all shadow-xl rounded-2xl px-8 font-semibold"
            >
              <Link href="/vip/upgrade" className="gap-2">
                <Crown className="w-5 h-5" />
                Upgrade Premium
              </Link>
            </Button>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white rounded-2xl justify-start px-6 h-14"
              variant="outline"
            >
              <Link href="/vip/loker" className="gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                Cari Loker
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white rounded-2xl justify-start px-6 h-14"
              variant="outline"
            >
              <Link href="/vip/saved" className="gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <BookmarkCheck className="w-4 h-4" />
                </div>
                Tersimpan
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white rounded-2xl justify-start px-6 h-14"
              variant="outline"
            >
              <Link href="/vip/alerts" className="gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                Alerts
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center mb-3">
            <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loker Aktif</div>
          <div className="text-3xl font-bold">{stats.totalLoker}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Perusahaan</div>
          <div className="text-3xl font-bold">{stats.totalPerusahaan}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-950 flex items-center justify-center mb-3">
            <BookmarkCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tersimpan</div>
          <div className="text-3xl font-bold">{stats.saved}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dilihat (7 Hari)</div>
          <div className="text-3xl font-bold">{stats.viewedLast7Days}</div>
        </div>
      </div>

      {/* Loker Section */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Loker Untuk Anda</h2>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'rekomendasi' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('rekomendasi')}
              className={activeTab === 'rekomendasi' ? 'bg-blue-600 text-white rounded-xl' : 'rounded-xl'}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Rekomendasi
            </Button>
            <Button
              variant={activeTab === 'terbaru' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('terbaru')}
              className={activeTab === 'terbaru' ? 'bg-gray-900 text-white rounded-xl' : 'rounded-xl'}
            >
              Terbaru
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="rounded-xl"
            >
              <Link href="/vip/loker">
                Lihat Semua →
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="space-y-3 mb-6">
          {/* Lokasi */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Lokasi:</div>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedLocation === loc
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori */}
          <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategori:</div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoker.slice(0, 9).map((loker) => (
            <LokerCardCompact key={loker.id} loker={loker} />
          ))}
        </div>

        {filteredLoker.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Tidak ada loker dengan filter tersebut
          </div>
        )}
      </div>

      {/* Perusahaan Populer */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Perusahaan Populer</h2>
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/vip/perusahaan">
              Lihat Semua →
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-center hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-sm font-medium mb-1">Perusahaan {i}</div>
              <div className="text-xs text-gray-500">{i} lowongan</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Compact Loker Card Component
function LokerCardCompact({ loker }: { loker: Loker }) {
  const isAIParsed = loker.sumber === 'Poster' && loker.poster_url
  
  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)} jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} jt+`
    }
    return 'Negotiable'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: idLocale 
      })
    } catch {
      return ''
    }
  }

  return (
    <Link 
      href={`/vip/loker/${loker.id}`}
      className="group block bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Poster Preview or Color Header */}
      {isAIParsed && loker.poster_url ? (
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
          <Image
            src={loker.poster_url}
            alt={loker.title}
            fill
            className="object-cover"
          />
          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Parsed
          </Badge>
          {loker.is_featured && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              ⭐ Featured
            </Badge>
          )}
        </div>
      ) : (
        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {loker.title}
        </h3>

        {/* Company */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Building2 className="w-4 h-4" />
          <span className="truncate">{loker.perusahaan_name}</span>
        </div>

        {/* Kualifikasi Preview */}
        {loker.kualifikasi && loker.kualifikasi.length > 0 && (
          <ul className="space-y-1">
            {loker.kualifikasi.slice(0, 3).map((kual, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span className="line-clamp-1">{kual}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Category Tags */}
        {loker.kategori && loker.kategori.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {loker.kategori.slice(0, 3).map((kat) => (
              <Badge 
                key={kat} 
                variant="outline" 
                className="text-xs rounded-lg border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400"
              >
                {kat}
              </Badge>
            ))}
          </div>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {loker.lokasi}
          </div>
          <div className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {loker.view_count || 0} views
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {getTimeAgo(loker.published_at)}
          </div>
        </div>

        {/* Deadline */}
        {loker.deadline && (
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Deadline: {new Date(loker.deadline).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </div>
        )}

        {/* CTA Button */}
        <Button
          asChild
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          <div className="flex items-center justify-center gap-2">
            Lihat Detail
          </div>
        </Button>
      </div>
    </Link>
  )
}
