'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, DollarSign, Briefcase, Heart, Building2, Calendar, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useState } from 'react'

interface LokerCardRedesignedProps {
  loker: Loker
}

export function LokerCardRedesigned({ loker }: LokerCardRedesignedProps) {
  const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
  const [bookmarkLoading, setBookmarkLoading] = useState(false)

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt`
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

  const getDeadlineText = (deadline?: string) => {
    if (!deadline) return null
    try {
      const deadlineDate = new Date(deadline)
      const today = new Date()
      const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return null
      if (diffDays === 0) return 'Hari ini'
      if (diffDays === 1) return 'Besok'
      if (diffDays <= 7) return `${diffDays} hari lagi`
      
      return null
    } catch {
      return null
    }
  }

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setBookmarkLoading(true)
    
    try {
      // TODO: Call API to save/unsave bookmark
      setIsBookmarked(!isBookmarked)
      
      // Show micro-interaction animation
      const target = e.currentTarget
      target.classList.add('animate-ping')
      setTimeout(() => {
        target.classList.remove('animate-ping')
      }, 300)
    } catch (error) {
      console.error('Bookmark error:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const deadlineText = getDeadlineText(loker.deadline)
  const isUrgent = deadlineText && (deadlineText.includes('hari') || deadlineText === 'Besok' || deadlineText === 'Hari ini')
  const isAIParsed = loker.sumber === 'Poster' && loker.poster_url

  return (
    <Link 
      href={`/vip/loker/${loker.id}`}
      className="group"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 card-hover shadow-sm relative overflow-hidden">
        {/* Background Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Top Row: Logo + Badges + Bookmark */}
          <div className="flex items-start gap-4 mb-4">
            {/* Company Logo */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 p-2 flex items-center justify-center border border-gray-200 dark:border-slate-600 group-hover:scale-110 transition-transform">
              {loker.perusahaan?.logo_url ? (
                <Image
                  src={loker.perusahaan.logo_url}
                  alt={loker.perusahaan_name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <Building2 className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              )}
            </div>

            {/* Badges + Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap gap-2">
                  {loker.is_featured && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-xs">
                      ⭐ Featured
                    </Badge>
                  )}
                  {isAIParsed && (
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  {isUrgent && (
                    <Badge variant="destructive" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {deadlineText}
                    </Badge>
                  )}
                </div>

                {/* Bookmark Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={handleBookmarkClick}
                  disabled={bookmarkLoading}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isBookmarked
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400 group-hover:text-red-500'
                    }`}
                  />
                </Button>
              </div>

              {/* Company Name */}
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {loker.perusahaan_name}
              </p>
            </div>
          </div>

          {/* Job Title */}
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {loker.title}
          </h3>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate">{loker.lokasi}</span>
            </div>

            {/* Salary */}
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <DollarSign className="w-4 h-4" />
              <span className="truncate">{formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}</span>
            </div>

            {/* Job Type */}
            {loker.tipe_pekerjaan && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span className="truncate">{loker.tipe_pekerjaan}</span>
              </div>
            )}

            {/* Posted Time */}
            {loker.published_at && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="truncate">{getTimeAgo(loker.published_at)}</span>
              </div>
            )}
          </div>

          {/* Category Tags */}
          {loker.kategori && loker.kategori.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {loker.kategori.slice(0, 3).map((kat) => (
                <Badge 
                  key={kat} 
                  variant="outline" 
                  className="text-xs border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                >
                  {kat}
                </Badge>
              ))}
              {loker.kategori.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{loker.kategori.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Hover Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </div>
    </Link>
  )
}

