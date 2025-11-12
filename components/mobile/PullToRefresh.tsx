'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  disabled?: boolean
  className?: string
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
  className = '',
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const y = useMotionValue(0)

  // Transform pull distance to rotation for spinner
  const rotate = useTransform(y, [0, threshold], [0, 180])
  const opacity = useTransform(y, [0, threshold], [0, 1])
  const scale = useTransform(y, [0, threshold], [0.5, 1])

  const handleDragEnd = useCallback(
    async (_: any, info: PanInfo) => {
      // Only trigger if pulled down past threshold
      if (info.offset.y >= threshold && !isRefreshing && !disabled) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          y.set(0)
        }
      } else {
        // Snap back if not enough
        y.set(0)
      }
    },
    [threshold, isRefreshing, disabled, onRefresh, y]
  )

  const handleDrag = useCallback(
    (_: any, info: PanInfo) => {
      const container = containerRef.current
      if (!container || disabled || isRefreshing) return

      // Only allow pull down at top of scroll
      const isAtTop = container.scrollTop === 0

      if (isAtTop && info.offset.y > 0) {
        // Apply resistance effect (diminishing returns)
        const resistance = 0.5
        const offset = Math.min(info.offset.y * resistance, threshold * 1.5)
        y.set(offset)
      }
    },
    [disabled, isRefreshing, threshold, y]
  )

  return (
    <div
      ref={containerRef}
      className={`relative overflow-y-auto ${className}`}
      style={{ touchAction: disabled || isRefreshing ? 'auto' : 'pan-y' }}
    >
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-50 pointer-events-none"
        style={{
          y: useTransform(y, (latest) => Math.max(0, latest - 60)),
          opacity,
        }}
      >
        <motion.div
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
          style={{ scale }}
        >
          {isRefreshing ? (
            <>
              <Loader2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Memuat...
              </span>
            </>
          ) : (
            <>
              <motion.div style={{ rotate }}>
                <RefreshCw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tarik untuk refresh
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Content with drag gesture */}
      <motion.div
        drag={!disabled && !isRefreshing ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Hook version for easier use
export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options: { threshold?: number; disabled?: boolean } = {}
) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || options.disabled) return

    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing, options.disabled, onRefresh])

  return {
    isRefreshing,
    refresh: handleRefresh,
  }
}
