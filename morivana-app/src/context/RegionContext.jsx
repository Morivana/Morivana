import { createContext, useContext, useState, useEffect } from 'react'

const REGION_CONTEXT_KEY = Symbol.for('morivana_region_context')
const globalObj = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : {})
let RegionContext = globalObj[REGION_CONTEXT_KEY]
if (!RegionContext) {
  RegionContext = createContext()
  globalObj[REGION_CONTEXT_KEY] = RegionContext
}

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState(() => {
    try {
      return sessionStorage.getItem('morivana_region') || null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(!region)

  useEffect(() => {
    if (region) {
      setLoading(false)
      return
    }

    let isMounted = true

    async function detectRegion() {
      let detectedRegion = null

      // Attempt Geolocation API 1: ipapi.co
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (response.ok) {
          const data = await response.json()
          const country = data.country_code
          if (country) {
            detectedRegion = country === 'IN' ? 'IN' : 'CA'
          }
        }
      } catch (err) {
        console.warn('Failed to detect region via ipapi.co, trying fallback...', err)
      }

      // Attempt Geolocation API 2: ipinfo.io (Fallback)
      if (!detectedRegion) {
        try {
          const response = await fetch('https://ipinfo.io/json')
          if (response.ok) {
            const data = await response.json()
            const country = data.country
            if (country) {
              detectedRegion = country === 'IN' ? 'IN' : 'CA'
            }
          }
        } catch (err) {
          console.warn('Failed to detect region via ipinfo.io:', err)
        }
      }

      // Final default fallback
      if (!detectedRegion) {
        detectedRegion = 'IN'
      }

      if (isMounted) {
        setRegionState(detectedRegion)
        try {
          sessionStorage.setItem('morivana_region', detectedRegion)
        } catch (e) {
          // ignore
        }
        setLoading(false)
      }
    }

    detectRegion()

    return () => {
      isMounted = false
    }
  }, [region])

  const setRegion = (newRegion) => {
    setRegionState(newRegion)
    try {
      sessionStorage.setItem('morivana_region', newRegion)
    } catch (e) {
      // ignore
    }
  }

  const currentLoading = !region && loading

  return (
    <RegionContext.Provider value={{ region: region || 'IN', setRegion, loading: currentLoading }}>
      {children}
    </RegionContext.Provider>
  )
}

export function useUserRegion() {
  const context = useContext(RegionContext)
  if (!context) {
    throw new Error('useUserRegion must be used within a RegionProvider')
  }
  return context
}
