'use client'

import { motion } from 'framer-motion'
import { Code, Megaphone, TrendingUp, Coffee, ShoppingBag, FileText, Wrench, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KategoriItem {
  id: string
  label: string
  icon: React.ElementType
  count: number
  gradient: string
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
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: Megaphone, 
    count: counts?.marketing || 0,
    gradient: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'sales', 
    label: 'Sales', 
    icon: TrendingUp, 
    count: counts?.sales || 0,
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    id: 'fnb', 
    label: 'F&B', 
    icon: Coffee, 
    count: counts?.fnb || 0,
    gradient: 'from-amber-500 to-orange-500'
  },
  { 
    id: 'retail', 
    label: 'Retail', 
    icon: ShoppingBag, 
    count: counts?.retail || 0,
    gradient: 'from-purple-500 to-indigo-500'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: FileText, 
    count: counts?.admin || 0,
    gradient: 'from-gray-500 to-slate-500'
  },
  { 
    id: 'engineer', 
    label: 'Engineer', 
    icon: Wrench, 
    count: counts?.engineer || 0,
    gradient: 'from-red-500 to-pink-500'
  },
  { 
    id: 'hrd', 
    label: 'HRD', 
    icon: Users, 
    count: counts?.hrd || 0,
    gradient: 'from-violet-500 to-purple-500'
  },
]

export function KategoriPopuler({ onKategoriSelect, counts }: KategoriPopulerProps) {
  
  const categories = getCategories(counts)
  
  return (
    <div className="lg:hidden px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Kategori Populer
        </h3>
        <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          Lihat Semua
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {categories.map((category, index) => {
          const Icon = category.icon
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onKategoriSelect(category.id)}
              className="relative flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all active:scale-95"
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon with Gradient */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-md",
                `bg-gradient-to-br ${category.gradient}`
              )}>
                <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>

              {/* Label */}
              <div className="text-center">
                <div className="text-[11px] font-bold text-gray-900 dark:text-white leading-tight mb-0.5">
                  {category.label}
                </div>
                <div className="text-[9px] font-semibold text-gray-500 dark:text-gray-400">
                  {category.count} loker
                </div>
              </div>

              {/* Badge for count */}
              {category.count > 30 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-[8px] font-bold">🔥</span>
                </div>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
