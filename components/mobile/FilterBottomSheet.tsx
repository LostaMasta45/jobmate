'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, SlidersHorizontal, MapPin, Tag, Clock, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FilterBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  locations: string[]
  categories: string[]
  jobTypes: string[]
  timeRange: string
}

const LOCATIONS = ['Jombang', 'Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Remote']
const CATEGORIES = ['IT', 'Marketing', 'Sales', 'F&B', 'Retail', 'Administrasi', 'Finance', 'Design']
const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']
const TIME_RANGES = [
  { value: 'all', label: 'Semua Waktu' },
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: '7 Hari Terakhir' },
  { value: 'month', label: '30 Hari Terakhir' }
]

export function FilterBottomSheet({ isOpen, onClose, onApply, initialFilters }: FilterBottomSheetProps) {
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      locations: [],
      categories: [],
      jobTypes: [],
      timeRange: 'all'
    }
  )

  const toggleArrayFilter = (key: 'locations' | 'categories' | 'jobTypes', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value]
    }))
  }

  const handleReset = () => {
    setFilters({
      locations: [],
      categories: [],
      jobTypes: [],
      timeRange: 'all'
    })
  }

  const handleApply = () => {
    onApply(filters)
    onClose()
  }

  const activeFilterCount = filters.locations.length + filters.categories.length + filters.jobTypes.length + (filters.timeRange !== 'all' ? 1 : 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-[70] lg:hidden max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                onClose()
              }
            }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filter Loker</h3>
                  {activeFilterCount > 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activeFilterCount} filter aktif</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Lokasi */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Lokasi</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <Badge
                      key={loc}
                      variant={filters.locations.includes(loc) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                        filters.locations.includes(loc)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-500'
                      }`}
                      onClick={() => toggleArrayFilter('locations', loc)}
                    >
                      {loc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Kategori */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Kategori</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <Badge
                      key={cat}
                      variant={filters.categories.includes(cat) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                        filters.categories.includes(cat)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-500'
                      }`}
                      onClick={() => toggleArrayFilter('categories', cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tipe Pekerjaan */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Tipe Pekerjaan</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={filters.jobTypes.includes(type) ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                        filters.jobTypes.includes(type)
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0'
                          : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-500'
                      }`}
                      onClick={() => toggleArrayFilter('jobTypes', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Waktu Posting */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Waktu Posting</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_RANGES.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setFilters((prev) => ({ ...prev, timeRange: range.value }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        filters.timeRange === range.value
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 rounded-xl font-semibold border-gray-300 dark:border-gray-700"
              >
                Reset
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg"
              >
                Terapkan Filter
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
