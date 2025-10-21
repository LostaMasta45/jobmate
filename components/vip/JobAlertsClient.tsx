'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Bell, Edit2, Trash2, BellOff } from 'lucide-react'
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

interface JobAlertsClientProps {
  initialAlerts: JobAlert[]
  userId: string
}

export function JobAlertsClient({ initialAlerts, userId }: JobAlertsClientProps) {
  const router = useRouter()
  const [alerts, setAlerts] = useState(initialAlerts)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlert, setEditingAlert] = useState<JobAlert | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [namaAlert, setNamaAlert] = useState('')
  const [selectedKategori, setSelectedKategori] = useState<string[]>([])
  const [selectedLokasi, setSelectedLokasi] = useState<string[]>([])
  const [selectedTipe, setSelectedTipe] = useState<string[]>([])
  const [gajiMin, setGajiMin] = useState('')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifBrowser, setNotifBrowser] = useState(true)

  const handleCreate = () => {
    setEditingAlert(null)
    setNamaAlert('')
    setSelectedKategori([])
    setSelectedLokasi([])
    setSelectedTipe([])
    setGajiMin('')
    setNotifEmail(true)
    setNotifBrowser(true)
    setIsDialogOpen(true)
  }

  const handleEdit = (alert: JobAlert) => {
    setEditingAlert(alert)
    setNamaAlert(alert.nama_alert)
    setSelectedKategori(alert.kategori || [])
    setSelectedLokasi(alert.lokasi || [])
    setSelectedTipe(alert.tipe_pekerjaan || [])
    setGajiMin(alert.gaji_min?.toString() || '')
    setNotifEmail(alert.notif_email)
    setNotifBrowser(alert.notif_browser)
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!namaAlert.trim()) {
      alert('Nama alert wajib diisi')
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
        notif_email: notifEmail,
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
      } else {
        alert('Gagal menyimpan job alert')
      }
    } catch (error) {
      console.error('Error saving alert:', error)
      alert('Terjadi kesalahan')
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
      }
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }

  const handleDelete = async (alertId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus job alert ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/vip/alerts/${alertId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Gagal menghapus job alert')
      }
    } catch (error) {
      console.error('Error deleting alert:', error)
      alert('Terjadi kesalahan')
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
      {/* Create Button */}
      <div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Buat Job Alert Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAlert ? 'Edit Job Alert' : 'Buat Job Alert Baru'}
              </DialogTitle>
              <DialogDescription>
                Atur kriteria loker yang Anda inginkan dan dapatkan notifikasi saat ada loker baru
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Nama Alert */}
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Alert *</Label>
                <Input
                  id="nama"
                  placeholder="Contoh: Frontend Developer Jombang"
                  value={namaAlert}
                  onChange={(e) => setNamaAlert(e.target.value)}
                />
              </div>

              {/* Kategori */}
              <div className="space-y-2">
                <Label>Kategori ({selectedKategori.length} dipilih)</Label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
                  {KATEGORI_LOKER.map((kategori) => (
                    <Badge
                      key={kategori}
                      variant={selectedKategori.includes(kategori) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleKategori(kategori)}
                    >
                      {kategori}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-2">
                <Label>Lokasi ({selectedLokasi.length} dipilih)</Label>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
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

              {/* Tipe Kerja */}
              <div className="space-y-2">
                <Label>Tipe Pekerjaan ({selectedTipe.length} dipilih)</Label>
                <div className="flex flex-wrap gap-2">
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

              {/* Gaji Minimum */}
              <div className="space-y-2">
                <Label htmlFor="gaji">Gaji Minimum (Opsional)</Label>
                <Input
                  id="gaji"
                  type="number"
                  placeholder="Contoh: 3000000"
                  value={gajiMin}
                  onChange={(e) => setGajiMin(e.target.value)}
                />
              </div>

              {/* Notifikasi */}
              <div className="space-y-3">
                <Label>Metode Notifikasi</Label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Notifikasi Email</span>
                  </div>
                  <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Notifikasi Browser</span>
                  </div>
                  <Switch checked={notifBrowser} onCheckedChange={setNotifBrowser} />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Menyimpan...' : editingAlert ? 'Update' : 'Buat Alert'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts List */}
      {alerts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      alert.is_active ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {alert.is_active ? (
                      <Bell className="w-6 h-6 text-blue-600" />
                    ) : (
                      <BellOff className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {alert.nama_alert}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {alert.kategori && alert.kategori.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {alert.kategori.map((k) => (
                            <Badge
                              key={k}
                              variant="outline"
                              className="text-xs border-blue-200 text-blue-700 bg-blue-50"
                            >
                              {k}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {alert.lokasi && alert.lokasi.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {alert.lokasi.map((l) => (
                            <Badge key={l} variant="outline" className="text-xs">
                              {l}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {alert.tipe_pekerjaan && alert.tipe_pekerjaan.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {alert.tipe_pekerjaan.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {alert.gaji_min && (
                        <span>Gaji min: Rp {alert.gaji_min.toLocaleString('id-ID')}</span>
                      )}
                      {alert.notif_email && <span>📧 Email</span>}
                      {alert.notif_browser && <span>🔔 Browser</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.is_active}
                    onCheckedChange={() => handleToggleActive(alert)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(alert)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(alert.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 text-xs text-gray-500">
                {alert.is_active
                  ? 'Alert aktif - Anda akan mendapatkan notifikasi'
                  : 'Alert nonaktif - Tidak akan mengirim notifikasi'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Job Alert
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Buat job alert untuk mendapatkan notifikasi otomatis ketika ada lowongan kerja yang
            sesuai dengan kriteria Anda
          </p>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Buat Job Alert Pertama
          </Button>
        </div>
      )}
    </div>
  )
}

