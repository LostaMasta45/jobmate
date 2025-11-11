/**
 * Real-time Activity Tracker
 * Tracks user sessions, page views, and events
 */

import { createClient } from '@/lib/supabase/client'
import { UAParser } from 'ua-parser-js'

interface SessionData {
  user_id?: string
  session_id: string
  email?: string
  full_name?: string
  membership?: string
  current_page: string
  user_agent: string
  device_type: string
  browser: string
  os: string
  ip_address?: string
}

class ActivityTracker {
  private sessionId: string
  private heartbeatInterval: NodeJS.Timeout | null = null
  private supabase = createClient()

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') return null

    const parser = new UAParser(navigator.userAgent)
    const result = parser.getResult()

    return {
      user_agent: navigator.userAgent,
      device_type: result.device.type || 'desktop',
      browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
      os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    }
  }

  /**
   * Start tracking user session
   */
  async startSession(user?: { id: string; email?: string; full_name?: string; membership?: string }) {
    if (typeof window === 'undefined') return

    const deviceInfo = this.getDeviceInfo()
    if (!deviceInfo) return

    const sessionData: SessionData = {
      session_id: this.sessionId,
      current_page: window.location.pathname,
      ...deviceInfo,
    }

    if (user) {
      sessionData.user_id = user.id
      sessionData.email = user.email
      sessionData.full_name = user.full_name
      sessionData.membership = user.membership
    }

    try {
      // Insert or update session
      const { data, error } = await this.supabase
        .from('user_sessions')
        .upsert(
          {
            ...sessionData,
            is_active: true,
            last_activity_at: new Date().toISOString(),
          },
          {
            onConflict: 'session_id',
          }
        )
        .select()

      if (error) {
        // Only show errors in development mode
        if (process.env.NODE_ENV === 'development') {
          const hasProperties = error && typeof error === 'object' && Object.keys(error).length > 0
          
          if (hasProperties) {
            const errorInfo: Record<string, any> = {}
            if ('message' in error) errorInfo.message = error.message
            if ('details' in error) errorInfo.details = error.details
            if ('hint' in error) errorInfo.hint = error.hint
            if ('code' in error) errorInfo.code = error.code
            
            console.debug('[Activity Tracker] Session tracking failed:', errorInfo)
          } else {
            console.debug('[Activity Tracker] Session tracking unavailable')
          }
          
          // Provide helpful guidance based on error type
          const errorCode = typeof error === 'object' && error !== null && 'code' in error ? error.code : null
          const errorMessage = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : ''
          
          if (errorCode === '42501' || errorMessage.includes('policy')) {
            console.debug('ℹ️  Run db/fix-user-session-tracking-complete.sql')
          } else if (errorCode === '42P01' || errorMessage.includes('does not exist')) {
            console.debug('ℹ️  Run db/setup-realtime-monitoring.sql')
          }
        }
        
        // Silently fail - don't break the app
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Activity Tracker] Session started:', {
          sessionId: this.sessionId,
          userId: user?.id,
          page: window.location.pathname,
        })
      }

      // Start heartbeat to keep session alive
      this.startHeartbeat()
    } catch (error) {
      // Gracefully handle any unexpected errors - only log in development
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Exception starting session:', error)
      }
      // Don't throw - we don't want to break the app if monitoring fails
    }
  }

  /**
   * Update current page
   */
  async updatePage(path: string, title?: string) {
    if (typeof window === 'undefined') return

    try {
      // Update session current page
      const { error } = await this.supabase
        .from('user_sessions')
        .update({
          current_page: path,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', this.sessionId)

      if (error) {
        // Silently log errors without breaking
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Activity Tracker] Could not update page:', error)
        }
        return
      }

      // Log page view
      await this.trackPageView(path, title)

      if (process.env.NODE_ENV === 'development') {
        console.log('[Activity Tracker] Page updated:', path)
      }
    } catch (error) {
      // Gracefully fail
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Error updating page:', error)
      }
    }
  }

  /**
   * Track page view
   */
  async trackPageView(path: string, title?: string) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      const { error } = await this.supabase.from('page_views').insert({
        user_id: user?.id,
        session_id: this.sessionId,
        page_path: path,
        page_title: title || document.title,
        referrer: document.referrer || null,
      })

      if (error && process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Could not track page view:', error)
      }
    } catch (error) {
      // Gracefully fail
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Error tracking page view:', error)
      }
    }
  }

  /**
   * Track custom event
   */
  async trackEvent(eventType: string, eventData?: Record<string, any>) {
    if (typeof window === 'undefined') return

    try {
      const { data: { user } } = await this.supabase.auth.getUser()

      const { error } = await this.supabase.from('user_events').insert({
        user_id: user?.id,
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData || null,
        page_path: window.location.pathname,
      })

      if (error && process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Could not track event:', error)
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Activity Tracker] Event tracked:', eventType)
      }
    } catch (error) {
      // Gracefully fail
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Error tracking event:', error)
      }
    }
  }

  /**
   * Send heartbeat to keep session alive
   */
  private startHeartbeat() {
    // Clear existing interval
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(async () => {
      try {
        const { error } = await this.supabase
          .from('user_sessions')
          .update({
            last_activity_at: new Date().toISOString(),
          })
          .eq('session_id', this.sessionId)

        if (error && process.env.NODE_ENV === 'development') {
          console.debug('[Activity Tracker] Heartbeat error:', error)
        }
      } catch (error) {
        // Silently fail - heartbeat is not critical
      }
    }, 30000) // 30 seconds
  }

  /**
   * End session
   */
  async endSession() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    try {
      const { error } = await this.supabase
        .from('user_sessions')
        .update({
          is_active: false,
          session_ended_at: new Date().toISOString(),
        })
        .eq('session_id', this.sessionId)

      if (error && process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Could not end session:', error)
        return
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[Activity Tracker] Session ended:', this.sessionId)
      }
    } catch (error) {
      // Gracefully fail
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Activity Tracker] Error ending session:', error)
      }
    }
  }
}

// Singleton instance
let tracker: ActivityTracker | null = null

export function getActivityTracker(): ActivityTracker {
  if (!tracker) {
    tracker = new ActivityTracker()
  }
  return tracker
}

// Helper functions for easy usage
export async function startTracking(user?: { id: string; email?: string; full_name?: string; membership?: string }) {
  const tracker = getActivityTracker()
  await tracker.startSession(user)
}

export async function trackPageChange(path: string, title?: string) {
  const tracker = getActivityTracker()
  await tracker.updatePage(path, title)
}

export async function trackEvent(eventType: string, data?: Record<string, any>) {
  const tracker = getActivityTracker()
  await tracker.trackEvent(eventType, data)
}

export async function stopTracking() {
  const tracker = getActivityTracker()
  await tracker.endSession()
}
