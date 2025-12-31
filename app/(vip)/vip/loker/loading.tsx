'use client'

import { Card, CardContent } from '@/components/ui/card'

// Loker List Loading Skeleton
export default function LokerListLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Search/Filter Bar Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex gap-2">
                    <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>

            {/* Results Count Skeleton */}
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />

            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
                        <CardContent className="p-4 space-y-3">
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
