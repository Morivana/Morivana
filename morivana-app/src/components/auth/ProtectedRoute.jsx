import { useAuth } from '@clerk/clerk-react'
import { Navigate, useLocation } from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner'

/**
 * ProtectedRoute — blocks unauthenticated access.
 *
 * Security note: always check `isLoaded` FIRST. Rendering before Clerk has
 * resolved would cause a flash of unauthenticated content because isSignedIn
 * is `false` (not yet determined) during the async hydration window.
 *
 * Checkout redirect flow:
 *   - If the user hits /checkout while signed out, the current URL is saved to
 *     sessionStorage so SignInPage can redirect back after a successful sign-in.
 */
export default function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useAuth()
  const location = useLocation()

  // Auth state not yet resolved — show branded spinner (no content flash)
  if (!isLoaded) return <LoadingSpinner />

  if (!isSignedIn) {
    // Persist where the user wanted to go so we can redirect after sign-in
    sessionStorage.setItem('clerk_redirect_url', location.pathname + location.search)
    return <Navigate to="/sign-in" replace />
  }

  return children
}
