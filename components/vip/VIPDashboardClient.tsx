'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles,
  Eye,
  MapPin
} from 'lucide-react'
import { LokerCard } from './LokerCard'
import { LokerCardAIParsed } from './LokerCardAIParsed'
import type { Loker, Perusahaan } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { LOKASI_JOMBANG, KATEGORI_LOKER } from '@/types/vip'

interface VIPDashboardClientProps {
  user: {
    displayName: string
    isBasic: boolean
    membershipExpiresAt?: string
  }
  stats: {
    totalLoker: number
    totalPerusahaan: number
    savedCount: number
    recentViews: number
  }
  latestLoker: Loker[]
  recentViewed: Array<{ loker: Loker | null; viewed_at: string }>
  popularCompanies: (Perusahaan & { loker_count: number })[]
}

export function VIPDashboardClient({
  user,
  stats,
  latestLoker,
  recentViewed,
  popularCompanies,
}: VIPDashboardClientProps) {
  const [selectedTab, setSelectedTab] = useState<'rekomendasi' | 'terbaru'>('terbaru')
  const [selectedLokasi, setSelectedLokasi] = useState<string>('Semua')
  const [selectedKategori, setSelectedKategori] = useState<string>('Semua')

  // Filter loker berdasarkan tab, lokasi, dan kategori
  const filteredLoker = latestLoker.filter((loker) => {
    const lokasiMatch = selectedLokasi === 'Semua' || loker.lokasi.includes(selectedLokasi)
    const kategoriMatch = selectedKategori === 'Semua' || loker.kategori?.includes(selectedKategori)
    return lokasiMatch && kategoriMatch
  })

  // Format expiry date
  const getExpiryText = () => {
    if (!user.membershipExpiresAt) return ''
    try {
      return new Date(user.membershipExpiresAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold">
                  Hai, {user.displayName}! 👋
                </h1>
                <Badge className={`${user.isBasic ? 'bg-blue-500' : 'bg-gradient-to-r from-yellow-400 to-yellow-600'} text-white border-0 shadow-lg text-sm`}>
                  {user.isBasic ? '⭐ VIP Basic' : '👑 VIP Premium'}
                </Badge>
              </div>
              <p className="text-blue-100 text-lg mb-2">
                {user.isBasic 
                  ? 'Akses penuh ke loker eksklusif Jombang (Rp 10K/bulan)'
                  : 'Akses penuh loker + JobMate Tools - Lifetime Access!'
                }
              </p>
              {user.isBasic && getExpiryText() && (
                <p className="text-blue-200 text-sm">
                  Aktif sampai {getExpiryText()} (perpanjang otomatis)
                </p>
              )}
              {!user.isBasic && (
                <p className="text-blue-200 text-sm">
                  ✨ Akses selamanya - Tidak ada biaya berulang
                </p>
              )}
            </div>
            
            {user.isBasic && (
              <Button 
                asChild
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-lg hidden md:flex"
              >
                <Link href="/pricing?upgrade=true">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Upgrade Premium
                </Link>
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Link href="/vip/loker">
                <Briefcase className="w-4 h-4 mr-2" />
                Cari Loker
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Link href="/vip/saved">
                <span className="mr-2">🔖</span>
                Tersimpan
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
              <Link href="/vip/alerts">
                <span className="mr-2">🔔</span>
                Alerts
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-xs md:text-sm text-gray-600 mb-1">Loker Aktif</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalLoker}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-600 mb-1">Perusahaan</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.totalPerusahaan}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <span className="text-2xl">🔖</span>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-600 mb-1">Tersimpan</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.savedCount}</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-600 mb-1">Dilihat (7 Hari)</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900">{stats.recentViews}</div>
        </div>
      </div>

      {/* Section Tabs & Filters */}
      <div>
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Loker Untuk Anda</h2>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="rekomendasi">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Rekomendasi
                </TabsTrigger>
                <TabsTrigger value="terbaru">
                  <Clock className="w-4 h-4 mr-2" />
                  Terbaru
                </TabsTrigger>
              </TabsList>
            </div>
            <Button asChild variant="outline" className="hover:bg-blue-50 hover:text-blue-700 hidden md:flex">
              <Link href="/vip/loker">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Filter Chips */}
          <div className="mb-6 space-y-3">
            {/* Lokasi Filter */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Lokasi:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedLokasi('Semua')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLokasi === 'Semua'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                {['Jombang Kota', 'Sumobito', 'Diwek', 'Mojowarno', 'Ploso'].map((lokasi) => (
                  <button
                    key={lokasi}
                    onClick={() => setSelectedLokasi(lokasi)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLokasi === lokasi
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {lokasi}
                  </button>
                ))}
              </div>
            </div>

            {/* Kategori Filter */}
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-2">Kategori:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedKategori('Semua')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedKategori === 'Semua'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Semua
                </button>
                {['IT', 'Marketing', 'Sales', 'Administrasi', 'F&B', 'Retail'].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setSelectedKategori(kat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedKategori === kat
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {kat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loker Grid */}
          <TabsContent value="rekomendasi" className="mt-0">
            {filteredLoker.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoker.map((loker) => (
                  loker.sumber === 'Poster' && loker.poster_url ? (
                    <LokerCardAIParsed key={loker.id} loker={loker} />
                  ) : (
                    <LokerCard key={loker.id} loker={loker} />
                  )
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="terbaru" className="mt-0">
            {filteredLoker.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLoker.map((loker) => (
                  loker.sumber === 'Poster' && loker.poster_url ? (
                    <LokerCardAIParsed key={loker.id} loker={loker} />
                  ) : (
                    <LokerCard key={loker.id} loker={loker} />
                  )
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Aktivitas Terakhir */}
      {recentViewed && recentViewed.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-600" />
              Terakhir Kamu Lihat
            </h3>
          </div>
          <div className="space-y-3">
            {recentViewed.slice(0, 5).map((item, idx) => {
              if (!item.loker) return null
              return (
                <Link
                  key={idx}
                  href={`/vip/loker/${item.loker.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-1">
                      {item.loker.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {item.loker.perusahaan_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {item.loker.lokasi}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(item.viewed_at), { addSuffix: true, locale: idLocale })}
                  </div>
                  <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:text-blue-700">
                    Lihat
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Perusahaan Populer */}
      {popularCompanies && popularCompanies.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Perusahaan Populer</h2>
            <Button asChild variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
              <Link href="/vip/perusahaan">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCompanies.slice(0, 6).map((company) => (
              <Link
                key={company.id}
                href={`/vip/perusahaan/${company.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-1">
                  {company.name}
                </div>
                <div className="text-xs text-gray-600">
                  {company.loker_count || 0} lowongan
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upgrade Banner (for Basic users) */}
      {user.isBasic && (
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">👑</span>
              <h3 className="text-2xl font-bold">Upgrade ke VIP Premium</h3>
            </div>
            <p className="text-yellow-100 mb-2 text-lg">
              <span className="font-bold text-white">Rp 39.000 - Akses Selamanya!</span>
            </p>
            <p className="text-yellow-100 mb-4 text-sm">
              Bayar sekali, gunakan selamanya. Dapatkan akses penuh ke JobMate Tools!
            </p>
            <ul className="space-y-2 mb-6 text-yellow-50">
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>CV ATS Generator & Cover Letter Generator</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>WhatsApp & Email Generator</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>PDF Tools & Application Tracker</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span className="font-semibold">Lifetime Access - Tanpa Biaya Berulang!</span>
              </li>
            </ul>
            <Button
              asChild
              size="lg"
              className="bg-white text-yellow-700 hover:bg-yellow-50 font-bold shadow-lg"
            >
              <Link href="/pricing?upgrade=true">
                <Sparkles className="w-5 h-5 mr-2" />
                Upgrade Lifetime Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center col-span-full">
      <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Tidak Ada Loker
      </h3>
      <p className="text-gray-600 mb-4">
        Coba ubah filter atau kembali lagi nanti
      </p>
      <Button asChild variant="outline">
        <Link href="/vip/loker">
          Lihat Semua Loker
        </Link>
      </Button>
    </div>
  )
}
