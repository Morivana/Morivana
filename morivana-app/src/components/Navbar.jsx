import { useState, useEffect, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import NavbarPublic from './NavbarPublic'

const NavbarInner = lazy(() => import('./NavbarInner'))

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

export default function Navbar() {
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let loaded = false
    const loadClerk = () => {
      if (loaded) return
      loaded = true
      setShouldLoadAuth(true)
      cleanup()
    }

    const cleanup = () => {
      window.removeEventListener('load', loadClerk)
      window.removeEventListener('pointermove', loadClerk)
      window.removeEventListener('touchstart', loadClerk)
      window.removeEventListener('scroll', loadClerk)
    }

    if (document.readyState === 'complete') {
      if (window.requestIdleCallback) {
        requestIdleCallback(loadClerk)
      } else {
        setTimeout(loadClerk, 1000)
      }
    } else {
      window.addEventListener('load', loadClerk)
    }

    window.addEventListener('pointermove', loadClerk, { passive: true })
    window.addEventListener('touchstart', loadClerk, { passive: true })
    window.addEventListener('scroll', loadClerk, { passive: true })

    return cleanup
  }, [])

  if (!shouldLoadAuth) {
    return <NavbarPublic />
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      afterSignOutUrl="/"
    >
      <Suspense fallback={<NavbarPublic />}>
        <NavbarInner />
      </Suspense>
    </ClerkProvider>
  )
}
