'use client'

import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Bell, BellOff, Edit2, Trash2, MapPin, Briefcase, DollarSign, Activity, CheckCircle2 } from 'lucide-react'
import type { JobAlert } from '@/types/vip'

interface JobAlertCardGlassProps {
    alert: JobAlert
    onToggleActive: (alert: JobAlert) => void
    onEdit: (alert: JobAlert) => void
    onDelete: (alertId: string) => void
}

export function JobAlertCardGlass({ alert, onToggleActive, onEdit, onDelete }: JobAlertCardGlassProps) {
    const isActive = alert.is_active

    return (
        <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group
            ${isActive
                ? 'bg-white/60 dark:bg-gray-800/60 border-blue-200/50 dark:border-blue-700/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/10'
                : 'bg-gray-50/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 grayscale-[0.5]'
            } backdrop-blur-xl`}
        >
            {/* Active Glow Effect */}
            {isActive && (
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            )}

            <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                            ${isActive
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                            }`}
                        >
                            {isActive ? <Activity className="w-6 h-6 animate-pulse" /> : <BellOff className="w-6 h-6" />}
                        </div>

                        <div className="space-y-1">
                            <h3 className={`font-bold text-lg leading-tight ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                                {alert.nama_alert}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                {isActive ? (
                                    <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        Scout Active
                                    </span>
                                ) : (
                                    <span className="text-gray-400">Dimatikan</span>
                                )}
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span>Updated just now</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={alert.is_active}
                            onCheckedChange={() => onToggleActive(alert)}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>
                </div>

                {/* Criteria Chips */}
                <div className="mt-5 space-y-3">
                    {/* Location & Type */}
                    <div className="flex flex-wrap gap-2">
                        {alert.lokasi && alert.lokasi.map((loc) => (
                            <Badge key={loc} variant="outline" className="bg-white/50 dark:bg-gray-800/50 text-xs gap-1 py-1 px-2 border-gray-200 dark:border-gray-700">
                                <MapPin className="w-3 h-3 text-gray-500" />
                                {loc}
                            </Badge>
                        ))}
                        {alert.tipe_pekerjaan && alert.tipe_pekerjaan.map((type) => (
                            <Badge key={type} variant="outline" className="bg-white/50 dark:bg-gray-800/50 text-xs gap-1 py-1 px-2 border-gray-200 dark:border-gray-700">
                                <Briefcase className="w-3 h-3 text-gray-500" />
                                {type}
                            </Badge>
                        ))}
                        {alert.gaji_min && (
                            <Badge variant="outline" className="bg-white/50 dark:bg-gray-800/50 text-xs gap-1 py-1 px-2 border-gray-200 dark:border-gray-700">
                                <DollarSign className="w-3 h-3 text-gray-500" />
                                Min {alert.gaji_min.toLocaleString('id-ID')}
                            </Badge>
                        )}
                    </div>

                    {/* Categories */}
                    {alert.kategori && alert.kategori.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {alert.kategori.map((cat) => (
                                <span key={cat} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Actions */}
                <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {alert.notif_browser && (
                            <div className="flex items-center gap-1.5" title="Browser Notification Active">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                Push Notif
                            </div>
                        )}
                        {alert.notif_email && (
                            <div className="flex items-center gap-1.5" title="Email Notification Active">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                Email
                            </div>
                        )}
                    </div>

                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(alert)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(alert.id)}
                            className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
