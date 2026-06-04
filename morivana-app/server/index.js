import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { MongoClient, ServerApiVersion } from 'mongodb'

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
const corsOptions = NODE_ENV === 'production' && ALLOWED_ORIGIN
  ? {
      origin: ALLOWED_ORIGIN.split(',').map(o => o.trim()),
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
      credentials: true,
    }
  : { origin: true, credentials: true }  // dev: permissive

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

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

// In-memory rate limiting
const rateLimitWindow = 15 * 60 * 1000 // 15 minutes
const maxRequests = 100 // max 100 requests per IP per window
const ipRequests = new Map()

setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of ipRequests.entries()) {
    if (now - data.resetTime > 0) {
      ipRequests.delete(ip)
    }
  }
}, rateLimitWindow)

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const now = Date.now()

  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, { count: 1, resetTime: now + rateLimitWindow })
    return next()
  }

  const data = ipRequests.get(ip)
  if (now > data.resetTime) {
    data.count = 1
    data.resetTime = now + rateLimitWindow
    return next()
  }

  data.count++
  if (data.count > maxRequests) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }
  next()
}

// ── Routes ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.get('/api/csrf', (req, res) => {
  const token = generateCsrfToken()
  return res.json({ csrfToken: token })
})

app.post('/api/waitlist', rateLimiter, async (req, res) => {
  // 1. Honeypot check
  if (req.body?.confirm_email) {
    // Fail silently to fool spam bots
    return res.status(201).json({ ok: true, note: 'silenced' })
  }

  // 2. CSRF verification
  const csrfHeader = req.get('x-csrf-token')
  const csrfBody = req.body?.csrfToken
  if (!verifyCsrfToken(csrfHeader || csrfBody)) {
    return res.status(403).json({ error: 'Invalid or missing CSRF token' })
  }

  // 3. Turnstile verification
  const turnstileToken = req.body?.turnstileToken
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const turnstileOk = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Turnstile verification failed' })
  }

  const name  = String(req.body?.name  ?? '').trim()
  const email = String(req.body?.email ?? '').trim().toLowerCase()

  if (!name)              return res.status(400).json({ error: 'Name is required' })
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email is required' })

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
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Morivana API listening on http://localhost:${PORT} (${NODE_ENV || 'development'})`)
  })
}

export default app

