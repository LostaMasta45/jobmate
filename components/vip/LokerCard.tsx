'use client'

import Link from 'next/link'
import { MapPin, Briefcase, Calendar, DollarSign, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface LokerCardProps {
  loker: Loker
}

export function LokerCard({ loker }: LokerCardProps) {
  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}-${(gaji_max / 1000000).toFixed(1)} jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)} jt`
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
      
      return deadlineDate.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return null
    }
  }

  const deadlineText = getDeadlineText(loker.deadline)
  const isUrgent = deadlineText && (deadlineText.includes('hari') || deadlineText === 'Besok' || deadlineText === 'Hari ini')

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link 
              href={`/vip/loker/${loker.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 group-hover:text-blue-600"
            >
              {loker.title}
            </Link>
          </div>
          {loker.is_featured && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 ml-2">
              ⭐ Featured
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Building className="w-4 h-4" />
          <span className="text-sm font-medium">{loker.perusahaan_name}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
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
      </div>

      {/* Details */}
      <div className="px-6 pb-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{loker.lokasi}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-green-600">
            {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
          </span>
        </div>

        {deadlineText && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={isUrgent ? 'text-red-600 font-medium' : 'text-gray-600'}>
              Deadline: {deadlineText}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{loker.view_count || 0} views</span>
          </div>
          {loker.published_at && (
            <span>{getTimeAgo(loker.published_at)}</span>
          )}
        </div>
        
        <Button 
          asChild 
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow-md transition-all"
        >
          <Link href={`/vip/loker/${loker.id}`}>
            Lihat Detail
          </Link>
        </Button>
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
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  )
}
