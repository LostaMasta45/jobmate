'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

interface Company {
  id: string
  name: string
  logo_url?: string
  job_count: number
}

interface PerusahaanHiringProps {
  companies: Company[]
}

export function PerusahaanHiring({ companies }: PerusahaanHiringProps) {
  if (!companies || companies.length === 0) return null

  return (
    <div className="lg:hidden px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          🏢 Perusahaan Sedang Hiring
        </h3>
        <Link 
          href="/vip/perusahaan"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all active:scale-95"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Horizontal Scrollable with Fade Edge */}
      <div className="relative -mx-4">
        {/* Fade Edge Overlay - Right side */}
        <div className="absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 dark:from-slate-950 to-transparent pointer-events-none z-[5]" />
        
        <div className="overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex gap-3 pb-2">
          {companies.slice(0, 10).map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="snap-start"
            >
              <Link
                href={`/vip/perusahaan?company=${company.id}`}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all active:scale-95 min-w-[100px]"
              >
                {/* Logo */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900 p-2 flex items-center justify-center">
                    {company.logo_url ? (
                      <Image
                        src={company.logo_url}
                        alt={company.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div className="text-center">
                  <div className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight mb-1 max-w-[80px]">
                    {company.name}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                    {company.job_count} loker
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
