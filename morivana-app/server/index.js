import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { MongoClient, ServerApiVersion } from 'mongodb'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import { z } from 'zod'

const {
  MONGODB_URI,
  MONGODB_DB = 'morivana',
  PORT = 5174,
  NODE_ENV,
  ALLOWED_ORIGIN,
  CSRF_SECRET = crypto.randomBytes(32).toString('hex'),
  TURNSTILE_SECRET_KEY,
} = process.env

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Set it in morivana-app/.env')
  process.exit(1)
}

// ── MongoDB ─────────────────────────────────────────────────────────────────
const client = new MongoClient(MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
})

await client.connect()
const db = client.db(MONGODB_DB)
const waitlist = db.collection('waitlist')
await waitlist.createIndex({ email: 1 }, { unique: true })

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = ALLOWED_ORIGIN
  ? ALLOWED_ORIGIN.split(',').map(o => o.trim())
  : ['https://www.morivana.com', 'https://morivana.com', 'https://morivana.pages.dev']

const corsOptions = {
  origin: NODE_ENV === 'production'
    ? allowedOrigins
    : ['http://localhost:5173', 'http://localhost:5174', true],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}

const app = express()

// 1. HELMET — HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com', 'https://checkout.razorpay.com', 'https://challenges.cloudflare.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://api.razorpay.com', 'https://challenges.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https://www.morivana.com', 'https://morivana.com', 'https://morivana.pages.dev'],
      connectSrc: ["'self'", 'https://api.clerk.com', 'https://ipapi.co', 'https://challenges.cloudflare.com', 'https://morivana.pages.dev'],
    },
  },
  hsts: {
    maxAge: 31536000,        // 1 year
    includeSubDomains: true,
    preload: true,
  },
}))

// 2. RATE LIMITING
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 req per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,                     // 5 attempts per window (auth routes)
  message: { error: 'Too many attempts. Please try again in 15 minutes.' },
})

const checkoutLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 10,                    // 10 checkout attempts per hour per IP
  message: { error: 'Too many checkout attempts. Please try again later.' },
})

app.use('/api/', globalLimiter)
app.use('/api/auth/', authLimiter)
app.use('/api/checkout/', checkoutLimiter)

// 3. BODY PARSING (with payload size limit)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// 4. MONGO SANITIZE — NoSQL Injection Protection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitizeError: (req, res) => {
    res.status(400).json({ error: 'Invalid characters in request.' })
  },
}))

// 5. CORS
app.use(cors(corsOptions))

// ── Security Helpers ─────────────────────────────────────────────────────────

// CSRF helpers
function generateCsrfToken() {
  const token = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  const hmac = crypto.createHmac('sha256', CSRF_SECRET)
  hmac.update(`${token}.${timestamp}`)
  const signature = hmac.digest('hex')
  return `${token}.${timestamp}.${signature}`
}

function verifyCsrfToken(csrfToken) {
  if (!csrfToken) return false
  const parts = csrfToken.split('.')
  if (parts.length !== 3) return false
  const [token, timestamp, signature] = parts
  
  const timeLimit = 60 * 60 * 1000 // 1 hour expiration
  if (Date.now() - parseInt(timestamp, 10) > timeLimit) return false

  const hmac = crypto.createHmac('sha256', CSRF_SECRET)
  hmac.update(`${token}.${timestamp}`)
  const expectedSignature = hmac.digest('hex')

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  } catch (e) {
    return false
  }
}

// Turnstile verification
async function verifyTurnstile(token, ip) {
  if (!TURNSTILE_SECRET_KEY) return true // skip if not configured (e.g. dev/local)
  if (!token) return false

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    })
    const data = await response.json()
    return !!data.success
  } catch (err) {
    console.error('Turnstile verification error:', err)
    return false
  }
}

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests. Please try again later.' },
})

// ── Routes ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.get('/api/csrf', (req, res) => {
  return res.json({ csrfToken: 'static_csrf_token' })
})

const waitlistSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  confirm_email: z.string().optional(),
  turnstileToken: z.string().optional()
})

app.post('/api/waitlist', rateLimiter, async (req, res) => {
  // 1. Honeypot check
  if (req.body?.confirm_email) {
    // Fail silently to fool spam bots
    return res.status(201).json({ ok: true, note: 'silenced' })
  }

  // 2. Validate input schema using Zod
  const validationResult = waitlistSchema.safeParse(req.body)
  if (!validationResult.success) {
    const errorMsg = validationResult.error.errors[0]?.message || 'Invalid input'
    return res.status(400).json({ error: errorMsg })
  }

  const { name, email, turnstileToken } = validationResult.data

  // 3. Turnstile verification
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const turnstileOk = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Turnstile verification failed' })
  }

  try {
    await waitlist.insertOne({
      name,
      email,
      createdAt: new Date(),
      userAgent: req.get('user-agent') ?? null,
      ip: req.ip,
    })
    return res.status(201).json({ ok: true })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(200).json({ ok: true, duplicate: true })
    }
    console.error('waitlist insert error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
})

app.post('/api/vitals', (req, res) => {
  const { name, value, path } = req.body || {}
  console.log(`[Web Vital] ${name}: ${value} on ${path}`)
  return res.json({ ok: true })
})

app.get('/api/health', (_req, res) => res.json({ ok: true, env: NODE_ENV }))

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Morivana API listening on http://localhost:${PORT} (${NODE_ENV || 'development'})`)
})

