'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Bell, Loader2, Sparkles, Target, Zap, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { KATEGORI_LOKER, LOKASI_JOMBANG, TIPE_KERJA } from '@/types/vip'
import type { JobAlert } from '@/types/vip'
import { JobAlertCardGlass } from './JobAlertCardGlass'
import { PushPermissionDialog } from './PushPermissionDialog'
import { countMatchingJobs } from '@/actions/vip/count-matching-jobs'
import { useToast } from '@/hooks/use-toast'

interface JobAlertsClientProps {
  initialAlerts: JobAlert[]
  userId: string
}

export function JobAlertsClient({ initialAlerts, userId }: JobAlertsClientProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [alerts, setAlerts] = useState(initialAlerts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPermissionDialog, setShowPermissionDialog] = useState(false)

  // Live Match State
  const [matchCount, setMatchCount] = useState<number>(0)
  const [isCounting, setIsCounting] = useState(false)

  // Form state
  const [namaAlert, setNamaAlert] = useState('')
  const [selectedKategori, setSelectedKategori] = useState<string[]>([])
  const [selectedLokasi, setSelectedLokasi] = useState<string[]>([])
  const [selectedTipe, setSelectedTipe] = useState<string[]>([])
  const [gajiMin, setGajiMin] = useState('')
  const [notifBrowser, setNotifBrowser] = useState(false) // Default false until permitted

  // Sync alerts prop
  useEffect(() => {
    setAlerts(initialAlerts)
  }, [initialAlerts])

  // Enhanced debounce for live counting
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsCounting(true)
      try {
        // Basic criteria check
        if (selectedKategori.length > 0 || selectedLokasi.length > 0 || selectedTipe.length > 0 || gajiMin) {
          const count = await countMatchingJobs({
            kategori: selectedKategori,
            lokasi: selectedLokasi,
            tipe_pekerjaan: selectedTipe,
            gaji_min: gajiMin ? parseInt(gajiMin) : null
          })
          setMatchCount(count)
        } else {
          setMatchCount(0)
        }
      } catch (e) {
        console.error("Failed to count matches", e)
      } finally {
        setIsCounting(false)
      }
    }, 800) // 800ms debounce

    return () => clearTimeout(timer)
  }, [selectedKategori, selectedLokasi, selectedTipe, gajiMin])

  const handleCreate = () => {
    setEditingAlert(null)
    setNamaAlert('')
    setSelectedKategori([])
    setSelectedLokasi([])
    setSelectedTipe([])
    setGajiMin('')
    // Check permission status
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      setNotifBrowser(true)
    } else {
      setNotifBrowser(false)
    }
    setIsDialogOpen(true)
  }

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert)
    setNamaAlert(alert.nama_alert)
    setSelectedKategori(alert.kategori || [])
    setSelectedLokasi(alert.lokasi || [])
    setSelectedTipe(alert.tipe_pekerjaan || [])
    setGajiMin(alert.gaji_min?.toString() || '')
    setNotifBrowser(alert.notif_browser)
    setIsDialogOpen(true)
  }

  const handleToggleBrowserNotif = (checked: boolean) => {
    if (checked) {
      if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
        setShowPermissionDialog(true)
        return // Don't toggle switch yet
      }
    }
    setNotifBrowser(checked)
  }

  const handlePermissionGranted = () => {
    setNotifBrowser(true)
    toast({
      title: "Notifikasi Diaktifkan",
      description: "Smart Scout sekarang dapat mengirim alert ke browser Anda.",
    })
  }

  const handleSubmit = async () => {
    if (!namaAlert.trim()) {
      toast({ title: "Nama alert wajib diisi", variant: "destructive" })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        nama_alert: namaAlert,
        kategori: selectedKategori,
        lokasi: selectedLokasi,
        tipe_pekerjaan: selectedTipe,
        gaji_min: gajiMin ? parseInt(gajiMin) : null,
        notif_email: false, // Disabling email to focus on push
        notif_browser: notifBrowser,
      }

      const url = editingAlert
        ? `/api/vip/alerts/${editingAlert.id}`
        : '/api/vip/alerts'

      const response = await fetch(url, {
        method: editingAlert ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        router.refresh()
        toast({
          title: editingAlert ? "Updated" : "Smart Scout Activated",
          description: editingAlert ? "Preferensi alert berhasil diperbarui" : "Scout sekarang aktif mencari loker untuk Anda.",
        })
      } else {
        toast({ title: "Gagal menyimpan", variant: "destructive" })
      }
    } catch (error) {
      console.error('Error saving alert:', error)
      toast({ title: "Terjadi kesalahan", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (alert: JobAlert) => {
    try {
      const response = await fetch(`/api/vip/alerts/${alert.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !alert.is_active }),
      })

      if (response.ok) {
        router.refresh()
        toast({
          title: !alert.is_active ? "Scout Activated" : "Scout Paused",
          description: !alert.is_active ? `Alert "${alert.nama_alert}" aktif kembali.` : `Alert "${alert.nama_alert}" diistirahatkan.`
        })
      }
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }

  const handleDelete = async (alertId: string) => {
    if (!confirm('Hentikan scout ini?')) return

    try {
      const response = await fetch(`/api/vip/alerts/${alertId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
        toast({ title: "Alert dihapus" })
      } else {
        toast({ title: "Gagal menghapus", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", variant: "destructive" })
    }
  }

  const toggleKategori = (kategori: string) => {
    setSelectedKategori((prev) =>
      prev.includes(kategori) ? prev.filter((k) => k !== kategori) : [...prev, kategori]
    )
  }

  const toggleLokasi = (lokasi: string) => {
    setSelectedLokasi((prev) =>
      prev.includes(lokasi) ? prev.filter((l) => l !== lokasi) : [...prev, lokasi]
    )
  }

  const toggleTipe = (tipe: string) => {
    setSelectedTipe((prev) =>
      prev.includes(tipe) ? prev.filter((t) => t !== tipe) : [...prev, tipe]
    )
  }

  return (
    <div className="space-y-6">
      <PushPermissionDialog
        open={showPermissionDialog}
        onOpenChange={setShowPermissionDialog}
        onPermissionGranted={handlePermissionGranted}
      />

      {/* Create Button area / Top Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scouts Aktif</h2>
          <p className="text-sm text-muted-foreground">{alerts.filter(a => a.is_active).length} dari {alerts.length} scout sedang bekerja</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 transition-all hover:scale-105">
              <Plus className="w-4 h-4" />
              Rekrut Scout Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                {editingAlert ? <Edit2 className="w-5 h-5 text-blue-500" /> : <Sparkles className="w-5 h-5 text-blue-500" />}
                {editingAlert ? 'Instruksikan Ulang Scout' : 'Rekrut Smart Scout Baru'}
              </DialogTitle>
              <DialogDescription>
                Tentukan target pencarian. Scout akan bekerja 24/7 dan memberitahu Anda <b>detik itu juga</b> saat target ditemukan.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
              {/* Left Column: Form */}
              <div className="md:col-span-2 space-y-6">
                {/* Nama Alert */}
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Misi (Label Alert) *</Label>
                  <Input
                    id="nama"
                    placeholder="e.g. Mencari Frontend Gaji 5jt+"
                    value={namaAlert}
                    onChange={(e) => setNamaAlert(e.target.value)}
                    className="text-lg font-medium"
                  />
                </div>

                {/* Criteria Groups */}
                <div className="space-y-4">
                  <Label>Target Kategori</Label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                    {KATEGORI_LOKER.map((kategori) => (
                      <Badge
                        key={kategori}
                        variant={selectedKategori.includes(kategori) ? 'default' : 'outline'}
                        className={`cursor-pointer transition-all ${selectedKategori.includes(kategori) ? 'bg-blue-600 hover:bg-blue-700 border-0' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        onClick={() => toggleKategori(kategori)}
                      >
                        {kategori}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Lokasi Target</Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      {LOKASI_JOMBANG.slice(0, 12).map((lokasi) => (
                        <Badge
                          key={lokasi}
                          variant={selectedLokasi.includes(lokasi) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleLokasi(lokasi)}
                        >
                          {lokasi}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipe Pekerjaan</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                      {TIPE_KERJA.map((tipe) => (
                        <Badge
                          key={tipe}
                          variant={selectedTipe.includes(tipe) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleTipe(tipe)}
                        >
                          {tipe}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gaji */}
                <div className="space-y-2">
                  <Label htmlFor="gaji">Ekspektasi Gaji (Min)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                    <Input
                      id="gaji"
                      type="number"
                      className="pl-10"
                      placeholder="3000000"
                      value={gajiMin}
                      onChange={(e) => setGajiMin(e.target.value)}
                    />
                  </div>
                </div>

                {/* Notifikasi */}
                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Label className="text-base">Saluran Laporan</Label>
                  <div className="grid grid-cols-1 gap-4">


                    <div className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${notifBrowser ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-white dark:bg-gray-900'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Browser Push</span>
                          <span className="text-[10px] text-muted-foreground">Instant Notification</span>
                        </div>
                      </div>
                      <Switch checked={notifBrowser} onCheckedChange={handleToggleBrowserNotif} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Preview */}
              <div className="md:col-span-1">
                <div className="sticky top-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4 text-blue-300">
                    <Target className="w-5 h-5" />
                    <h4 className="font-semibold text-sm tracking-wide uppercase">Live Radar</h4>
                  </div>

                  <div className="text-center py-6">
                    {isCounting ? (
                      <Loader2 className="w-10 h-10 mx-auto animate-spin text-blue-400 opacity-80" />
                    ) : (
                      <div className="space-y-1 animate-in zoom-in duration-300">
                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-200">
                          {matchCount}
                        </span>
                        <p className="text-sm font-medium text-blue-200">Loker Cocok Saat Ini</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mt-6">
                    <div className="text-xs text-center text-gray-400 px-2 leading-relaxed">
                      {matchCount > 0
                        ? "Kriteria ini sangat potensial! Scout akan mengirim notifikasi segera setelah ada data baru."
                        : "Belum ada yang cocok saat ini. Scout akan terus memantau 24/7 untuk Anda."}
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold h-12 rounded-xl">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingAlert ? 'Simpan Perubahan' : 'Aktifkan Scout'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 gap-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <JobAlertCardGlass
              key={alert.id}
              alert={alert}
              onToggleActive={handleToggleActive}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          // Empty State Premium
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 p-16 text-center animate-in fade-in transition-all hover:border-blue-400 group cursor-pointer" onClick={handleCreate}>
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-10 h-10 text-blue-500/50 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Belum Ada Scout yang Bekerja
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Anda masih mencari loker secara manual? Biarkan Smart Scout yang bekerja keras mencari peluang untuk Anda, bahkan saat Anda tidur.
            </p>
            <Button size="lg" className="rounded-full px-8 shadow-xl shadow-blue-500/20">
              Rekrut Scout Pertama
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

