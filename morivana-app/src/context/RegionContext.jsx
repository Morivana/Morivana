
import { createContext, useContext, useState, useEffect } from 'react'

const RegionContext = createContext()

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState(() => {
    try {
      return localStorage.getItem('morivana_region') || null
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
      try {
        const response = await fetch('https://ipapi.co/json/')
        if (!response.ok) throw new Error('Geolocation request failed')
        const data = await response.json()
        if (isMounted) {
          const country = data.country_code || 'IN'
          const detectedRegion = country === 'CA' ? 'CA' : 'IN'
          setRegionState(detectedRegion)
          try {
            localStorage.setItem('morivana_region', detectedRegion)
          } catch (e) {
            // localStorage not available (e.g. private browsing)
          }
        }
      } catch (err) {
        console.error('Error detecting location, defaulting to IN:', err)
        if (isMounted) {
          setRegionState('IN')
          try {
            localStorage.setItem('morivana_region', 'IN')
          } catch (e) {
            // ignore
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
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
      localStorage.setItem('morivana_region', newRegion)
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
