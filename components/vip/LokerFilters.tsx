'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KATEGORI_LOKER, LOKASI_JOMBANG, TIPE_KERJA, SORT_OPTIONS } from '@/types/vip'
import { useState } from 'react'

interface LokerFiltersProps {
  onFilterChange: (filters: any) => void
  totalResults?: number
}

export function LokerFilters({ onFilterChange, totalResults = 0 }: LokerFiltersProps) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedKategori, setSelectedKategori] = useState<string[]>([])
  const [selectedLokasi, setSelectedLokasi] = useState<string[]>([])
  const [selectedTipe, setSelectedTipe] = useState('')
  const [sortBy, setSortBy] = useState('terbaru')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    applyFilters({ search: value })
  }

  const handleKategoriToggle = (kategori: string) => {
    const newKategori = selectedKategori.includes(kategori)
      ? selectedKategori.filter(k => k !== kategori)
      : [...selectedKategori, kategori]
    
    setSelectedKategori(newKategori)
    applyFilters({ kategori: newKategori })
  }

  const handleLokasiToggle = (lokasi: string) => {
    const newLokasi = selectedLokasi.includes(lokasi)
      ? selectedLokasi.filter(l => l !== lokasi)
      : [...selectedLokasi, lokasi]
    
    setSelectedLokasi(newLokasi)
    applyFilters({ lokasi: newLokasi })
  }

  const handleTipeChange = (value: string) => {
    setSelectedTipe(value)
    applyFilters({ TIPE_KERJA: value })
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    applyFilters({ sort: value })
  }

  const applyFilters = (partialFilters: any) => {
    onFilterChange({
      search: partialFilters.search !== undefined ? partialFilters.search : search,
      kategori: partialFilters.kategori !== undefined ? partialFilters.kategori : selectedKategori,
      lokasi: partialFilters.lokasi !== undefined ? partialFilters.lokasi : selectedLokasi,
      TIPE_KERJA: partialFilters.TIPE_KERJA !== undefined ? partialFilters.TIPE_KERJA : selectedTipe,
      sort: partialFilters.sort !== undefined ? partialFilters.sort : sortBy,
    })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedKategori([])
    setSelectedLokasi([])
    setSelectedTipe('')
    setSortBy('terbaru')
    onFilterChange({
      search: '',
      kategori: [],
      lokasi: [],
      TIPE_KERJA: '',
      sort: 'terbaru',
    })
  }

  const hasActiveFilters = selectedKategori.length > 0 || selectedLokasi.length > 0 || selectedTipe || search

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari posisi, perusahaan, atau kata kunci..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="lg"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Ditemukan <span className="font-semibold text-gray-900">{totalResults}</span> lowongan kerja
        </p>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 text-gray-600"
          >
            <X className="w-4 h-4" />
            Hapus Filter
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Urutkan
            </label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih urutan" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Kategori ({selectedKategori.length} dipilih)
            </label>
            <div className="flex flex-wrap gap-2">
              {KATEGORI_LOKER.slice(0, 12).map((kategori) => (
                <Badge
                  key={kategori}
                  variant={selectedKategori.includes(kategori) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    selectedKategori.includes(kategori)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleKategoriToggle(kategori)}
                >
                  {kategori}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Lokasi ({selectedLokasi.length} dipilih)
            </label>
            <div className="flex flex-wrap gap-2">
              {LOKASI_JOMBANG.slice(0, 12).map((lokasi) => (
                <Badge
                  key={lokasi}
                  variant={selectedLokasi.includes(lokasi) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-colors ${
                    selectedLokasi.includes(lokasi)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleLokasiToggle(lokasi)}
                >
                  {lokasi}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tipe Kerja */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Tipe Pekerjaan
            </label>
            <Select value={selectedTipe} onValueChange={handleTipeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Tipe</SelectItem>
                {TIPE_KERJA.map((tipe) => (
                  <SelectItem key={tipe} value={tipe}>
                    {tipe}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedKategori.map((kategori) => (
            <Badge
              key={kategori}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {kategori}
              <button
                onClick={() => handleKategoriToggle(kategori)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedLokasi.map((lokasi) => (
            <Badge
              key={lokasi}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {lokasi}
              <button
                onClick={() => handleLokasiToggle(lokasi)}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedTipe && (
            <Badge variant="secondary" className="gap-1 pr-1">
              {selectedTipe}
              <button
                onClick={() => handleTipeChange('')}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

