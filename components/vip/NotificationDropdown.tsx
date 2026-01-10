'use client'

import { useState, useEffect } from 'react'
import { Bell, Briefcase, Building2, CheckCheck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

interface Notification {
  id: string
  type: 'new_job' | 'job_alert' | 'system'
  title: string
  message: string
  link?: string
  read: boolean
  created_at: string
}

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    loadNotifications()
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }

  const loadNotifications = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Fetch recent job alerts as notifications
      const { data: alerts } = await supabase
        .from('vip_job_alerts')
        .select('id, keywords, lokasi, created_at')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent loker (new jobs)
      const { data: recentJobs } = await supabase
        .from('vip_loker')
        .select('id, title, perusahaan_name, created_at')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(3)

      // Combine into notifications
      const jobNotifications: Notification[] = (recentJobs || []).map(job => ({
        id: `job-${job.id}`,
        type: 'new_job' as const,
        title: '🆕 Lowongan Baru',
        message: `${job.title} di ${job.perusahaan_name}`,
        link: `/vip/loker/${job.id}`,
        read: false,
        created_at: job.created_at
      }))

      const alertNotifications: Notification[] = (alerts || []).map(alert => ({
        id: `alert-${alert.id}`,
        type: 'job_alert' as const,
        title: '🔔 Job Alert Aktif',
        message: `Mencari: ${alert.keywords || 'Semua posisi'} ${alert.lokasi ? `di ${alert.lokasi}` : ''}`,
        link: '/vip/alerts',
        read: true,
        created_at: alert.created_at
      }))

      const allNotifications = [...jobNotifications, ...alertNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8)

      setNotifications(allNotifications)
      setUnreadCount(jobNotifications.length)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  // Prevent hydration mismatch by mocking the trigger button until mounted
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-8 w-8 sm:h-9 sm:w-9 ${className}`}
        aria-label="Notifications"
      >
        <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Button>
    )
  }

  const TriggerButton = (
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-8 w-8 sm:h-9 sm:w-9 ${className}`}
    >
      <Bell className="w-5 h-5 sm:w-4 sm:h-4" />
      {unreadCount > 0 && (
        <Badge
          className="absolute -top-0.5 -right-0.5 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[9px] sm:text-[10px] border-2 border-white dark:border-slate-900 shadow-sm"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  )

  // MOBILE: Centered Dialog
  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {TriggerButton}
        </DialogTrigger>
        <DialogContent className="w-[90vw] max-w-sm rounded-[1.5rem] p-0 border-0 bg-transparent shadow-none" aria-describedby={undefined}>
          <DialogHeader className="sr-only">
            <DialogTitle>Notifikasi</DialogTitle>
          </DialogHeader>
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-[1.5rem] border border-white/20 shadow-2xl overflow-hidden">
            <NotificationContent
              notifications={notifications}
              loading={loading}
              unreadCount={unreadCount}
              markAllAsRead={markAllAsRead}
              onClose={() => setIsOpen(false)}
              isMobile={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // DESKTOP: Dropdown Menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 rounded-xl shadow-xl border-gray-200 dark:border-gray-800 p-0">
        <NotificationContent
          notifications={notifications}
          loading={loading}
          unreadCount={unreadCount}
          markAllAsRead={markAllAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// SHARED CONTENT COMPONENT
function NotificationContent({
  notifications,
  loading,
  unreadCount,
  markAllAsRead,
  onClose,
  isMobile
}: {
  notifications: Notification[],
  loading: boolean,
  unreadCount: number,
  markAllAsRead: () => void,
  onClose?: () => void,
  isMobile?: boolean
}) {

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_job':
        return <Briefcase className="w-4 h-4 text-white" />
      case 'job_alert':
        return <Bell className="w-4 h-4 text-white" />
      default:
        return <Building2 className="w-4 h-4 text-white" />
    }
  }

  const getIconBg = (type: Notification['type']) => {
    switch (type) {
      case 'new_job': return 'bg-blue-500 shadow-blue-200 dark:shadow-none'
      case 'job_alert': return 'bg-purple-500 shadow-purple-200 dark:shadow-none'
      default: return 'bg-gray-500'
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50">
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Notifikasi</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {unreadCount > 0 ? `${unreadCount} belum dibaca` : 'Tidak ada pesan baru'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8 rounded-full hover:bg-blue-50 text-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              Baca Semua
            </Button>
          )}
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto bg-gray-50/50 dark:bg-black/20">
        {loading ? (
          <div className="p-8 text-center text-gray-500 py-12">
            <Bell className="w-8 h-8 mx-auto mb-3 animate-pulse opacity-50" />
            <p className="text-sm">Memuat notifikasi...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-base font-bold text-gray-900 dark:text-white mb-1">Sudah bersih!</p>
            <p className="text-sm text-gray-400">Tidak ada notifikasi baru saat ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link || '#'}
                onClick={onClose}
                className={`block p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors relative group ${!notification.read ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''
                  }`}
              >
                <div className="flex gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${getIconBg(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className={`font-semibold text-sm leading-tight ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1" />
                      )}
                    </div>
                    <p className={`text-sm line-clamp-2 mb-1.5 ${!notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-500'}`}>
                      {notification.message}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: id
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
          <Link
            href="/vip/alerts"
            onClick={onClose}
            className="flex items-center justify-center w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Lihat Semua Aktivitas
          </Link>
        </div>
      )}
    </>
  )
}
