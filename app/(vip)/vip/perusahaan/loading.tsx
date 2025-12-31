'use client'

import { Card, CardContent } from '@/components/ui/card'

// Perusahaan/Company List Loading Skeleton
export default function PerusahaanLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Header */}
            <div className="space-y-2">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64" />
            </div>

            {/* Search Bar */}
            <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-xl" />

            {/* Company Grid - 2 columns on mobile, 3-4 on larger screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-3 lg:p-5 text-center">
                            {/* Company Logo */}
                            <div className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-200 dark:from-indigo-800 dark:to-purple-800" />

                            {/* Company Name */}
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2" />

                            {/* Location */}
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-2" />

                            {/* Job Count Badge */}
                            <div className="h-6 bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 rounded-full w-20 mx-auto" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
