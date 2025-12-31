'use client'

import { Card, CardContent } from '@/components/ui/card'

// Saved Jobs Loading Skeleton
export default function SavedLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56" />
                </div>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            </div>

            {/* Job Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />
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
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
