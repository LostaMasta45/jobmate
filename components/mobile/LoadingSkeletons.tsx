'use client'

import { Card, CardContent } from '@/components/ui/card'

/**
 * Skeleton for JobCardMobile component
 */
export function JobCardMobileSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      {/* Poster Image Skeleton */}
      <div className="relative w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700" />

      <CardContent className="p-4 space-y-3">
        {/* Company & Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>

        {/* Location & Salary */}
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton for Company Card (2-column mobile grid)
 */
export function CompanyCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-3 lg:p-6">
        {/* Logo & Name */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 lg:gap-4 mb-3 lg:mb-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg lg:rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 w-full space-y-2 text-center lg:text-left">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto lg:mx-0" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto lg:mx-0" />
          </div>
        </div>

        {/* Description - Hidden on mobile */}
        <div className="hidden lg:block space-y-2 mb-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
        </div>

        {/* Info */}
        <div className="space-y-1.5 lg:space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto lg:mx-0" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto lg:mx-0" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton for Dashboard Stats Card
 */
export function StatsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-3 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton for Job Detail Page
 */
export function JobDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button */}
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32" />

      {/* Hero Card */}
      <Card>
        <CardContent className="p-6 lg:p-8 space-y-6">
          {/* Logo & Title */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Key Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Description */}
      <Card>
        <CardContent className="p-6 lg:p-8 space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Skeleton List - For multiple skeletons
 */
export function SkeletonList({
  count = 3,
  type = 'job',
}: {
  count?: number
  type?: 'job' | 'company' | 'stats'
}) {
  const SkeletonComponent =
    type === 'job'
      ? JobCardMobileSkeleton
      : type === 'company'
      ? CompanyCardSkeleton
      : StatsCardSkeleton

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  )
}
