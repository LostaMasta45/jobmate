'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Eye, 
  Activity, 
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface UserSession {
  id: string
  user_id?: string
  email?: string
  full_name?: string
  membership?: string
  current_page: string
  device_type: string
  browser: string
  os: string
  is_active: boolean
  last_activity_at: string
  session_started_at: string
}

interface RealtimeStats {
  activeUsers: number
  totalPageViews: number
  totalEvents: number
  avgSessionDuration: number
}

type FilterMode = 'all' | 'users_only' | 'admin_only'

export function RealtimeUserMonitor() {
  const [sessions, setSessions] = useState<UserSession[]>([])
  const [allSessions, setAllSessions] = useState<UserSession[]>([]) // Store all sessions
  const [filterMode, setFilterMode] = useState<FilterMode>('users_only') // Default: users only
  const [stats, setStats] = useState<RealtimeStats>({
    activeUsers: 0,
    totalPageViews: 0,
    totalEvents: 0,
    avgSessionDuration: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // Helper function to check if a page is admin route
  const isAdminRoute = (page: string) => {
    return page.startsWith('/admin')
  }

  // Helper function to filter sessions based on mode
  const filterSessions = (sessions: UserSession[], mode: FilterMode) => {
    if (mode === 'all') return sessions
    if (mode === 'admin_only') return sessions.filter(s => isAdminRoute(s.current_page))
    if (mode === 'users_only') return sessions.filter(s => !isAdminRoute(s.current_page))
    return sessions
  }

  // Update filtered sessions when mode changes
  useEffect(() => {
    const filtered = filterSessions(allSessions, filterMode)
    setSessions(filtered)
    setStats(prev => ({ ...prev, activeUsers: filtered.length }))
  }, [filterMode, allSessions])

  // Fetch initial data
  useEffect(() => {
    fetchActiveSessions()
    fetchStats()
  }, [])

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('realtime-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_sessions',
        },
        (payload) => {
          console.log('[Realtime] Session change:', payload)
          
          if (payload.eventType === 'INSERT') {
            const newSession = payload.new as UserSession
            setAllSessions((prev) => [newSession, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            const updatedSession = payload.new as UserSession
            setAllSessions((prev) =>
              prev.map((s) =>
                s.id === updatedSession.id ? updatedSession : s
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setAllSessions((prev) => prev.filter((s) => s.id !== payload.old.id))
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views',
        },
        () => {
          setStats((prev) => ({ ...prev, totalPageViews: prev.totalPageViews + 1 }))
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_events',
        },
        () => {
          setStats((prev) => ({ ...prev, totalEvents: prev.totalEvents + 1 }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const fetchActiveSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('[Realtime Monitor] Error fetching sessions:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        
        // Check if table doesn't exist
        if (error.code === '42P01') {
          const errorMsg = 'Database belum di-setup. Jalankan setup-realtime-monitoring.sql terlebih dahulu.'
          setError(errorMsg)
          console.warn('[Realtime Monitor] Table user_sessions does not exist. Please run setup-realtime-monitoring.sql')
        } else {
          setError(`Database error: ${error.message}`)
        }
        
        // Set empty data on error
        setSessions([])
        setStats((prev) => ({ ...prev, activeUsers: 0 }))
        return
      }
      
      // Clear error on success
      setError(null)

      // Store all sessions
      setAllSessions(data || [])
      
      // Apply initial filter
      const filtered = filterSessions(data || [], filterMode)
      setSessions(filtered)
      setStats((prev) => ({ ...prev, activeUsers: filtered.length }))
      
      console.log('[Realtime Monitor] Sessions loaded:', data?.length || 0, 'Filtered:', filtered.length)
    } catch (error) {
      console.error('[Realtime Monitor] Exception fetching sessions:', error)
      // Fallback to empty state
      setSessions([])
      setStats((prev) => ({ ...prev, activeUsers: 0 }))
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get today's stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count: pageViewCount, error: pvError } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      if (pvError) {
        console.error('[Realtime Monitor] Error fetching page views:', {
          message: pvError.message,
          code: pvError.code,
        })
      }

      const { count: eventCount, error: evError } = await supabase
        .from('user_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      if (evError) {
        console.error('[Realtime Monitor] Error fetching events:', {
          message: evError.message,
          code: evError.code,
        })
      }

      setStats((prev) => ({
        ...prev,
        totalPageViews: pageViewCount || 0,
        totalEvents: eventCount || 0,
      }))
      
      console.log('[Realtime Monitor] Stats loaded:', {
        pageViews: pageViewCount || 0,
        events: eventCount || 0,
      })
    } catch (error) {
      console.error('[Realtime Monitor] Exception fetching stats:', error)
      // Fallback to 0
      setStats((prev) => ({
        ...prev,
        totalPageViews: 0,
        totalEvents: 0,
      }))
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getMembershipColor = (membership?: string) => {
    switch (membership) {
      case 'vip_premium':
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
      case 'vip_basic':
      case 'basic':
        return 'bg-blue-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Activity className="h-5 w-5" />
              Monitoring System Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs font-mono mb-2">Setup Instructions:</p>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>Buka Supabase SQL Editor</li>
                  <li>Jalankan file: <code className="bg-background px-1 py-0.5 rounded">db/setup-realtime-monitoring.sql</code></li>
                  <li>Refresh halaman ini</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterMode('users_only')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterMode === 'users_only'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Users className="inline h-4 w-4 mr-2" />
          User Area Only
        </button>
        <button
          onClick={() => setFilterMode('admin_only')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterMode === 'admin_only'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Activity className="inline h-4 w-4 mr-2" />
          Admin Area Only
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterMode === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          <Globe className="inline h-4 w-4 mr-2" />
          All Users
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span>Total: {allSessions.length}</span>
          <span>|</span>
          <span>Filtered: {sessions.length}</span>
        </div>
      </div>

      {/* Real-time Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Online sekarang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Events</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.avgSessionDuration)}m</div>
            <p className="text-xs text-muted-foreground">Duration rata-rata</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600 animate-pulse" />
            {filterMode === 'users_only' && 'Active Users - User Area'}
            {filterMode === 'admin_only' && 'Active Users - Admin Area'}
            {filterMode === 'all' && 'Active Users - All Areas'}
            <span className="text-muted-foreground font-normal">({sessions.length})</span>
            <Badge variant="secondary" className="ml-auto">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
              {filterMode === 'users_only' && <p>Tidak ada user online di area user saat ini</p>}
              {filterMode === 'admin_only' && <p>Tidak ada admin online saat ini</p>}
              {filterMode === 'all' && <p>Tidak ada user online saat ini</p>}
              <p className="text-xs mt-2">
                {allSessions.length > 0 && `(Total ${allSessions.length} session tersedia di filter lain)`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors ${
                    isAdminRoute(session.current_page) ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-green-500'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex flex-col items-center gap-1">
                      {getDeviceIcon(session.device_type)}
                      <span className="text-xs text-muted-foreground">
                        {session.device_type}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {session.full_name || session.email || 'Anonymous'}
                        </span>
                        
                        {/* Area Badge */}
                        {isAdminRoute(session.current_page) ? (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500">
                            ADMIN AREA
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
                            USER AREA
                          </Badge>
                        )}
                        
                        {/* Membership Badge */}
                        {session.membership && (
                          <Badge className={getMembershipColor(session.membership)}>
                            {session.membership.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.current_page}
                        </span>
                        <span className="flex items-center gap-1">
                          <Monitor className="h-3 w-3" />
                          {session.browser}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(session.last_activity_at), {
                          addSuffix: true,
                          locale: idLocale,
                        })}
                      </div>
                      <div className="text-xs text-green-600 font-medium mt-1">
                        ● Active
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
