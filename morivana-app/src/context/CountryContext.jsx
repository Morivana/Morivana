import { createContext, useContext, useState, useEffect } from 'react'

const CountryContext = createContext()

export const useCountry = () => useContext(CountryContext)

export function CountryProvider({ children }) {
  const [country, setCountryState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_country') || 'all'
    }
    return 'all'
  })

  const setCountry = (val) => {
    setCountryState(val)
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_country', val)
    }
  }

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  )
}
