// Structured security event logger
// In production, pipe this to a log aggregator (Logtail, Papertrail, etc.)

export const securityLog = {
  authFailure: (req, reason) => {
    console.error(JSON.stringify({
      event: 'AUTH_FAILURE',
      reason,
      ip: req.ip,
      path: req.path,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    }))
  },

  rateLimitHit: (req) => {
    console.warn(JSON.stringify({
      event: 'RATE_LIMIT',
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString(),
    }))
  },

  suspiciousInput: (req, field, value) => {
    console.warn(JSON.stringify({
      event: 'SUSPICIOUS_INPUT',
      field,
      ip: req.ip,
      path: req.path,
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
}
