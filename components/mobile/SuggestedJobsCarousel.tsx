'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, DollarSign, Building2, Bookmark } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { useState } from 'react'

interface SuggestedJobsCarouselProps {
  jobs: Loker[]
  title?: string
}

// Purple/Cyan gradients for job cards
const cardGradients = [
  'from-[#8e68fd]/10 to-[#5547d0]/5',
  'from-[#5547d0]/10 to-[#3977d3]/5',
  'from-[#3977d3]/10 to-[#00acc7]/5',
  'from-[#00acc7]/10 to-[#00bed1]/5',
  'from-[#00bed1]/10 to-[#00d1dc]/5',
  'from-[#00d1dc]/10 to-[#00acc7]/5',
]

export function SuggestedJobsCarousel({ jobs, title }: SuggestedJobsCarouselProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt+`
    }
    return 'Tidak disebutkan'
  }

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div>
      {/* Horizontal Scrollable Cards */}
      <div className="overflow-x-auto scrollbar-hide px-4">
        <div className="flex gap-4 pb-2">
          {jobs.slice(0, 10).map((job, index) => {
            const gradient = cardGradients[index % cardGradients.length]
            const isBookmarked = bookmarked.has(job.id)

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px]"
              >
                <Link
                  href={`/vip/loker/${job.id}`}
                  className="block bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-200 active:scale-[0.98] h-full"
                >
                  {/* Company Logo + Bookmark */}
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center`}>
                      {job.perusahaan?.logo_url ? (
                        <Image
                          src={job.perusahaan.logo_url}
                          alt={job.perusahaan_name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleBookmark(job.id)
                      }}
                      className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isBookmarked
                            ? 'fill-blue-500 text-blue-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Job Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                      {job.title}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5 line-clamp-1 font-medium">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.perusahaan_name}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{job.lokasi}</span>
                      </div>
                      {job.tipe_pekerjaan && (
                        <>
                          <span className="flex-shrink-0">•</span>
                          <span className="truncate">{job.tipe_pekerjaan}</span>
                        </>
                      )}
                    </div>

                    {/* Salary */}
                    <div className="pt-1.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00d1dc] to-[#00acc7] flex items-center justify-center shadow-sm flex-shrink-0">
                        <DollarSign className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {formatSalary(job.gaji_text, job.gaji_min, job.gaji_max)}
                      </span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {job.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-[10px] font-bold px-1.5 py-0.5">
                      ⭐
                    </Badge>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
