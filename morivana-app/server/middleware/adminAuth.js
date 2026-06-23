import { clerkClient } from '@clerk/express'
import crypto from 'crypto'
import { securityLog } from '../utils/securityLogger.js'

// ── Failed Attempt Tracking (IP-based lockout) ──────────────────────────────
const failedAttempts = new Map() // Map<ip, { count, lastAttempt }>
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

function isLockedOut(ip) {
  const record = failedAttempts.get(ip)
  if (!record) return false
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    const elapsed = Date.now() - record.lastAttempt
    if (elapsed < LOCKOUT_DURATION_MS) return true
    // Lockout expired — reset
    failedAttempts.delete(ip)
    return false
  }
  return false
}

function recordFailedAttempt(ip) {
  const record = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 }
  record.count += 1
  record.lastAttempt = Date.now()
  failedAttempts.set(ip, record)
}

function clearFailedAttempts(ip) {
  failedAttempts.delete(ip)
}

// Periodically purge stale lockout entries (every 30 minutes)
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of failedAttempts.entries()) {
    if (now - record.lastAttempt > LOCKOUT_DURATION_MS) {
      failedAttempts.delete(ip)
    }
  }
}, 30 * 60 * 1000)

export async function adminAuth(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'

  try {
    // Check for IP lockout
    if (isLockedOut(ip)) {
      securityLog.authFailure(req, 'IP locked out due to repeated failed admin bypass attempts')
      return res.status(429).json({ error: 'Too many failed attempts. Please try again later.' })
    }

    // Check for passcode-based bypass authentication
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer bypass-')) {
      // Block bypass in production unless explicitly allowed
      const allowBypassInProd = process.env.ADMIN_BYPASS_ALLOW_PROD === 'true'
      if (process.env.NODE_ENV === 'production' && !allowBypassInProd) {
        securityLog.authFailure(req, 'Bypass login attempted in production (blocked)')
        return res.status(403).json({ error: 'Bypass authentication is disabled in production.' })
      }

      // Only allow bypass if an explicit code is set in environment — no hardcoded default
      const bypassCode = process.env.ADMIN_BYPASS_CODE
      if (!bypassCode) {
        securityLog.authFailure(req, 'Bypass login attempted but ADMIN_BYPASS_CODE is not configured')
        return res.status(403).json({ error: 'Bypass authentication is not configured.' })
      }

      const tokenVal = authHeader.substring(14) // strip "Bearer bypass-"

      // Use constant-time comparison to prevent timing attacks
      const tokenBuf = Buffer.from(tokenVal)
      const codeBuf = Buffer.from(bypassCode)
      const isValid = tokenBuf.length === codeBuf.length &&
        crypto.timingSafeEqual(tokenBuf, codeBuf)

      if (isValid) {
        clearFailedAttempts(ip)
        securityLog.adminAction(req, 'bypass-admin', 'BYPASS_AUTH_SUCCESS', 'Admin bypass login authenticated')
        req.adminUser = {
          id: 'bypass-admin',
          email: process.env.ADMIN_EMAIL || 'admin@morivanadaily.com',
          fullName: 'Bypass Admin User'
        }
        return next()
      } else {
        recordFailedAttempt(ip)
        securityLog.authFailure(req, 'Invalid bypass passcode')
        return res.status(401).json({ error: 'Unauthorized. Invalid credentials.' })
      }
    }

    const { userId } = req.auth || {}
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please sign in.' })
    }
    
    // Fetch user details from Clerk Backend API
    const user = await clerkClient.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress
    
    const adminEmail = process.env.ADMIN_EMAIL || 'morivana.daily@gmail.com'
    const isOwner = email === adminEmail
    const hasAdminMetadata = 
      user.publicMetadata?.role === 'admin' || 
      user.unsafeMetadata?.role === 'admin'
      
    if (!isOwner && !hasAdminMetadata) {
      securityLog.authFailure(req, `Non-admin user attempted admin access: ${email}`)
      return res.status(403).json({ error: 'Forbidden. Access restricted to administrator only.' })
    }
    
    req.adminUser = {
      id: userId,
      email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || email
    }
    next()
  } catch (err) {
    console.error('[ADMIN AUTH ERROR]', err)
    return res.status(500).json({ error: 'Authentication check failed.' })
  }
}
