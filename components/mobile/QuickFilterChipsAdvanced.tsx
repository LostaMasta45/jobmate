'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickFilterChip {
  id: string
  label: string
  icon?: string
  count?: number
}

interface QuickFilterChipsAdvancedProps {
  onFilterSelect: (filterId: string) => void
  activeFilters: string[]
  onClearAll?: () => void
  counts?: {
    remote: number
    fulltime: number
    freshgrad: number
    salaryHigh: number
    today: number
    urgent: number
    internship: number
  }
}

const getDefaultFilters = (counts?: QuickFilterChipsAdvancedProps['counts']): QuickFilterChip[] => [
  { id: 'remote', label: 'Remote', icon: '🏠', count: counts?.remote || 0 },
  { id: 'fulltime', label: 'Full-time', icon: '⏰', count: counts?.fulltime || 0 },
  { id: 'freshgrad', label: 'Fresh Graduate', icon: '🎓', count: counts?.freshgrad || 0 },
  { id: 'salary-high', label: '> 5jt', icon: '💰', count: counts?.salaryHigh || 0 },
  { id: 'today', label: 'Hari Ini', icon: '⚡', count: counts?.today || 0 },
  { id: 'urgent', label: 'Segera Ditutup', icon: '🔥', count: counts?.urgent || 0 },
  { id: 'internship', label: 'Magang', icon: '📚', count: counts?.internship || 0 },
]

export function QuickFilterChipsAdvanced({ 
  onFilterSelect, 
  activeFilters = [],
  onClearAll,
  counts 
}: QuickFilterChipsAdvancedProps) {
  
  const filters = getDefaultFilters(counts)
  
  return (
    <div className="lg:hidden px-4 py-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
          Filter Cepat
        </span>
        {activeFilters.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Hapus Semua
          </button>
        )}
      </div>

      {/* Multi-row Wrap Chips - No Horizontal Scroll */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => {
          const isActive = activeFilters.includes(filter.id)
          
          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.04,
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              onClick={() => onFilterSelect(filter.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:scale-[1.02]"
              )}
              whileTap={{ scale: 0.95 }}
            >
              {filter.icon && (
                <span className="text-base leading-none">{filter.icon}</span>
              )}
              <span className="text-xs font-semibold">{filter.label}</span>
              {filter.count !== undefined && filter.count > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                )}>
                  {filter.count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
