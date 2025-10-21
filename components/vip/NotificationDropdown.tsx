'use client'

import { useState, useEffect } from 'react'
import { Bell, Briefcase, Building2, X, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

  useEffect(() => {
    loadNotifications()
  }, [])

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

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_job':
        return <Briefcase className="w-4 h-4 text-blue-600" />
      case 'job_alert':
        return <Bell className="w-4 h-4 text-purple-600" />
      default:
        return <Building2 className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative h-9 w-9 sm:h-10 sm:w-10 ${className}`}
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] border-2 border-white dark:border-slate-900"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="font-bold text-base">Notifikasi</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-gray-500">{unreadCount} belum dibaca</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-7"
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              Tandai Dibaca
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Memuat notifikasi...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm font-medium mb-1">Belum ada notifikasi</p>
              <p className="text-xs text-gray-400">Notifikasi lowongan baru akan muncul di sini</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.link || '#'}
                  className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
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
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <Link 
              href="/vip/alerts"
              className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
            >
              Lihat Semua Notifikasi
            </Link>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
