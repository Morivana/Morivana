// Structured security event logger
// In production, pipe this to a log aggregator (Logtail, Papertrail, etc.)

export const securityLog = {
  authFailure: (req, reason) => {
    console.error(JSON.stringify({
      event: 'AUTH_FAILURE',
      reason,
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    }))
  },

  rateLimitHit: (req) => {
    console.warn(JSON.stringify({
      event: 'RATE_LIMIT',
      ip: req.ip,
      method: req.method,
      path: req.path,
      timestamp: new Date().toISOString(),
    }))
  },

  suspiciousInput: (req, field, value) => {
    console.warn(JSON.stringify({
      event: 'SUSPICIOUS_INPUT',
      field,
      // Never log the actual suspicious value in production — only in dev
      value: process.env.NODE_ENV === 'development' ? value : '[redacted]',
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    }))
  },

  orderAnomaly: (orderId, reason) => {
    console.error(JSON.stringify({
      event: 'ORDER_ANOMALY',
      orderId,
      reason,
      timestamp: new Date().toISOString(),
    }))
  },

  // ── Admin audit logging ──────────────────────────────────────────────────
  adminAction: (req, adminId, action, summary) => {
    console.log(JSON.stringify({
      event: 'ADMIN_ACTION',
      adminId,
      adminEmail: req.adminUser?.email || 'unknown',
      action,
      summary,
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    }))
  },

  injectionAttempt: (req, type, detail) => {
    console.error(JSON.stringify({
      event: 'INJECTION_ATTEMPT',
      type,
      detail: process.env.NODE_ENV === 'development' ? detail : '[redacted]',
      ip: req.ip,
      method: req.method,
      path: req.path,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    }))
  },
}
