import { requireAuth as clerkRequireAuth } from '@clerk/express'

// Use on any route that requires a logged-in user
export const requireAuth = clerkRequireAuth()

// Use on admin-only routes
export const requireAdmin = (req, res, next) => {
  const userRole = req.auth?.sessionClaims?.metadata?.role
  if (userRole !== 'admin') {
    console.warn(`[AUTH] Admin access denied: userId=${req.auth?.userId} ip=${req.ip}`)
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}
