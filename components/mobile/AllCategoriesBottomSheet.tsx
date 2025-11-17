'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Code, Megaphone, TrendingUp, Coffee, ShoppingBag, FileText, Wrench, Users, Briefcase, GraduationCap, Heart, Building2, Truck, Home } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  label: string
  icon: React.ElementType
  count: number
  gradient: string
}

interface AllCategoriesBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onCategorySelect: (categoryId: string) => void
  counts?: {
    it: number
    marketing: number
    sales: number
    fnb: number
    retail: number
    admin: number
    engineer: number
    hrd: number
    finance?: number
    healthcare?: number
    education?: number
    manufacturing?: number
    logistics?: number
    hospitality?: number
  }
}

const getAllCategories = (counts?: AllCategoriesBottomSheetProps['counts']): Category[] => [
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
  { 
    id: 'finance', 
    label: 'Finance', 
    icon: Briefcase, 
    count: counts?.finance || 0,
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'healthcare', 
    label: 'Healthcare', 
    icon: Heart, 
    count: counts?.healthcare || 0,
    gradient: 'from-red-400 to-pink-400'
  },
  { 
    id: 'education', 
    label: 'Education', 
    icon: GraduationCap, 
    count: counts?.education || 0,
    gradient: 'from-blue-400 to-indigo-400'
  },
  { 
    id: 'manufacturing', 
    label: 'Manufacturing', 
    icon: Building2, 
    count: counts?.manufacturing || 0,
    gradient: 'from-gray-600 to-gray-700'
  },
  { 
    id: 'logistics', 
    label: 'Logistics', 
    icon: Truck, 
    count: counts?.logistics || 0,
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'hospitality', 
    label: 'Hospitality', 
    icon: Home, 
    count: counts?.hospitality || 0,
    gradient: 'from-teal-500 to-cyan-500'
  },
]

export function AllCategoriesBottomSheet({ isOpen, onClose, onCategorySelect, counts }: AllCategoriesBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const categories = getAllCategories(counts)

  // Filter categories based on search
  const filteredCategories = categories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Semua Kategori
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {filteredCategories.length} kategori tersedia
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Categories Grid - Scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="grid grid-cols-3 gap-3 pb-safe">
                {filteredCategories.map((category, index) => {
                  const Icon = category.icon
                  
                  return (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all active:scale-95"
                    >
                      {/* Icon with Gradient */}
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center shadow-sm",
                        `bg-gradient-to-br ${category.gradient}`
                      )}>
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>

                      {/* Label & Count */}
                      <div className="text-center w-full">
                        <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight mb-1">
                          {category.label}
                        </div>
                        <div className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                          {category.count} loker
                        </div>
                      </div>

                      {/* Hot Badge */}
                      {category.count > 50 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white text-[9px] font-bold">🔥</span>
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Empty State */}
              {filteredCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    Kategori tidak ditemukan
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Coba kata kunci lain
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
