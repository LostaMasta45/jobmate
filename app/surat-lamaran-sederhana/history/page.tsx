"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, Search, FileDown, FileText, Trash2, ArrowLeft, Plus, Eye, Sparkles, Home, ChevronRight } from "lucide-react"
import { getSuratLamaranList, getSuratLamaranStats } from "@/actions/surat-lamaran-sederhana/list"
import { deleteSuratLamaran } from "@/actions/surat-lamaran-sederhana/delete"
import { toast } from "sonner"
import Link from "next/link"

export default function SuratLamaranHistoryPage() {
  const [suratList, setSuratList] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadSuratList()
    loadStats()
  }, [filter])

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">Surat Lamaran Sederhana</span>
      </div>

      {/* Navigation Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History Surat Lamaran</h1>
          <p className="text-sm text-muted-foreground">
            Lihat dan kelola semua surat lamaran yang sudah dibuat
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </Link>
          <Link href="/surat-lamaran-sederhana/buat">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Buat Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.total}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Surat
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.final}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Final
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.draft}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Draft
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari perusahaan, posisi, atau nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
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
            Loading...
          </CardContent>
        </Card>
      ) : filteredSurat.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="max-w-md mx-auto">
              {searchTerm ? (
                <>
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
                  <p className="text-muted-foreground mb-6">
                    Tidak ada surat yang cocok dengan pencarian "{searchTerm}"
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm("")}>
                    Hapus Filter
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative mb-6">
                    <Sparkles className="h-16 w-16 mx-auto text-primary animate-pulse" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Belum ada surat tersimpan</h3>
                  <p className="text-muted-foreground mb-6">
                    Mulai buat surat lamaran kerja profesional dengan berbagai template
                  </p>
                  <Link href="/surat-lamaran-sederhana/buat">
                    <Button className="gap-2">
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
        <div className="space-y-4">
          {filteredSurat.map((surat) => (
            <Card key={surat.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {surat.nama_perusahaan}
                      <span className="text-muted-foreground">→</span>
                      {surat.posisi_lowongan}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant={surat.status === 'final' ? 'default' : 'outline'}>
                        {surat.status === 'final' ? '✓ Final' : '📝 Draft'}
                      </Badge>
                      <Badge variant="secondary">
                        {surat.template_name || 'Template'}
                      </Badge>
                      {surat.jenis_instansi && (
                        <Badge variant="outline" className="text-xs">
                          {surat.jenis_instansi}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(surat.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preview */}
                <div className="bg-muted/30 rounded-lg p-4 border">
                  <p className="text-sm whitespace-pre-wrap line-clamp-6 font-serif">
                    {surat.generated_content}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div>📊 {surat.word_count || 0} kata</div>
                  <div>📝 {surat.char_count || 0} karakter</div>
                  {surat.times_downloaded > 0 && (
                    <div>⬇️ Diunduh {surat.times_downloaded}x</div>
                  )}
                  <div>📧 {surat.email}</div>
                  <div>📱 {surat.no_handphone}</div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                    asChild
                  >
                    <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(surat.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Quick Action Card at Bottom */}
          {filteredSurat.length > 0 && (
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="py-8 text-center">
                <h3 className="font-semibold mb-2">Perlu surat baru?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Buat surat lamaran baru dengan berbagai pilihan template profesional
                </p>
                <Link href="/surat-lamaran-sederhana/buat">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Buat Surat Baru
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
