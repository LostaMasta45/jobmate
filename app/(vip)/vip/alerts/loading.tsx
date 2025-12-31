'use client'

import { Card, CardContent } from '@/components/ui/card'

// Alerts Page Loading Skeleton
export default function AlertsLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-36" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
            </div>

            {/* Alert Settings Card */}
            <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                        </div>
                        <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Alert History */}
            <div className="space-y-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
