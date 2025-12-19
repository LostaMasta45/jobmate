import * as React from "react"

/**
 * Hook to detect if the current viewport is mobile.
 * Returns `undefined` during SSR/initial render (before hydration).
 * This allows consumers to show a loading state instead of flashing incorrect content.
 */
export function useIsMobile(): boolean | undefined {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const onChange = () => {
      setIsMobile(window.innerWidth < 768)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < 768)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
