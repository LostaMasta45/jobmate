'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, MessageCircle, Mail, Calendar, Eye, Brain, FileImage } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface LokerCardAIParsedProps {
  loker: Loker
}

export function LokerCardAIParsed({ loker }: LokerCardAIParsedProps) {
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

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return 'Sampai posisi terisi'
    try {
      const deadlineDate = new Date(deadline)
      const today = new Date()
      const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'Ditutup'
      if (diffDays === 0) return 'Hari ini'
      if (diffDays === 1) return 'Besok'
      if (diffDays <= 7) return `${diffDays} hari lagi`

      return deadlineDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Sampai posisi terisi'
    }
  }

  const deadlineText = getDeadlineText(loker.deadline)
  const isUrgent = deadlineText && (deadlineText.includes('hari') || deadlineText === 'Besok' || deadlineText === 'Hari ini')

  // Parse kualifikasi dan benefit (max 3 each)
  const kualifikasi = loker.kualifikasi?.slice(0, 3) || []
  const benefit = loker.deskripsi?.split('\n')
    .filter(line => line.toLowerCase().includes('benefit') || line.toLowerCase().includes('fasilitas'))
    .slice(0, 3) || []

  return (
    <div className="bg-white rounded-xl border-2 border-blue-200 hover:shadow-xl hover:border-blue-400 transition-all duration-300 overflow-hidden group relative hover:-translate-y-1">
      {/* AI Badge - Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg">
          <Brain className="w-3 h-3 mr-1" />
          AI Parsed
        </Badge>
      </div>

      {/* Poster Thumbnail & Header */}
      <div className="p-6 pb-4">
        <div className="flex gap-4">
          {/* Poster Thumbnail */}
          {loker.poster_url && (
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200 relative group/img">
                <Image
                  src={loker.poster_url}
                  alt={`Poster ${loker.title}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                  <FileImage className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Link
              href={`/vip/loker/${loker.id}`}
              className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 block mb-2 group-hover:text-blue-600"
            >
              {loker.title}
            </Link>

            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <Building className="w-4 h-4" />
              <span className="text-sm font-medium">{loker.perusahaan_name}</span>
              {loker.perusahaan?.logo_url && (
                <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                  ✓ Verified
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{loker.lokasi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights AI Section */}
      <div className="px-6 pb-4 space-y-3">
        {/* Kualifikasi */}
        {kualifikasi.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="w-1 h-4 bg-blue-500 rounded"></span>
              Kualifikasi
            </div>
            <ul className="space-y-1">
              {kualifikasi.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span className="flex-1 line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefit (if exists) */}
        {benefit.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="w-1 h-4 bg-green-500 rounded"></span>
              Benefit
            </div>
            <ul className="space-y-1">
              {benefit.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="flex-1 line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {loker.kategori?.slice(0, 2).map((kat) => (
            <Badge
              key={kat}
              variant="outline"
              className="text-xs border-blue-200 text-blue-700 bg-blue-50"
            >
              {kat}
            </Badge>
          ))}
          {loker.tipe_pekerjaan && (
            <Badge
              variant="outline"
              className="text-xs border-purple-200 text-purple-700 bg-purple-50"
            >
              {loker.tipe_pekerjaan}
            </Badge>
          )}
        </div>

        {/* Deadline */}
        {deadlineText && (
          <div className="flex items-center gap-2 text-sm pt-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={isUrgent ? 'text-red-600 font-medium' : 'text-gray-600'}>
              Deadline: {deadlineText}
            </span>
          </div>
        )}
      </div>

      {/* Footer with CTA */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{loker.view_count || 0}</span>
            </div>
            {loker.published_at && (
              <span>{getTimeAgo(loker.published_at)}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* CTA WhatsApp */}
          {loker.kontak_wa && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50 hover:border-green-600 active:bg-green-100 transition-all shadow-sm hover:shadow"
            >
              <a
                href={`https://wa.me/${loker.kontak_wa.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">WA</span>
              </a>
            </Button>
          )}

          {/* CTA Email */}
          {loker.kontak_email && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-blue-500 text-blue-700 hover:bg-blue-50 hover:border-blue-600 active:bg-blue-100 transition-all shadow-sm hover:shadow"
            >
              <a href={`mailto:${loker.kontak_email}`}>
                <Mail className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Email</span>
              </a>
            </Button>
          )}

          {/* View Detail - full width if only one contact */}
          {(!loker.kontak_wa || !loker.kontak_email) && (
            <Button
              asChild
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all"
            >
              <Link href={`/vip/loker/${loker.id}`}>
                <FileImage className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Lihat Detail</span>
                <span className="sm:hidden">Detail</span>
              </Link>
            </Button>
          )}
        </div>

        {/* View Detail button if both contacts exist */}
        {loker.kontak_wa && loker.kontak_email && (
          <Button
            asChild
            size="sm"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all"
          >
            <Link href={`/vip/loker/${loker.id}`}>
              <FileImage className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Lihat Detail & Poster</span>
              <span className="sm:hidden">Detail & Poster</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

function Building({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}


