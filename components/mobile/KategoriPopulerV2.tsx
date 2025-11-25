'use client'

import { motion } from 'framer-motion'
import { Code, Megaphone, TrendingUp, Coffee, ShoppingBag, FileText, Wrench, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { AllCategoriesBottomSheet } from './AllCategoriesBottomSheet'

interface KategoriItem {
  id: string
  label: string
  icon: React.ElementType
  count: number
  gradient: string
  shadowColor: string
}

interface KategoriPopulerProps {
  onKategoriSelect: (kategoriId: string) => void
  counts?: {
    it: number
    marketing: number
    sales: number
    fnb: number
    retail: number
    admin: number
    engineer: number
    hrd: number
  }
}

const getCategories = (counts?: KategoriPopulerProps['counts']): KategoriItem[] => [
  { 
    id: 'it', 
    label: 'IT & Tech', 
    icon: Code, 
    count: counts?.it || 0,
    gradient: 'from-[#8e68fd] to-[#5547d0]',
    shadowColor: 'rgba(142,104,253,0.4)'
  },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: Megaphone, 
    count: counts?.marketing || 0,
    gradient: 'from-[#00d1dc] to-[#00acc7]',
    shadowColor: 'rgba(0,209,220,0.4)'
  },
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: TrendingUp, 
    count: counts?.sales || 0,
    gradient: 'from-[#3977d3] to-[#2a5cad]',
    shadowColor: 'rgba(57,119,211,0.4)'
  },
  { 
    id: 'fnb', 
    label: 'F&B', 
    icon: Coffee, 
    count: counts?.fnb || 0,
    gradient: 'from-orange-400 to-orange-600',
    shadowColor: 'rgba(251,146,60,0.4)'
  },
  { 
    id: 'retail', 
    label: 'Retail', 
    icon: ShoppingBag, 
    count: counts?.retail || 0,
    gradient: 'from-pink-500 to-rose-500',
    shadowColor: 'rgba(236,72,153,0.4)'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: FileText, 
    count: counts?.admin || 0,
    gradient: 'from-emerald-400 to-teal-600',
    shadowColor: 'rgba(52,211,153,0.4)'
  },
  { 
    id: 'engineer', 
    label: 'Engineer', 
    icon: Wrench, 
    count: counts?.engineer || 0,
    gradient: 'from-slate-600 to-slate-800',
    shadowColor: 'rgba(71,85,105,0.4)'
  },
  { 
    id: 'hrd', 
    label: 'HRD', 
    icon: Users, 
    count: counts?.hrd || 0,
    gradient: 'from-indigo-500 to-violet-700',
    shadowColor: 'rgba(99,102,241,0.4)'
  },
]

export function KategoriPopulerV2({ onKategoriSelect, counts }: KategoriPopulerProps) {
  const [showAllCategories, setShowAllCategories] = useState(false)
  const categories = getCategories(counts)

  return (
    <>
      <div className="lg:hidden px-4 py-4">
        {/* Header with Elegant Typography */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">
            Kategori Populer
          </h3>
          <button 
            onClick={() => setShowAllCategories(true)}
            className="text-xs font-semibold text-[#8e68fd] dark:text-[#8e68fd] hover:text-[#5547d0] transition-colors active:scale-95 bg-[#8e68fd]/10 px-3 py-1 rounded-full"
          >
            Lihat Semua
          </button>
        </div>

        {/* Elegant Grid Layout */}
        <div className="grid grid-cols-4 gap-x-3 gap-y-5">
          {categories.map((category, index) => {
            const Icon = category.icon
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => onKategoriSelect(category.id)}
                className="group flex flex-col items-center gap-2"
                whileTap={{ scale: 0.9 }}
              >
                {/* Squircle Icon Container with Shadow and Gradient */}
                <div className="relative">
                  <div 
                    className={cn(
                      "w-[60px] h-[60px] rounded-[20px] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1",
                      `bg-gradient-to-br ${category.gradient}`
                    )}
                    style={{
                      boxShadow: `0 10px 20px -5px ${category.shadowColor}`
                    }}
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-white/30 to-transparent opacity-50 pointer-events-none" />
                    
                    {/* Icon */}
                    <Icon className="w-7 h-7 text-white drop-shadow-md relative z-10" strokeWidth={2} />
                  </div>
                  
                  {/* Notification Badge if high count */}
                  {category.count > 20 && (
                    <div className="absolute -top-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-0.5">
                      <div className="bg-red-500 w-2.5 h-2.5 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="text-center flex flex-col items-center">
                  <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 leading-tight group-hover:text-[#8e68fd] dark:group-hover:text-[#8e68fd] transition-colors">
                    {category.label}
                  </span>
                  {category.count > 0 && (
                    <span className="text-[9px] text-gray-400 font-medium mt-0.5">
                      {category.count}
                    </span>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* All Categories Bottom Sheet */}
      <AllCategoriesBottomSheet
        isOpen={showAllCategories}
        onClose={() => setShowAllCategories(false)}
        onCategorySelect={onKategoriSelect}
        counts={counts}
      />
    </>
  )
}
