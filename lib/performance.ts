/**
 * Performance Utilities for Mobile-First Optimization
 * 
 * This file contains utilities for improving page speed and performance
 */

/**
 * Preconnect to external domains for faster resource loading
 */
export const preconnectDomains = [
  'https://gyamsjmrrntwwcqljene.supabase.co',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
]

/**
 * Defer non-critical CSS loading
 */
export function deferNonCriticalCSS() {
  if (typeof window !== 'undefined') {
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    links.forEach((link) => {
      const href = link.getAttribute('href')
      if (href && !href.includes('critical')) {
        link.setAttribute('media', 'print')
        link.setAttribute('onload', "this.media='all'")
      }
    })
  }
}

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImages() {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        }
      })
    })

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img)
    })
  }
}

/**
 * Prefetch critical routes for faster navigation
 */
export const criticalRoutes = [
  '/vip/loker',
  '/vip/dashboard',
  '/tools',
]

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: any) {
  // You can send to analytics here
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric)
  }
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Send to Google Analytics
    // window.gtag?.('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // })
  }
}

/**
 * Service Worker registration for PWA capabilities
 */
export async function registerServiceWorker() {
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

/**
 * Optimize third-party scripts loading
 */
export function loadScriptAsync(src: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve()
      return
    }

    // Check if script already loaded
    if (id && document.getElementById(id)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    if (id) script.id = id

    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

    document.body.appendChild(script)
  })
}

/**
 * Detect slow network and adjust quality
 */
export function isSlowConnection(): boolean {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    return (
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.saveData === true
    )
  }
  return false
}

/**
 * Get optimal image quality based on network
 */
export function getImageQuality(): number {
  return isSlowConnection() ? 60 : 85
}

/**
 * Preload critical fonts
 */
export function preloadFonts() {
  if (typeof document === 'undefined') return

  const fonts: string[] = [
    // Add your critical fonts here
    // '/fonts/inter-var.woff2',
  ]

  fonts.forEach((font) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.href = font
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
