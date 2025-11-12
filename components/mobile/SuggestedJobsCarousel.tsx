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

// Colorful gradients for job cards
const cardGradients = [
  'from-blue-500/10 to-blue-600/5',
  'from-purple-500/10 to-purple-600/5',
  'from-pink-500/10 to-pink-600/5',
  'from-green-500/10 to-green-600/5',
  'from-orange-500/10 to-orange-600/5',
  'from-teal-500/10 to-teal-600/5',
]

export function SuggestedJobsCarousel({ jobs, title = 'Suggested Jobs' }: SuggestedJobsCarouselProps) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `$${(gaji_min / 1000000).toFixed(0)}k-${(gaji_max / 1000000).toFixed(0)}k`
    }
    if (gaji_min) {
      return `$${(gaji_min / 1000000).toFixed(0)}k+`
    }
    return 'Nego'
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        <Link
          href="/vip/loker"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          See all
        </Link>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
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
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                      {job.title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 line-clamp-1">
                      <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                      {job.perusahaan_name}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.lokasi}
                      </div>
                      {job.tipe_pekerjaan && (
                        <>
                          <span>•</span>
                          <span>{job.tipe_pekerjaan}</span>
                        </>
                      )}
                    </div>

                    {/* Salary */}
                    <div className="pt-2 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatSalary(job.gaji_text, job.gaji_min, job.gaji_max)}
                      </span>
                    </div>
                  </div>

                  {/* Featured Badge */}
                  {job.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
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
