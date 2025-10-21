export function LokerCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        {/* Logo Skeleton */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gray-200 dark:bg-slate-700" />
        
        {/* Badges & Info Skeleton */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-12 bg-gray-200 dark:bg-slate-700 rounded" />
          </div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
        
        {/* Bookmark Skeleton */}
        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-700 rounded-full" />
      </div>
      
      {/* Title Skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
      
      {/* Info Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
      
      {/* Tags Skeleton */}
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-6 w-20 bg-gray-200 dark:bg-slate-700 rounded" />
        <div className="h-6 w-14 bg-gray-200 dark:bg-slate-700 rounded" />
      </div>
    </div>
  )
}
