'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { startTracking, trackPageChange, stopTracking } from '@/lib/monitoring/activity-tracker'

export function ActivityTrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const supabase = createClient()

  // Initialize tracking on mount
  useEffect(() => {
    const initTracking = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, membership')
            .eq('id', user.id)
            .single()

          await startTracking({
            id: user.id,
            email: user.email,
            full_name: profile?.full_name,
            membership: profile?.membership,
          })
        } else {
          // Track anonymous user
          await startTracking()
        }
      } catch (error) {
        // Silently fail - don't break the app if tracking fails
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Activity Tracking Provider] Initialization failed:', error)
        }
      }
    }

    // Initialize tracking on mount with delay to prioritize LCP
    const timer = setTimeout(() => {
      initTracking()
    }, 2000)

    // Cleanup on unmount
    return () => {
      clearTimeout(timer)
      try {
        stopTracking()
      } catch (error) {
        // Silently fail
      }
    }
  }, [])

  // Track page changes
  useEffect(() => {
    if (pathname) {
      try {
        trackPageChange(pathname, document.title)
      } catch (error) {
        // Silently fail
      }
    }
  }, [pathname])

  // Track page visibility (user switch tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      try {
        if (document.visibilityState === 'hidden') {
          stopTracking()
        } else {
          const reinitTracking = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser()
              if (user) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('full_name, membership')
                  .eq('id', user.id)
                  .single()

                await startTracking({
                  id: user.id,
                  email: user.email,
                  full_name: profile?.full_name,
                  membership: profile?.membership,
                })
              }
            } catch (error) {
              // Silently fail
              if (process.env.NODE_ENV === 'development') {
                console.debug('[Activity Tracking Provider] Re-initialization failed:', error)
              }
            }
          }
          reinitTracking()
        }
      } catch (error) {
        // Silently fail
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return <>{children}</>
}
