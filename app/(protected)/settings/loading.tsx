'use client'

import { Card, CardContent } from '@/components/ui/card'

// Settings Loading Skeleton
export default function SettingsLoading() {
    return (
        <div className="space-y-6 animate-pulse max-w-3xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
            </div>

            {/* Profile Section */}
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800" />
                        <div className="flex-1 space-y-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            </div>
                        ))}
                    </div>

                    <div className="h-10 bg-gradient-to-r from-indigo-200 to-cyan-200 dark:from-indigo-800 dark:to-cyan-800 rounded w-32" />
                </CardContent>
            </Card>

            {/* Other Settings Card */}
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                            </div>
                            <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
