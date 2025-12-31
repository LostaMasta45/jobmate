'use client'

import { Card, CardContent } from '@/components/ui/card'

// Tools Page Loading Skeleton
export default function ToolsLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72" />
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <Card key={i} className="overflow-hidden">
                        <CardContent className="p-4 sm:p-6 text-center">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800" />
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto mb-1" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
