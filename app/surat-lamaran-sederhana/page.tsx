"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, History as HistoryIcon, Sparkles, Target, Plus, Search, Eye, Trash2 } from "lucide-react"
import { getSuratLamaranList, getSuratLamaranStats } from "@/actions/surat-lamaran-sederhana/list"
import { deleteSuratLamaran } from "@/actions/surat-lamaran-sederhana/delete"
import { ThumbnailPreview } from "@/components/surat-lamaran-sederhana/ThumbnailPreview"
import { AppShell } from "@/components/layout/AppShell"
import { toast } from "sonner"
import Link from "next/link"

export default function SuratLamaranSederhanaPage() {
  const [activeTab, setActiveTab] = useState<"buat" | "history">("buat")
  const [suratList, setSuratList] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadStats()
    if (activeTab === "history") {
      loadSuratList()
    }
  }, [activeTab, filter])

  const loadStats = async () => {
    try {
      const result = await getSuratLamaranStats()
      if (!result.error) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadSuratList = async () => {
    setLoading(true)
    try {
      const result = await getSuratLamaranList({
        status: filter === "all" ? undefined : filter,
        limit: 50
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setSuratList(result.data || [])
    } catch (error: any) {
      console.error('Error loading surat lamaran:', error)
      toast.error('Gagal memuat history')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus surat lamaran ini?')) return

    try {
      const result = await deleteSuratLamaran(id)
      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success('Surat lamaran berhasil dihapus')
      await loadSuratList()
      await loadStats()
    } catch (error: any) {
      console.error('Error deleting surat:', error)
      toast.error('Gagal menghapus surat lamaran')
    }
  }

  const filteredSurat = suratList.filter(surat => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      surat.nama_perusahaan?.toLowerCase().includes(search) ||
      surat.posisi_lowongan?.toLowerCase().includes(search) ||
      surat.nama_lengkap?.toLowerCase().includes(search)
    )
  })

  return (
    <AppShell>
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Header Card with Icon */}
        <Card className="mb-4 sm:mb-6 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-background border-2 shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Top: Title & Icon */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="p-2.5 sm:p-4 bg-emerald-500 rounded-xl sm:rounded-2xl shadow-md flex-shrink-0">
                    <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">Surat Lamaran</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                      Buat surat lamaran profesional dengan 20+ template siap pakai
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom: Badges & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    20 Template
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs">
                    <Target className="h-3 w-3 mr-1" />
                    ATS Ready
                  </Badge>
                  {stats && (
                    <Badge variant="outline" className="text-xs">
                      {stats.total} Surat Tersimpan
                    </Badge>
                  )}
                </div>

                {/* Tab Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => setActiveTab("buat")}
                    variant={activeTab === "buat" ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5 sm:gap-2 flex-1 sm:flex-none"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">Buat</span>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("history")}
                    variant={activeTab === "history" ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5 sm:gap-2 flex-1 sm:flex-none"
                  >
                    <HistoryIcon className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">History</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {activeTab === "buat" ? (
          /* Buat Tab - Landing Page */
          <Card>
            <CardContent className="py-12 sm:py-16 text-center px-4">
              <div className="max-w-md mx-auto">
                <div className="relative mb-4 sm:mb-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-2xl" />
                  </div>
                  <HistoryIcon className="relative h-16 w-16 sm:h-20 sm:w-20 mx-auto text-emerald-500 mb-2" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Lihat History Surat Lamaran</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                  Kelola semua surat lamaran yang pernah Anda buat
                </p>
                <Link href="/surat-lamaran-sederhana/buat">
                  <Button size="lg" className="gap-2 shadow-lg w-full sm:w-auto">
                    <Plus className="h-5 w-5" />
                    Buka History
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* History Tab */
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                          {stats.total}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Total Surat
                        </div>
                      </div>
                      <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                          {stats.final}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Surat Final
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl">✓</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
                          {stats.draft}
                        </div>
                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                          Draft
                        </div>
                      </div>
                      <div className="text-3xl sm:text-4xl">📝</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Filters */}
            <Card className="shadow-sm">
              <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Cari perusahaan, posisi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 text-sm"
                      />
                    </div>
                  </div>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] h-10 text-sm">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

          {/* Surat List */}
          {loading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  <p>Memuat data...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredSurat.length === 0 ? (
            <Card>
              <CardContent className="py-12 sm:py-16 text-center px-4">
                <div className="max-w-md mx-auto">
                  {searchTerm ? (
                    <>
                      <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-base sm:text-lg font-semibold mb-2">Tidak ada hasil</h3>
                      <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                        Tidak ada surat yang cocok dengan pencarian "{searchTerm}"
                      </p>
                      <Button variant="outline" onClick={() => setSearchTerm("")} size="sm">
                        Hapus Filter
                      </Button>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-primary animate-pulse mb-3 sm:mb-4" />
                      <h3 className="text-lg sm:text-xl font-bold mb-2">Belum ada surat tersimpan</h3>
                      <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                        Mulai buat surat lamaran kerja profesional dengan berbagai template
                      </p>
                      <Link href="/surat-lamaran-sederhana/buat">
                        <Button className="gap-2 shadow-md w-full sm:w-auto">
                          <Plus className="h-4 w-4" />
                          Buat Surat Pertama
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSurat.map((surat) => (
                <Card key={surat.id} className="group relative overflow-hidden hover:shadow-lg transition-all">
                  <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                    {/* Thumbnail Preview */}
                    <ThumbnailPreview surat={surat} />

                    {/* Info */}
                    <div className="space-y-2 sm:space-y-3">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base line-clamp-1">
                          {surat.nama_perusahaan}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                          {surat.posisi_lowongan}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <Badge variant={surat.status === 'final' ? 'default' : 'outline'} className="text-[10px] sm:text-xs">
                          {surat.status === 'final' ? '✓ Final' : '📝 Draft'}
                        </Badge>
                        {surat.jenis_instansi && (
                          <Badge variant="outline" className="text-[10px] sm:text-xs">
                            {surat.jenis_instansi}
                          </Badge>
                        )}
                      </div>

                      <div className="text-[10px] sm:text-xs text-muted-foreground">
                        📅 {new Date(surat.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 sm:pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 text-xs sm:text-sm"
                        asChild
                      >
                        <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`}>
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                          <span>Lihat</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(surat.id)}
                        className="w-full h-9 text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        <span>Hapus</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="mt-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">20+ Template Professional</strong> - Siap pakai untuk berbagai posisi dan industri
          </p>
        </div>
      </div>
      </div>
    </AppShell>
  )
}
