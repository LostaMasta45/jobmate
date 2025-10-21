'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X, MapPin, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const LOCATIONS = [
  'Jombang Kota',
  'Sumobito',
  'Diwek',
  'Ploso',
  'Mojowarno',
  'Bareng',
  'Wonosalam',
  'Semua Lokasi',
]

const CATEGORIES = [
  'IT & Technology',
  'Marketing',
  'Sales',
  'F&B',
  'Retail',
  'Kesehatan',
  'Pendidikan',
  'Administrasi',
]

interface FilterBarRedesignedProps {
  onSearch?: (query: string) => void
  onLocationChange?: (location: string | null) => void
  onCategoryChange?: (category: string | null) => void
}

export function FilterBarRedesigned({
  onSearch,
  onLocationChange,
  onCategoryChange,
}: FilterBarRedesignedProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleLocationClick = (location: string) => {
    const newLocation = selectedLocation === location ? null : location
    setSelectedLocation(newLocation)
    onLocationChange?.(newLocation)
  }

  const handleCategoryClick = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onCategoryChange?.(newCategory)
  }

  const clearFilters = () => {
    setSelectedLocation(null)
    setSelectedCategory(null)
    setSearchQuery('')
    onLocationChange?.(null)
    onCategoryChange?.(null)
    onSearch?.('')
  }

  const hasActiveFilters = selectedLocation || selectedCategory || searchQuery

  return (
    <div className="sticky top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari posisi, perusahaan, atau kata kunci..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-12 h-12 text-base rounded-xl border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => handleSearchChange('')}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <Button
            variant="outline"
            size="lg"
            className="gap-2 h-12 px-6 rounded-xl"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <Badge className="ml-2 bg-blue-600 text-white border-0">
                {[selectedLocation, selectedCategory, searchQuery].filter(Boolean).length}
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="lg"
              className="gap-2 h-12 px-4 rounded-xl text-red-600"
              onClick={clearFilters}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Location Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                Lokasi
              </div>
              <div className="flex flex-wrap gap-2">
                {LOCATIONS.map((location) => (
                  <button
                    key={location}
                    onClick={() => handleLocationClick(location)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedLocation === location
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Briefcase className="w-4 h-4" />
                Kategori
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter aktif:</span>
            {selectedLocation && (
              <Badge
                variant="outline"
                className="gap-2 pl-3 pr-2 py-1 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800"
              >
                <MapPin className="w-3 h-3" />
                {selectedLocation}
                <button
                  onClick={() => handleLocationClick(selectedLocation)}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge
                variant="outline"
                className="gap-2 pl-3 pr-2 py-1 bg-purple-50 dark:bg-purple-950 border-purple-300 dark:border-purple-800"
              >
                <Briefcase className="w-3 h-3" />
                {selectedCategory}
                <button
                  onClick={() => handleCategoryClick(selectedCategory)}
                  className="hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
