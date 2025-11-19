'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedPosterImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  quality?: number
  priority?: boolean
  fill?: boolean
  sizes?: string
  onClick?: () => void
}

/**
 * Optimized Image component for poster thumbnails
 * - Lazy loading by default
 * - Blur placeholder
 * - Optimized quality
 * - Background gradient while loading
 */
export function OptimizedPosterImage({
  src,
  alt,
  width,
  height,
  className = '',
  quality = 65,
  priority = false,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  onClick,
}: OptimizedPosterImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Generate blur data URL based on aspect ratio
  const blurDataURL = fill 
    ? "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="
    : width && height 
    ? `data:image/svg+xml;base64,${btoa(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="${width}" height="${height}" fill="#f5f5f5"/></svg>`)}`
    : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iI2Y1ZjVmNSIvPjwvc3ZnPg=="

  // Error fallback
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 ${className}`}
        style={fill ? undefined : { width, height }}
      >
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gambar tidak tersedia</p>
        </div>
      </div>
    )
  }

  const imageProps = {
    src,
    alt,
    className: `${className} ${isLoading ? 'blur-sm scale-105' : 'blur-0 scale-100'} transition-all duration-500`,
    loading: priority ? undefined : ('lazy' as const),
    quality,
    placeholder: 'blur' as const,
    blurDataURL,
    onLoad: () => setIsLoading(false),
    onError: () => {
      setHasError(true)
      setIsLoading(false)
    },
    onClick,
  }

  if (fill) {
    return <Image {...imageProps} fill sizes={sizes} />
  }

  if (width && height) {
    return <Image {...imageProps} width={width} height={height} />
  }

  // Fallback to fill if no dimensions provided
  return <Image {...imageProps} fill sizes={sizes} />
}
