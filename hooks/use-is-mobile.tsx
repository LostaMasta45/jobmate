import * as React from "react"

/**
 * Hook to detect if the current viewport is mobile.
 * Returns `undefined` during SSR/initial render (before hydration).
 * Uses useLayoutEffect for synchronous detection before paint.
 */
export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Use useLayoutEffect for synchronous update before paint
  // This prevents the loading screen from flashing
  React.useLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < 768)
    }
    mql.addEventListener("change", onChange)
    // Set initial value immediately
    setIsMobile(window.innerWidth < 768)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}

