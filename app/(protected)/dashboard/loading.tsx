'use client'

import { Card, CardContent } from '@/components/ui/card'

// Dashboard Loading Skeleton
export default function DashboardLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Welcome Section */}
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tools Grid */}
            <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
