'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function QuickSearchBar() {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    
    router.push(`/vip/loker?${params.toString()}`)
  }

  const handleClear = () => {
    setSearchQuery('')
  }

  return (
    <div className="sticky top-14 sm:top-16 z-30 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 mb-6 shadow-sm">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-3">
          {/* Main Search Bar */}
          <div className="flex gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Cari posisi, perusahaan, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 sm:pl-10 pr-10 h-10 sm:h-11 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg sm:rounded-xl text-sm sm:text-base bg-white dark:bg-gray-800 transition-all focus:shadow-md"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              disabled={!searchQuery}
              className="h-10 sm:h-11 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg sm:rounded-xl font-semibold shadow-md hover:shadow-lg disabled:shadow-none transition-all disabled:cursor-not-allowed"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Cari</span>
            </Button>
          </div>

          {/* Quick Filters - Horizontal Scroll on Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
          <button
            type="button"
            onClick={() => {
              setSearchQuery('IT Software Developer')
              const params = new URLSearchParams()
              params.set('search', 'IT Software Developer')
              router.push(`/vip/loker?${params.toString()}`)
            }}
            className="flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all border border-blue-200 dark:border-blue-800 hover:scale-105 active:scale-95"
          >
            💻 IT
          </button>
            
          <button
            type="button"
            onClick={() => {
              setSearchQuery('Marketing')
              const params = new URLSearchParams()
              params.set('search', 'Marketing')
              router.push(`/vip/loker?${params.toString()}`)
            }}
            className="flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-all border border-purple-200 dark:border-purple-800 hover:scale-105 active:scale-95"
          >
            📢 Marketing
          </button>
            
          <button
            type="button"
            onClick={() => {
              setSearchQuery('Sales')
              const params = new URLSearchParams()
              params.set('search', 'Sales')
              router.push(`/vip/loker?${params.toString()}`)
            }}
            className="flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-950/50 transition-all border border-green-200 dark:border-green-800 hover:scale-105 active:scale-95"
          >
            💰 Sales
          </button>
            
          <button
            type="button"
            onClick={() => {
              setSearchQuery('F&B')
              const params = new URLSearchParams()
              params.set('search', 'F&B')
              router.push(`/vip/loker?${params.toString()}`)
            }}
            className="flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-all border border-orange-200 dark:border-orange-800 hover:scale-105 active:scale-95"
          >
            🍽️ F&B
          </button>

          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="flex-shrink-0 px-3 py-1.5 text-xs sm:text-sm rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all border border-red-200 dark:border-red-800 hover:scale-105 active:scale-95 font-medium"
            >
              <X className="w-3 h-3 inline mr-1" />
              Clear
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  )
}
