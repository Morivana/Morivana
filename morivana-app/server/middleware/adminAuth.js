import { clerkClient } from '@clerk/express'

export async function adminAuth(req, res, next) {
  try {
    // Check for passcode-based secret admin bypass (for testing/easy access)
    const authHeader = req.headers.authorization
    const bypassCode = process.env.ADMIN_BYPASS_CODE || 'morivana-admin-2026'
    if (authHeader && authHeader.startsWith('Bearer bypass-')) {
      const tokenVal = authHeader.substring(14)
      if (tokenVal === bypassCode) {
        req.adminUser = {
          id: 'bypass-admin',
          email: 'admin@morivanadaily.com',
          fullName: 'Bypass Admin User'
        }
        return next()
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
      console.warn(`[ADMIN ACCESS DENIED] Unauthorized access attempt by: ${email}`)
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
