'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, DollarSign, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
  icon?: React.ReactNode
  gradient?: string
}

const filterChips: FilterChip[] = [
  {
    id: 'all',
    label: 'Semua',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    gradient: 'from-gray-600 to-gray-700',
  },
  {
    id: 'full-time',
    label: 'Full Time',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    id: 'part-time',
    label: 'Part Time',
    icon: <Clock className="w-3.5 h-3.5" />,
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    id: 'remote',
    label: 'Remote',
    icon: <MapPin className="w-3.5 h-3.5" />,
    gradient: 'from-green-500 to-green-600',
  },
  {
    id: 'internship',
    label: 'Internship',
    icon: <Briefcase className="w-3.5 h-3.5" />,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    id: 'freelance',
    label: 'Freelance',
    icon: <DollarSign className="w-3.5 h-3.5" />,
    gradient: 'from-pink-500 to-pink-600',
  },
]

interface QuickFilterChipsProps {
  onFilterChange?: (filterId: string) => void
  className?: string
}

export function QuickFilterChips({ onFilterChange, className }: QuickFilterChipsProps) {
  const [activeFilter, setActiveFilter] = useState('all')

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId)
    onFilterChange?.(filterId)
  }

  return (
    <div className={cn('relative', className)}>
      {/* Horizontal Scrollable Container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-2 py-2">
          {filterChips.map((chip, index) => {
            const isActive = activeFilter === chip.id

            return (
              <motion.button
                key={chip.id}
                onClick={() => handleFilterClick(chip.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200',
                  'border shadow-sm',
                  isActive
                    ? `bg-gradient-to-r ${chip.gradient} text-white border-transparent shadow-lg`
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                )}
              >
                {chip.icon}
                <span className="whitespace-nowrap">{chip.label}</span>

                {/* Active Indicator Dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Fade Gradients (left & right) */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
    </div>
  )
}

// CSS for hiding scrollbar
const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

// Inject style (you can add this to globals.css instead)
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = scrollbarHideStyle
  document.head.appendChild(style)
}
