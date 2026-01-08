'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Smartphone, Bell, Check, Zap } from 'lucide-react'
import { useCanInstallPWA } from '@/hooks/usePWAMode'
import {
    isPushSupported,
    requestNotificationPermission,
    subscribeToPush,
    isSubscribedToPush
} from '@/lib/push-notifications'
import type { Loker } from '@/types/vip'

interface JobAlertActionCardProps {
    loker: Loker
}

export function JobAlertActionCard({ loker }: JobAlertActionCardProps) {
    const { canInstall, promptInstall } = useCanInstallPWA()
    const [isPushEnabled, setIsPushEnabled] = useState(false)
    const [pushSupported, setPushSupported] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkPush = async () => {
            const supported = isPushSupported()
            setPushSupported(supported)
            if (supported) {
                const subscribed = await isSubscribedToPush()
                setIsPushEnabled(subscribed)
            }
        }
        checkPush()
    }, [])

    const handleInstallPWA = async () => {
        await promptInstall()
    }

    const handleEnableNotification = async () => {
        setIsLoading(true)
        try {
            const perm = await requestNotificationPermission()
            if (perm === 'granted') {
                await subscribeToPush()
                setIsPushEnabled(true)
            }
        } catch (error) {
            console.error('Failed to enable notifications', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Default WhatsApp Action (Fallback)
    const defaultAction = (
        <>
            <div className="relative z-10">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 sm:mb-6 text-2xl shadow-inner backdrop-blur-sm">
                    <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 fill-yellow-300" />
                </div>
                <h4 className="font-bold text-lg sm:text-2xl leading-tight mb-2">Job Alert</h4>
                <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                    Dapatkan info loker <span className="font-bold text-white bg-white/20 px-1 rounded">{loker.kategori?.[0] || 'terbaru'}</span> via WhatsApp.
                </p>
            </div>
            <Button asChild className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold border-0 relative z-10 h-10 rounded-xl shadow-xl">
                <a href="https://wa.me/6281234567890?text=Halo%20Admin%20JobMate,%20saya%20mau%20aktifkan%20Job%20Alert" target="_blank">Aktifkan</a>
            </Button>
        </>
    )

    // Render Logic

    // 1. If PWA Installable -> Show Install Prompt
    if (canInstall) {
        return (
            <div className="h-auto min-h-[280px] bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 border border-indigo-500/30 p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 sm:mb-6 shadow-inner backdrop-blur-sm">
                        <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg sm:text-2xl leading-tight mb-2">Install App</h4>
                    <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                        Pasang aplikasi JobMate untuk akses lebih cepat dan hemat kuota.
                    </p>
                </div>
                <Button
                    onClick={handleInstallPWA}
                    className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold border-0 relative z-10 h-10 rounded-xl shadow-xl"
                >
                    Install Sekarang
                </Button>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            </div>
        )
    }

    // 2. If Push Supported & Not Enabled -> Show Enable Notification
    if (pushSupported && !isPushEnabled) {
        return (
            <div className="h-auto min-h-[280px] bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 border border-indigo-500/30 p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4 sm:mb-6 shadow-inner backdrop-blur-sm">
                        <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg sm:text-2xl leading-tight mb-2">Notifikasi</h4>
                    <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                        Jangan ketinggalan info loker <span className="font-bold text-white bg-white/20 px-1 rounded">{loker.kategori?.[0] || 'terbaru'}</span>. Aktifkan notifikasi sekarang!
                    </p>
                </div>
                <Button
                    onClick={handleEnableNotification}
                    disabled={isLoading}
                    className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold border-0 relative z-10 h-10 rounded-xl shadow-xl"
                >
                    {isLoading ? 'Memproses...' : 'Aktifkan Notifikasi'}
                </Button>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            </div>
        )
    }

    // 3. If Installed & Push Enabled (or fallback) -> Show default "Job Alert WA" or "You are all set"
    // Since the original was WA alert, we keep it as fallback or if everything else is set.
    return (
        <div className="h-auto min-h-[280px] bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-900 dark:to-purple-900 border border-indigo-500/30 p-6 sm:p-8 rounded-[2rem] flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl">
            {isPushEnabled ? (
                <>
                    <div className="relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-green-500/20 flex items-center justify-center mb-4 sm:mb-6 text-2xl shadow-inner backdrop-blur-sm border border-green-500/30">
                            <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-300" />
                        </div>
                        <h4 className="font-bold text-lg sm:text-2xl leading-tight mb-2">Job Alert Aktif</h4>
                        <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed mb-4">
                            Anda akan menerima notifikasi loker terbaru langsung di perangkat ini.
                        </p>
                    </div>
                    <Button disabled className="w-full bg-green-500/20 text-green-100 border-0 relative z-10 h-10 rounded-xl font-semibold">
                        Sudah Aktif
                    </Button>
                </>
            ) : defaultAction}

            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        </div>
    )
}
