'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, MapPin, Tag } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const QUICK_FILTERS = [
  { id: 'all', label: 'Semua', icon: '🌐' },
  { id: 'it', label: 'IT & Tech', icon: '💻' },
  { id: 'marketing', label: 'Marketing', icon: '📢' },
  { id: 'sales', label: 'Sales', icon: '💼' },
  { id: 'fnb', label: 'F&B', icon: '🍕' },
  { id: 'retail', label: 'Retail', icon: '🛍️' },
]

const LOCATIONS = [
  'Semua Lokasi', 'Jombang Kota', 'Sumobito', 'Diwek', 
  'Ploso', 'Mojowarno', 'Bareng', 'Gudo'
]

interface TabFilterNavigationProps {
  onFilterChange?: (filters: { category: string; location: string; search: string }) => void
}

export function TabFilterNavigation({ onFilterChange }: TabFilterNavigationProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLocation, setActiveLocation] = useState('Semua Lokasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [showLocationMenu, setShowLocationMenu] = useState(false)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    onFilterChange?.({ category, location: activeLocation, search: searchQuery })
  }

  const handleLocationChange = (location: string) => {
    setActiveLocation(location)
    setShowLocationMenu(false)
    onFilterChange?.({ category: activeCategory, location, search: searchQuery })
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onFilterChange?.({ category: activeCategory, location: activeLocation, search: value })
  }

  const activeFiltersCount = [
    activeCategory !== 'all' ? 1 : 0,
    activeLocation !== 'Semua Lokasi' ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Cari posisi, perusahaan, atau skill..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-24 h-14 text-base rounded-3xl border-2 focus:border-cyan-500 dark:focus:border-cyan-400 transition-colors bg-white dark:bg-card"
        />
        {activeFiltersCount > 0 && (
          <Badge className="absolute right-4 top-1/2 -translate-y-1/2 bg-cyan-500 text-white">
            {activeFiltersCount} Filter
          </Badge>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
        <div className="relative">
          <TabsList className="inline-flex h-auto p-1.5 bg-gray-100 dark:bg-gray-900 rounded-2xl w-auto overflow-x-auto scrollbar-none">
            {QUICK_FILTERS.map((filter) => (
              <TabsTrigger
                key={filter.id}
                value={filter.id}
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-card data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 data-[state=active]:shadow-md rounded-xl px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap"
              >
                <span className="mr-2">{filter.icon}</span>
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {/* Location & Advanced Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Location Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setShowLocationMenu(!showLocationMenu)}
            className="gap-2 rounded-2xl border-2 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>{activeLocation}</span>
          </Button>

          {showLocationMenu && (
            <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-card rounded-2xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl p-2 z-50 max-h-64 overflow-y-auto">
              {LOCATIONS.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl transition-colors ${
                    activeLocation === location
                      ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-medium'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Filters Button */}
        <Button
          variant="outline"
          className="gap-2 rounded-2xl border-2 hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter Lanjutan</span>
        </Button>

        {/* Active Filters Display */}
        {activeCategory !== 'all' && (
          <Badge
            variant="secondary"
            className="gap-2 px-4 py-2 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border-2 border-cyan-200 dark:border-cyan-900"
          >
            <Tag className="w-3.5 h-3.5" />
            {QUICK_FILTERS.find(f => f.id === activeCategory)?.label}
          </Badge>
        )}

        {activeLocation !== 'Semua Lokasi' && (
          <Badge
            variant="secondary"
            className="gap-2 px-4 py-2 rounded-2xl bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-2 border-orange-200 dark:border-orange-900"
          >
            <MapPin className="w-3.5 h-3.5" />
            {activeLocation}
          </Badge>
        )}
      </div>
    </div>
  )
}
