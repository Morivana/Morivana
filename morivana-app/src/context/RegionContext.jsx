
import { createContext, useContext, useState, useEffect } from 'react'

const RegionContext = createContext()

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
            console.log('Detected region via ipapi.co:', detectedRegion)
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
              console.log('Detected region via ipinfo.io:', detectedRegion)
            }
          }
        } catch (err) {
          console.warn('Failed to detect region via ipinfo.io:', err)
        }
      }

      // Final default fallback
      if (!detectedRegion) {
        detectedRegion = 'IN'
        console.log('All geolocation APIs failed. Defaulting region to IN.')
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
