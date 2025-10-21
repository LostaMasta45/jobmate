'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Eye,
  Share2,
  ArrowLeft,
  ExternalLink,
  Building2,
  Clock,
  CheckCircle2,
  Brain,
  FileImage,
  X,
  MessageCircle,
  Mail,
  Users,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModernLokerCard } from './ModernLokerCard'
import { BookmarkButton } from './BookmarkButton'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface LokerDetailRedesignedProps {
  loker: Loker
  similarLoker: Loker[]
  userId: string
}

export function LokerDetailRedesigned({
  loker,
  similarLoker,
  userId,
}: LokerDetailRedesignedProps) {
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)
  const [showPosterLightbox, setShowPosterLightbox] = useState(false)

  const isAIParsed = loker.sumber === 'Poster' && loker.poster_url

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${gaji_min.toLocaleString('id-ID')} - Rp ${gaji_max.toLocaleString('id-ID')}`
    }
    if (gaji_min) {
      return `Rp ${gaji_min.toLocaleString('id-ID')}`
    }
    return 'Gaji Negotiable'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: idLocale,
      })
    } catch {
      return ''
    }
  }

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return null
    try {
      const deadlineDate = new Date(deadline)
      const today = new Date()
      const diffDays = Math.ceil(
        (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffDays < 0) return 'Sudah Ditutup'
      if (diffDays === 0) return 'Hari Ini'
      if (diffDays === 1) return 'Besok'
      if (diffDays <= 7) return `${diffDays} hari lagi`

      return deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      return null
    }
  }

  // Calculate active time progress
  const getActiveProgress = () => {
    if (!loker.published_at || !loker.deadline) return null
    
    const publishedDate = new Date(loker.published_at).getTime()
    const deadlineDate = new Date(loker.deadline).getTime()
    const now = Date.now()
    
    const totalDuration = deadlineDate - publishedDate
    const elapsed = now - publishedDate
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
    
    return {
      progress,
      daysLeft: Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24)),
    }
  }

  const handleApply = async (method: 'whatsapp' | 'email') => {
    try {
      const response = await fetch('/api/vip/loker/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loker_id: loker.id,
          method,
        }),
      })

      if (!response.ok) {
        console.error('Failed to track application')
      }
    } catch (error) {
      console.error('Error tracking application:', error)
    }

    if (method === 'whatsapp' && loker.kontak_phone) {
      const message = `Halo, saya tertarik dengan lowongan ${loker.title} di ${loker.perusahaan_name}`
      const waNumber = loker.kontak_phone.replace(/[^0-9]/g, '')
      window.open(
        `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`,
        '_blank'
      )
    } else if (method === 'email' && loker.kontak_email) {
      const subject = `Lamaran: ${loker.title}`
      const body = `Kepada HRD ${loker.perusahaan_name},\n\nSaya tertarik untuk melamar posisi ${loker.title}.\n\nTerima kasih.`
      window.open(
        `mailto:${loker.kontak_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        '_blank'
      )
    }
  }

  const handleShare = async () => {
    setIsSharing(true)
    const shareData = {
      title: `${loker.title} - ${loker.perusahaan_name}`,
      text: `Lowongan kerja: ${loker.title} di ${loker.perusahaan_name}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link berhasil disalin!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    } finally {
      setIsSharing(false)
    }
  }

  const deadlineText = getDeadlineText(loker.deadline)
  const isUrgent =
    deadlineText &&
    (deadlineText.includes('hari') ||
      deadlineText === 'Besok' ||
      deadlineText === 'Hari Ini')
  const activeProgress = getActiveProgress()

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Kembali ke Daftar Loker</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pb-24 lg:pb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* Hero Header Card - Modern & Clean */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-lg">
              {/* Company Logo & Title Section */}
              <div className="flex items-start gap-6 mb-6">
                {loker.perusahaan?.logo_url && (
                  <div className="flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 p-3 shadow-md">
                    <img
                      src={loker.perusahaan.logo_url}
                      alt={loker.perusahaan_name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {loker.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {isAIParsed && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-md">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Parsed
                      </Badge>
                    )}
                    {loker.sumber && (
                      <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50">
                        {loker.sumber}
                      </Badge>
                    )}
                    {isUrgent && (
                      <Badge className="bg-red-500 text-white border-0 shadow-md animate-pulse">
                        🔥 Segera Ditutup
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl lg:text-4xl font-poppins font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {loker.title}
                  </h1>

                  {/* Company */}
                  <Link
                    href={`/vip/perusahaan/${loker.perusahaan?.slug || loker.perusahaan_id}`}
                    className="inline-flex items-center gap-2 text-base lg:text-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
                  >
                    <Building2 className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    <span className="font-semibold">{loker.perusahaan_name}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>

              {/* Meta Info Row */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                {loker.published_at && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Diposting {getTimeAgo(loker.published_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{loker.view_count || 0} views</span>
                </div>
                {(loker.apply_count || 0) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{loker.apply_count} applicants</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mb-6">
                <BookmarkButton
                  lokerId={loker.id}
                  initialBookmarked={loker.is_bookmarked || false}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  disabled={isSharing}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Active Time Progress Bar */}
              {activeProgress && activeProgress.daysLeft > 0 && (
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      ⏱️ Waktu Aktif Lowongan
                    </span>
                    <span className={`text-sm font-bold ${
                      activeProgress.daysLeft <= 3 
                        ? 'text-red-600 dark:text-red-400' 
                        : activeProgress.daysLeft <= 7 
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {activeProgress.daysLeft} hari tersisa
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        activeProgress.daysLeft <= 3
                          ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-500'
                          : activeProgress.daysLeft <= 7
                          ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500'
                          : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500'
                      } animate-pulse`}
                      style={{ width: `${activeProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags & Categories */}
            <div className="flex flex-wrap gap-2">
              {loker.kategori?.map((kat) => (
                <Badge
                  key={kat}
                  variant="outline"
                  className="border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
                >
                  {kat}
                </Badge>
              ))}
              {loker.tipe_pekerjaan && (
                <Badge variant="outline" className="border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 px-3 py-1.5 text-sm font-medium">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {loker.tipe_pekerjaan}
                </Badge>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Lokasi
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white truncate">
                    {loker.lokasi}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Gaji
                  </div>
                  <div className="font-semibold text-green-600 dark:text-green-400 truncate">
                    {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                  </div>
                </div>
              </div>

              {deadlineText && (
                <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isUrgent 
                        ? 'bg-red-100 dark:bg-red-950' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <Calendar className={`w-6 h-6 ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Deadline
                    </div>
                    <div className={`font-semibold truncate ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {deadlineText}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Dilihat
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {loker.view_count || 0} kali
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary Section (if AI parsed) */}
            {isAIParsed && (
              <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-poppins font-bold text-gray-900 dark:text-white">
                      AI Summary
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Informasi diekstrak dari poster menggunakan AI
                    </p>
                  </div>
                </div>

                {loker.poster_url && (
                  <button
                    onClick={() => setShowPosterLightbox(true)}
                    className="relative w-full max-w-sm mx-auto block rounded-xl overflow-hidden border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group mb-6 shadow-lg hover:shadow-2xl"
                  >
                    <Image
                      src={loker.poster_url}
                      alt={`Poster ${loker.title}`}
                      width={400}
                      height={600}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <FileImage className="w-5 h-5" />
                        <span>Lihat Poster Lengkap</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Description & Requirements */}
            {loker.deskripsi && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
                <h2 className="text-xl font-poppins font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                  Deskripsi Pekerjaan
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {loker.deskripsi}
                </div>
              </div>
            )}

            {loker.kualifikasi && loker.kualifikasi.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 lg:p-8 shadow-sm">
                <h2 className="text-xl font-poppins font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full" />
                  Kualifikasi & Persyaratan
                </h2>
                <ul className="space-y-3">
                  {loker.kualifikasi.map((kual, index) => (
                    <li key={index} className="flex items-start gap-3 group">
                      <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{kual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Similar Jobs */}
            {similarLoker.length > 0 && (
              <div className="pt-6">
                <h2 className="text-2xl font-poppins font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Loker Serupa
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {similarLoker.map((similar) => (
                    <ModernLokerCard key={similar.id} loker={similar} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Apply Card - Sticky */}
            <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-poppins font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full" />
                Lamar Sekarang
              </h3>

              <div className="space-y-3">
                {isAIParsed && loker.poster_url && (
                  <Button
                    onClick={() => setShowPosterLightbox(true)}
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 border-2 border-purple-500 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:border-purple-600 dark:hover:border-purple-500 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <FileImage className="w-4 h-4" />
                    Lihat Poster Lengkap
                  </Button>
                )}
                
                {loker.kontak_phone && (
                  <Button
                    onClick={() => handleApply('whatsapp')}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 gap-2 shadow-md hover:shadow-xl transition-all text-white font-semibold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Lamar via WhatsApp
                  </Button>
                )}

                {loker.kontak_email && (
                  <Button
                    onClick={() => handleApply('email')}
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 border-2 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-600 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <Mail className="w-5 h-5" />
                    Lamar via Email
                  </Button>
                )}

                {!loker.kontak_phone && !loker.kontak_email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                    Informasi kontak belum tersedia
                  </p>
                )}
              </div>

              {(loker.apply_count || 0) > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-md"
                        >
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{loker.apply_count}</span>{' '}
                      orang sudah melamar
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Company Info Card */}
            {loker.perusahaan && (
              <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg p-6">
                <h3 className="text-lg font-poppins font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gray-500" />
                  Tentang Perusahaan
                </h3>

                {loker.perusahaan.logo_url && (
                  <div className="w-20 h-20 mx-auto mb-5 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 shadow-sm">
                    <img
                      src={loker.perusahaan.logo_url}
                      alt={loker.perusahaan.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <h4 className="font-poppins font-semibold text-gray-900 dark:text-white text-center mb-3">
                  {loker.perusahaan.name}
                </h4>

                {loker.perusahaan.deskripsi && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-4 leading-relaxed text-center">
                    {loker.perusahaan.deskripsi}
                  </p>
                )}

                {loker.perusahaan_id && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md font-semibold"
                  >
                    <Link href={`/vip/perusahaan/${loker.perusahaan.slug}`} className="flex items-center justify-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Lihat Semua Loker
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/98 dark:bg-gray-900/98 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 p-4 shadow-2xl lg:hidden z-50">
        <div className="flex items-center gap-2 max-w-screen-sm mx-auto">
          <BookmarkButton
            lokerId={loker.id}
            initialBookmarked={loker.is_bookmarked || false}
          />
          {loker.kontak_phone && (
            <Button
              onClick={() => handleApply('whatsapp')}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95 text-white gap-2 shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden xs:inline">WhatsApp</span>
              <span className="xs:hidden">WA</span>
            </Button>
          )}
          {loker.kontak_email && (
            <Button
              onClick={() => handleApply('email')}
              variant="outline"
              className="flex-1 border-2 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 active:scale-95 gap-2 shadow-md hover:shadow-lg transition-all font-semibold"
            >
              <Mail className="w-5 h-5" />
              <span className="hidden xs:inline">Email</span>
            </Button>
          )}
        </div>
      </div>

      {/* Poster Lightbox */}
      {showPosterLightbox && loker.poster_url && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowPosterLightbox(false)}
        >
          <button
            onClick={() => setShowPosterLightbox(false)}
            className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-xl z-10"
          >
            <X className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <Image
              src={loker.poster_url}
              alt={`Poster ${loker.title}`}
              width={800}
              height={1200}
              className="w-full h-auto rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}
