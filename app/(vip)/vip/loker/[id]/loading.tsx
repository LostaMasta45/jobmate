'use client'

import { Card, CardContent } from '@/components/ui/card'

// Job Detail Loading Skeleton
export default function LokerDetailLoading() {
    return (
        <div className="space-y-4 sm:space-y-6 animate-pulse">
            {/* Back Button */}
            <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24" />

            {/* Hero Card */}
            <Card className="overflow-hidden">
                {/* Poster Image */}
                <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />

                <CardContent className="p-4 sm:p-6 space-y-4">
                    {/* Company & Title */}
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-6 sm:h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>

                    {/* Meta Badges */}
                    <div className="flex flex-wrap gap-2">
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                        <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-28" />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <div className="h-10 bg-gradient-to-r from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800 rounded-lg flex-1" />
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                </CardContent>
            </Card>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-1" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Description Card */}
            <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
