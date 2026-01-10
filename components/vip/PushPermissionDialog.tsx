'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Bell, ShieldCheck, Zap } from 'lucide-react'

interface PushPermissionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onPermissionGranted: () => void
}

export function PushPermissionDialog({
    open,
    onOpenChange,
    onPermissionGranted,
}: PushPermissionDialogProps) {
    const [loading, setLoading] = useState(false)

    const handleRequestPermission = async () => {
        setLoading(true)
        try {
            const permission = await Notification.requestPermission()
            if (permission === 'granted') {
                onPermissionGranted()
                onOpenChange(false)
            } else {
                // Handle denial? Maybe show a toast or instructions
                alert('Izin notifikasi ditolak. Anda perlu mengaktifkannya di pengaturan browser untuk mendapatkan alert realtime.')
            }
        } catch (error) {
            console.error('Error requesting permission:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
                        <Bell className="w-8 h-8 animate-pulse" />
                    </div>
                    <DialogTitle className="text-center text-xl">Aktifkan "Smart Scout" Alert?</DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        Jangan lewatkan kesempatan! Izinkan browser untuk memberi tahu Anda <b>secara instan</b> ketika ada lowongan yang cocok ditemukan.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Notifikasi Real-time</h4>
                            <p className="text-xs text-gray-500">Jadilah pelamar pertama dalam hitungan detik setelah loker tayang.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Privasi Terjaga</h4>
                            <p className="text-xs text-gray-500">Anda bisa matikan kapan saja. Tidak ada spam, hanya info karir.</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        Nanti Saja
                    </Button>
                    <Button onClick={handleRequestPermission} disabled={loading} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                        <Bell className="w-4 h-4" />
                        Izinkan Notifikasi
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
