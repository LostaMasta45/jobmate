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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LokerCard } from './LokerCard'
import { LokerCardAIParsed } from './LokerCardAIParsed'
import { BookmarkButton } from './BookmarkButton'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface LokerDetailClientProps {
  loker: Loker
  similarLoker: Loker[]
  userId: string
}

export function LokerDetailClient({
  loker,
  similarLoker,
  userId,
}: LokerDetailClientProps) {
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

  const handleApply = async (method: 'whatsapp' | 'email') => {
    // Track application
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

    // Open apply link
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
        // Fallback: copy to clipboard
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

  return (
    <>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 lg:pb-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {loker.is_featured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                        ⭐ Featured
                      </Badge>
                    )}
                    {isAIParsed && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Parsed
                      </Badge>
                    )}
                    {loker.sumber && (
                      <Badge variant="outline" className="text-xs">
                        {loker.sumber}
                      </Badge>
                    )}
                  </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {loker.title}
                </h1>
                <div className="flex items-center gap-2 text-lg text-gray-700 mb-4">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">{loker.perusahaan_name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookmarkButton
                  lokerId={loker.id}
                  initialBookmarked={loker.is_bookmarked || false}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {loker.kategori?.map((kat) => (
                <Badge
                  key={kat}
                  variant="outline"
                  className="border-blue-200 text-blue-700 bg-blue-50"
                >
                  {kat}
                </Badge>
              ))}
              {loker.tipe_pekerjaan && (
                <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
                  {loker.tipe_pekerjaan}
                </Badge>
              )}
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Lokasi</div>
                  <div className="font-medium">{loker.lokasi}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Gaji</div>
                  <div className="font-medium text-green-600">
                    {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                  </div>
                </div>
              </div>

              {deadlineText && (
                <div className="flex items-center gap-3 text-gray-700">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isUrgent ? 'bg-red-100' : 'bg-gray-100'
                    }`}
                  >
                    <Calendar className={`w-5 h-5 ${isUrgent ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Deadline</div>
                    <div className={`font-medium ${isUrgent ? 'text-red-600' : ''}`}>
                      {deadlineText}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Dilihat</div>
                  <div className="font-medium">{loker.view_count || 0} kali</div>
                </div>
              </div>
            </div>

            {loker.published_at && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Diposting {getTimeAgo(loker.published_at)}</span>
              </div>
            )}
          </div>

          {/* AI Parsed Poster Section */}
          {isAIParsed && loker.poster_url && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Informasi dari Poster</h2>
              </div>
              
              {/* Poster Thumbnail */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPosterLightbox(true)}
                  className="relative w-full max-w-md mx-auto block rounded-lg overflow-hidden border-2 border-blue-300 hover:border-blue-500 transition-all group"
                >
                  <Image
                    src={loker.poster_url}
                    alt={`Poster ${loker.title}`}
                    width={400}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="bg-white rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <FileImage className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </button>
                <p className="text-center text-sm text-gray-600 mt-2">
                  Klik untuk melihat poster dalam ukuran penuh
                </p>
              </div>

              {/* Structured Information */}
              <div className="space-y-4 bg-white rounded-lg p-5 border border-blue-200">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-blue-500 rounded"></span>
                    Posisi yang Dibutuhkan
                  </h3>
                  <p className="text-gray-700 pl-4">{loker.title}</p>
                </div>

                {loker.kualifikasi && loker.kualifikasi.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-blue-500 rounded"></span>
                      Kualifikasi
                    </h3>
                    <ul className="space-y-2 pl-4">
                      {loker.kualifikasi.map((kual, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{kual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {loker.deskripsi && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-green-500 rounded"></span>
                      Benefit & Fasilitas
                    </h3>
                    <div className="text-gray-700 pl-4 whitespace-pre-wrap">
                      {loker.deskripsi}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-purple-500 rounded"></span>
                    Lokasi Kerja
                  </h3>
                  <p className="text-gray-700 pl-4">{loker.lokasi}</p>
                </div>

                {deadlineText && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-red-500 rounded"></span>
                      Deadline Lamaran
                    </h3>
                    <p className={`pl-4 font-medium ${isUrgent ? 'text-red-600' : 'text-gray-700'}`}>
                      {deadlineText === 'Sudah Ditutup' ? deadlineText : `Sampai ${deadlineText}`}
                    </p>
                  </div>
                )}

                {!deadlineText && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-gray-400 rounded"></span>
                      Deadline Lamaran
                    </h3>
                    <p className="text-gray-700 pl-4">Sampai posisi terisi</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-orange-500 rounded"></span>
                    Cara Melamar
                  </h3>
                  <div className="pl-4 space-y-2">
                    {loker.kontak_phone && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">WhatsApp: {loker.kontak_phone}</span>
                      </div>
                    )}
                    {loker.kontak_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">{loker.kontak_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              {loker.kategori && loker.kategori.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {loker.kategori.map((kat) => (
                      <Badge key={kat} variant="outline" className="border-blue-300 text-blue-700">
                        {kat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description (for non-AI parsed) */}
          {!isAIParsed && loker.deskripsi && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Pekerjaan</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {loker.deskripsi}
              </div>
            </div>
          )}

          {/* Requirements (for non-AI parsed) */}
          {!isAIParsed && loker.persyaratan && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Persyaratan</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {loker.persyaratan}
              </div>
            </div>
          )}

          {/* Qualifications (for non-AI parsed) */}
          {!isAIParsed && loker.kualifikasi && loker.kualifikasi.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kualifikasi</h2>
              <ul className="space-y-2">
                {loker.kualifikasi.map((kual, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{kual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Similar Jobs */}
          {similarLoker.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Loker Serupa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {similarLoker.map((similar) => {
                  const isAIParsedSimilar = similar.sumber === 'Poster' && similar.poster_url
                  return isAIParsedSimilar ? (
                    <LokerCardAIParsed key={similar.id} loker={similar} />
                  ) : (
                    <LokerCard key={similar.id} loker={similar} />
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 order-1 lg:order-2">
          {/* Apply Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              Lamar Sekarang
            </h3>

            <div className="space-y-3">
              {isAIParsed && loker.poster_url && (
                <Button
                  onClick={() => setShowPosterLightbox(true)}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-purple-500 text-purple-700 hover:bg-purple-50 hover:border-purple-600 transition-all shadow-sm hover:shadow-md"
                >
                  <FileImage className="w-4 h-4" />
                  Lihat Poster Lengkap
                </Button>
              )}
              
              {loker.kontak_phone && (
                <Button
                  onClick={() => handleApply('whatsapp')}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Lamar via WhatsApp
                </Button>
              )}

              {loker.kontak_email && (
                <Button
                  onClick={() => handleApply('email')}
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-600 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  Lamar via Email
                </Button>
              )}

              {!loker.kontak_phone && !loker.kontak_email && (
                <p className="text-sm text-gray-500 text-center py-4">
                  Informasi kontak belum tersedia
                </p>
              )}
            </div>

            {(loker.apply_count || 0) > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-white">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{loker.apply_count}</span> orang sudah melamar
                </p>
              </div>
            )}
          </div>

          {/* Company Info */}
          {loker.perusahaan && (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tentang Perusahaan</h3>

              {loker.perusahaan.logo_url && (
                <img
                  src={loker.perusahaan.logo_url}
                  alt={loker.perusahaan.name}
                  className="w-20 h-20 object-contain mb-4 rounded-lg border border-gray-200"
                />
              )}

              <h4 className="font-semibold text-gray-900 mb-2">{loker.perusahaan.name}</h4>

              {loker.perusahaan.deskripsi && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {loker.perusahaan.deskripsi}
                </p>
              )}

              {loker.perusahaan_id && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  <Link href={`/vip/perusahaan/${loker.perusahaan.slug}`} className="flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Lihat Semua Loker
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mobile Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 shadow-xl lg:hidden z-40 safe-area-bottom">
        <div className="flex items-center gap-2 max-w-screen-sm mx-auto">
          <BookmarkButton
            lokerId={loker.id}
            initialBookmarked={loker.is_bookmarked || false}
          />
          {loker.kontak_phone && (
            <Button
              onClick={() => handleApply('whatsapp')}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95 text-white gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden xs:inline font-medium">WhatsApp</span>
              <span className="xs:hidden font-medium">WA</span>
            </Button>
          )}
          {loker.kontak_email && (
            <Button
              onClick={() => handleApply('email')}
              variant="outline"
              className="flex-1 border-blue-500 text-blue-700 hover:bg-blue-50 active:scale-95 gap-2 shadow-sm hover:shadow-md transition-all font-medium"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden xs:inline">Email</span>
            </Button>
          )}
          {isAIParsed && loker.poster_url && (
            <Button
              onClick={() => setShowPosterLightbox(true)}
              variant="outline"
              className="border-purple-500 text-purple-700 hover:bg-purple-50 active:scale-95 px-3 shadow-sm hover:shadow-md transition-all"
            >
              <FileImage className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>

      {/* Poster Lightbox */}
      {showPosterLightbox && loker.poster_url && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPosterLightbox(false)}
        >
          <button
            onClick={() => setShowPosterLightbox(false)}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <Image
              src={loker.poster_url}
              alt={`Poster ${loker.title}`}
              width={800}
              height={1200}
              className="w-full h-auto rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  )
}


