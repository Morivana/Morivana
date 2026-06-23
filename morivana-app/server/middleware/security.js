import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cors from 'cors'
import { securityLog } from '../utils/securityLogger.js'

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
  : [
      'https://www.morivanadaily.com',
      'https://morivanadaily.com',
      'https://www.morivandaily.com',
      'https://morivandaily.com',
      'https://www.moriavandaily.com',
      'https://moriavandaily.com',
      'https://www.morivana.com',
      'https://morivana.com',
      'https://morivana.pages.dev'
    ]

const corsOptionsConfig = {
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : ['http://localhost:5173', 'http://localhost:5174', true],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-CSRF-Token',
    'x-user-email',
    'x-user-name',
    'x-user-id'
  ],
  credentials: true,
  maxAge: 86400, // preflight cache 24h
}

export const corsOptions = cors(corsOptionsConfig)

// Helmet Configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://checkout.razorpay.com',
        'https://challenges.cloudflare.com',
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://*.clerk.accounts.dev',
        'https://*.clerk.com',
        'https://clerk.morivanadaily.com'
      ],
      frameSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://hooks.stripe.com',
        'https://api.razorpay.com',
        'https://checkout.razorpay.com',
        'https://challenges.cloudflare.com'
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://img.clerk.com',
        'https://cdn-icons-png.flaticon.com',
        'https://upload.wikimedia.org',
        'http://localhost:5173',
        'http://localhost:5174',
        ...allowedOrigins
      ],
      connectSrc: [
        "'self'",
        'https://api.clerk.com',
        'https://clerk.morivanadaily.com',
        'https://*.clerk.accounts.dev',
        'https://*.clerk.com',
        'https://clerk-telemetry.com',
        'https://api.stripe.com',
        'https://api.razorpay.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://ipapi.co',
        'https://challenges.cloudflare.com',
        'https://morivanadaily.com',
        'https://morivandaily.com',
        'https://moriavandaily.com',
        'https://morivana.pages.dev',
        'https://api.morivanadaily.com',
        'https://morivana-api-0l3l.onrender.com'
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: { action: 'sameorigin' },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
})

// General API limiter — all routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

// Strict limiter — auth and checkout routes
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait 15 minutes.' },
})

// Waitlist / form submission limiter
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Submission limit reached. Try again in an hour.' },
})

// ── NEW: Admin portal limiter — tighter than general ──────────────────────
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Admin rate limit exceeded. Please wait before retrying.' },
  handler: (req, res, next, options) => {
    securityLog.rateLimitHit(req)
    res.status(options.statusCode).json(options.message)
  },
})

// ── NEW: Login limiter — very strict for auth endpoints ───────────────────
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  handler: (req, res, next, options) => {
    securityLog.rateLimitHit(req)
    res.status(options.statusCode).json(options.message)
  },
})

// Strips $ and . from user input — prevents NoSQL injection
export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized NoSQL injection attempt: key=${key} ip=${req.ip}`)
  },
})

// Prevents HTTP Parameter Pollution
export const hppMiddleware = hpp()

// ── NEW: Input sanitizer — detects and blocks common injection patterns ───
// Scans req.body, req.query, and req.params for SQL/NoSQL injection signatures
const INJECTION_PATTERNS = [
  // SQL injection patterns
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC|EXECUTE)\b\s)/i,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,               // OR 1=1, AND 1=1
  /(--|#|\/\*|\*\/)/,                                  // SQL comments
  /('\s*(OR|AND)\s+')/i,                              // ' OR '
  /(\bSLEEP\s*\()/i,                                  // SLEEP() time-based
  /(\bBENCHMARK\s*\()/i,                              // BENCHMARK() time-based
  /(\bWAITFOR\s+DELAY\b)/i,                           // WAITFOR DELAY
  /(\bLOAD_FILE\s*\()/i,                              // File access
  /(\bINTO\s+(OUT|DUMP)FILE\b)/i,                     // File write
  // NoSQL injection patterns (beyond what mongo-sanitize catches)
  /\{\s*"\$[a-z]+"/i,                                 // {"$gt": ...}
  /\$where/i,                                          // $where operator
  /\$regex/i,                                          // $regex operator
]

function scanForInjection(value) {
  if (typeof value === 'string') {
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(value)) {
        return { detected: true, pattern: pattern.source }
      }
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const key of Object.keys(value)) {
      // Check key names for injection
      if (key.startsWith('$')) {
        return { detected: true, pattern: `operator_key: ${key}` }
      }
      const result = scanForInjection(value[key])
      if (result.detected) return result
    }
  }
  return { detected: false }
}

export const inputSanitizer = (req, res, next) => {
  const sources = [
    { name: 'body', data: req.body },
    { name: 'query', data: req.query },
    { name: 'params', data: req.params },
  ]

  for (const source of sources) {
    if (!source.data || typeof source.data !== 'object') continue
    const result = scanForInjection(source.data)
    if (result.detected) {
      securityLog.injectionAttempt(req, 'INJECTION_BLOCKED', `Source: ${source.name}, Pattern: ${result.pattern}`)
      return res.status(400).json({ error: 'Request blocked due to suspicious input.' })
    }
  }

  next()
}
