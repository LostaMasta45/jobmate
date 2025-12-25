"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  History as HistoryIcon,
  Sparkles,
  Target,
  Plus,
  Search,
  Eye,
  Trash2,
  PenTool,
  CheckCircle2,
  FileEdit
} from "lucide-react"
import { getSuratLamaranList, getSuratLamaranStats } from "@/actions/surat-lamaran-sederhana/list"
import { deleteSuratLamaran } from "@/actions/surat-lamaran-sederhana/delete"
import { ThumbnailPreview } from "@/components/surat-lamaran-sederhana/ThumbnailPreview"
import { AppShell } from "@/components/layout/AppShell"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function SuratLamaranSederhanaPage() {
  const [suratList, setSuratList] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadStats()
    loadSuratList()
  }, [filter])

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
      <div className="container mx-auto px-4 py-8 pb-32 max-w-7xl min-h-screen">

        {/* Header Section */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                  Surat Lamaran
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Buat, kelola, dan download surat lamaran kerja profesional Anda dalam hitungan menit.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium border border-emerald-100 dark:border-emerald-800">
                <Sparkles className="h-4 w-4" />
                20+ Template Ready
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">

          {/* Main Action Card (Create New) - Spans 8 cols */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-8 relative group overflow-hidden rounded-3xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20" />
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <PenTool className="h-48 w-48 text-emerald-600 rotate-12 transform translate-x-10 -translate-y-10" />
            </div>

            <div className="relative p-8 h-full flex flex-col justify-between min-h-[280px]">
              <div>
                <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 border-emerald-200 dark:border-emerald-800">
                  ✨ Recommended for You
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 dark:text-slate-100">
                  Buat Surat Lamaran Baru
                </h2>
                <p className="text-muted-foreground text-lg max-w-md">
                  Gunakan AI Generator atau tulis manual dengan panduan template profesional kami.
                </p>
              </div>

              <div className="mt-8 flex gap-4">
                <Link href="/surat-lamaran-sederhana/buat">
                  <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-0">
                    <Plus className="h-5 w-5 mr-2" />
                    Buat Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Column - Spans 4 cols */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Stats Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 bg-white dark:bg-slate-950 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 p-4 opacity-5">
                <FileText className="h-24 w-24" />
              </div>
              <div className="relative z-10">
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Surat</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-bold text-slate-900 dark:text-white">{stats?.total || 0}</h3>
                  <span className="text-xs text-emerald-600 font-medium bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                    All Time
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Stats Card 2 - Split */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 dark:bg-blue-950/20 rounded-3xl p-5 border border-blue-100 dark:border-blue-900 flex flex-col justify-center relative overflow-hidden"
              >
                <div className="absolute -right-2 -bottom-2 text-blue-500/10">
                  <CheckCircle2 className="h-16 w-16" />
                </div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-300 mb-1">Final</p>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-100">{stats?.final || 0}</h3>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-amber-50 dark:bg-amber-950/20 rounded-3xl p-5 border border-amber-100 dark:border-amber-900 flex flex-col justify-center relative overflow-hidden"
              >
                <div className="absolute -right-2 -bottom-2 text-amber-500/10">
                  <FileEdit className="h-16 w-16" />
                </div>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-300 mb-1">Draft</p>
                <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-100">{stats?.draft || 0}</h3>
              </motion.div>
            </div>
          </div>
        </div>

        {/* History Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-bold">Riwayat Surat</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari perusahaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-900"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
            ))}
          </div>
        ) : filteredSurat.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">Tidak ada surat ditemukan</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mb-6">
              {searchTerm ? `Tidak ada hasil untuk "${searchTerm}"` : "Belum ada riwayat surat lamaran yang dibuat."}
            </p>
            {!searchTerm && (
              <Link href="/surat-lamaran-sederhana/buat">
                <Button variant="outline">Buat Pertama Kali</Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSurat.map((surat, index) => (
              <motion.div
                key={surat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="group relative bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/80 rounded-3xl border border-slate-200 dark:border-slate-800 p-2 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-200 dark:hover:border-emerald-900/50 flex flex-col h-full">
                  {/* Card Content */}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                        <FileText className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <Badge variant={surat.status === 'final' ? 'default' : 'secondary'} className={cn(
                        "capitalize",
                        surat.status === 'final' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                      )}>
                        {surat.status}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {surat.nama_perusahaan}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                      {surat.posisi_lowongan}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                      <span className="flex items-center gap-1">
                        <HistoryIcon className="h-3 w-3" />
                        {new Date(surat.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-2 grid grid-cols-2 gap-2 mt-auto">
                    <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`} className="w-full">
                      <Button variant="default" size="sm" className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-emerald-600 shadow-sm border border-slate-200 dark:border-slate-700">
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(surat.id)}
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
