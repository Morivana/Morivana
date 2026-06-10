import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import hpp from 'hpp'
import cors from 'cors'

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
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400, // preflight cache 24h
}

export const corsOptions = cors(corsOptionsConfig)

// Helmet Configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com', 'https://checkout.razorpay.com', 'https://challenges.cloudflare.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://api.razorpay.com', 'https://challenges.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https://www.morivanadaily.com', 'https://morivanadaily.com', 'https://www.morivandaily.com', 'https://morivandaily.com', 'https://www.moriavandaily.com', 'https://moriavandaily.com', 'https://www.morivana.com', 'https://morivana.com', 'https://morivana.pages.dev'],
      connectSrc: ["'self'", 'https://api.clerk.com', 'https://ipapi.co', 'https://challenges.cloudflare.com', 'https://morivanadaily.com', 'https://morivandaily.com', 'https://moriavandaily.com', 'https://morivana.pages.dev'],
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

// Strips $ and . from user input — prevents NoSQL injection
export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized NoSQL injection attempt: key=${key} ip=${req.ip}`)
  },
})

// Prevents HTTP Parameter Pollution
export const hppMiddleware = hpp()
