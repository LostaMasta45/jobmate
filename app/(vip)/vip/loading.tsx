'use client'

import { Card, CardContent } from '@/components/ui/card'

// VIP Dashboard Loading Skeleton - Shows instantly during page transition
export default function VIPDashboardLoading() {
    return (
        <div className="space-y-4 sm:space-y-6 animate-pulse">
            {/* Welcome Box Skeleton */}
            <div className="w-full">
                <Card className="overflow-hidden">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800" />
                            <div className="flex-1 space-y-2">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Search Skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-3 sm:p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Job Cards Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
