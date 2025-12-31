'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * NavigationPrefetcher - Prefetches all critical routes on mount
 * This ensures instant page transitions throughout the app
 */
export function NavigationPrefetcher() {
    const router = useRouter()

    useEffect(() => {
        // VIP Routes - most commonly accessed
        const vipRoutes = [
            '/vip',
            '/vip/loker',
            '/vip/saved',
            '/vip/perusahaan',
            '/vip/alerts',
            '/vip/history',
            '/vip/profile',
        ]

        // Protected Routes
        const protectedRoutes = [
            '/dashboard',
            '/tools',
            '/settings',
        ]

        // Prefetch all routes
        const allRoutes = [...vipRoutes, ...protectedRoutes]

        // Prefetch with a small delay to not block initial render
        const timeoutId = setTimeout(() => {
            allRoutes.forEach(route => {
                router.prefetch(route)
            })
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [router])

    // This component renders nothing
    return null
}
