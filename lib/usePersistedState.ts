"use client"

import { useState, useEffect } from "react"

export function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setState(JSON.parse(item))
      }
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error)
    }
    setIsHydrated(true)
  }, [key])

  // Save to localStorage on change
  useEffect(() => {
    if (!isHydrated) return // Don't save initial value if we haven't loaded yet

    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error)
    }
  }, [key, state, isHydrated])

  return [state, setState]
}
