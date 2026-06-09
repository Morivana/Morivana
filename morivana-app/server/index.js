import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { MongoClient, ServerApiVersion } from 'mongodb'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { google } from 'googleapis'

import { z } from 'zod'

const {
  MONGODB_URI,
  MONGODB_DB = 'morivana',
  PORT = 5174,
  NODE_ENV,
  ALLOWED_ORIGIN,
  CSRF_SECRET = crypto.randomBytes(32).toString('hex'),
  TURNSTILE_SECRET_KEY,
  EMAIL_USER,
  EMAIL_CLIENT_ID,
  EMAIL_CLIENT_SECRET,
  EMAIL_REFRESH_TOKEN,
  ADMIN_EMAIL,
  EMAIL_FROM = 'Morivaná Daily <no-reply@morivanadaily.com>',
} = process.env

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Set it in morivana-app/.env')
  process.exit(1)
}

// ── Gmail OAuth2 Setup ────────────────────────────────────────────────────────
let oauth2Client = null
let gmail = null
let cachedAccessToken = null
let tokenExpiryTime = 0

const hasValidCredentials = 
  EMAIL_CLIENT_ID && !EMAIL_CLIENT_ID.includes('your_client_id') &&
  EMAIL_CLIENT_SECRET && !EMAIL_CLIENT_SECRET.includes('your_client_secret') &&
  EMAIL_REFRESH_TOKEN && !EMAIL_REFRESH_TOKEN.includes('your_oauth2_refresh_token')

if (hasValidCredentials) {
  oauth2Client = new google.auth.OAuth2(
    EMAIL_CLIENT_ID,
    EMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )
  oauth2Client.setCredentials({
    refresh_token: EMAIL_REFRESH_TOKEN
  })
  gmail = google.gmail({ version: 'v1', auth: oauth2Client })
} else {
  console.log('Gmail OAuth2 environment variables are not fully configured (or contain placeholder values). Email sending will be mocked to console.')
}

async function getAccessTokenCached() {
  if (!oauth2Client) return null
  
  const now = Date.now()
  if (cachedAccessToken && (tokenExpiryTime - now > 5 * 60 * 1000)) {
    return cachedAccessToken
  }

  try {
    console.log('Refreshing Gmail access token...')
    const { credentials } = await oauth2Client.refreshAccessToken()
    cachedAccessToken = credentials.access_token
    tokenExpiryTime = credentials.expiry_date || (Date.now() + 3600 * 1000)
    oauth2Client.setCredentials(credentials)
    return cachedAccessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw error
  }
}

function startTokenRefreshScheduler() {
  if (!oauth2Client) return
  
  setInterval(async () => {
    try {
      await getAccessTokenCached()
      console.log('Gmail access token successfully refreshed by scheduler.')
    } catch (error) {
      console.error('Scheduler failed to refresh Gmail access token:', error)
    }
  }, 50 * 60 * 1000)
}

function buildRawMessage({ to, from, subject, text, html }) {
  const boundary = `__boundary_${crypto.randomUUID()}__`
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`
  
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
  ]

  const parts = []
  
  if (text) {
    parts.push(
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(text).toString('base64'),
      ''
    )
  }

  if (html) {
    parts.push(
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(html).toString('base64'),
      ''
    )
  }

  parts.push(`--${boundary}--`)

  const message = headers.join('\r\n') + '\r\n' + parts.join('\r\n')
  
  return Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function sendEmailRaw({ to, subject, text, html }) {
  if (!gmail) {
    console.log('--- MOCK EMAIL ---')
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Text Body: ${text}`)
    console.log('------------------')
    return
  }

  const raw = buildRawMessage({ to, from: EMAIL_FROM || EMAIL_USER, subject, text, html })

  let attempt = 1
  const maxAttempts = 3
  let delay = 1000

  while (attempt <= maxAttempts) {
    try {
      await getAccessTokenCached()

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw,
        },
      })
      console.log(`Email successfully sent to ${to} via Gmail REST API`)
      return
    } catch (error) {
      console.error(`Gmail API send attempt ${attempt} failed:`, error)
      if (attempt === maxAttempts) {
        throw error
      }
      attempt++
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2
    }
  }
}

async function sendWaitlistEmail({ name, email, region, source }) {
  const adminSubject = `New Form Submission - Morivaná Daily Waitlist`
  const adminText = `New signup on Morivaná Daily!

Name: ${name || 'N/A'}
Email: ${email}
Region: ${region || 'N/A'}
Source: ${source || 'waitlist'}
Date: ${new Date().toLocaleString()}
`
  const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px; line-height: 1.6; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
      <h2 style="color: #1C3A1C; margin-bottom: 20px; border-bottom: 2px solid #C8D96A; padding-bottom: 10px;">New Waitlist Submission</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
          <td style="padding: 8px 0;">${name || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Region:</td>
          <td style="padding: 8px 0; text-transform: capitalize;">${region || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Source:</td>
          <td style="padding: 8px 0;">${source || 'waitlist'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Submitted At:</td>
          <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>
  `

  const adminRecipient = ADMIN_EMAIL || EMAIL_USER || 'morivana.daily@gmail.com'
  await sendEmailRaw({
    to: adminRecipient,
    subject: adminSubject,
    text: adminText,
    html: adminHtml
  }).catch(err => {
    console.error('Failed to send waitlist alert to admin:', err)
  })

  const userSubject = `You're on the list! Welcome to Morivaná Daily`
  const userText = `Hi ${name || 'there'},\n\nThank you for joining the Morivaná Daily Super Greens waitlist!\n\nWe'll let you know as soon as we launch. Keep an eye on your inbox.\n\nBest,\nThe Morivaná Team`
  const userHtml = `
    <div style="font-family: sans-serif; padding: 30px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 12px; background-color: #FAFAFA; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1C3A1C; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Morivaná Daily</h1>
        <div style="height: 3px; width: 60px; background-color: #C8D96A; margin: 12px auto 0;"></div>
      </div>
      
      <p style="font-size: 16px; margin-top: 0;">Hi ${name || 'there'},</p>
      
      <p style="font-size: 16px;">We're thrilled to confirm that you've joined the waitlist for <strong>Morivaná Daily Super Greens</strong>!</p>
      
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Your Waitlist Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 100px;">Name:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500;">${name || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Email:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Region:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500; text-transform: capitalize;">${region || 'Global'}</td>
          </tr>
        </table>
      </div>
      
      <p style="font-size: 16px;">We will keep you updated on our launch progress and notify you the moment we open for orders. You will be among the first to experience the purest super greens on earth.</p>
      
      <p style="font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1C3A1C;">The Morivaná Team</strong></p>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
        &copy; ${new Date().getFullYear()} Morivaná. All rights reserved.
      </div>
    </div>
  `

  await sendEmailRaw({
    to: email,
    subject: userSubject,
    text: userText,
    html: userHtml
  }).catch(err => {
    console.error(`Failed to send confirmation email to user ${email}:`, err)
  })
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
  : ['https://www.morivanadaily.com', 'https://morivanadaily.com', 'https://www.morivandaily.com', 'https://morivandaily.com', 'https://www.moriavandaily.com', 'https://moriavandaily.com', 'https://www.morivana.com', 'https://morivana.com', 'https://morivana.pages.dev']

const corsOptions = {
  origin: NODE_ENV === 'production'
    ? allowedOrigins
    : ['http://localhost:5173', 'http://localhost:5174', true],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}

const app = express()

// Trust proxy (required when running behind a reverse proxy like Render or Cloudflare)
app.set('trust proxy', 1)

// Enable CORS early to handle preflight OPTIONS requests before rate limiting/body parsing
app.use(cors(corsOptions))


// 1. HELMET — HTTP Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com', 'https://checkout.razorpay.com', 'https://challenges.cloudflare.com'],
      frameSrc: ["'self'", 'https://js.stripe.com', 'https://api.razorpay.com', 'https://challenges.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https://www.morivanadaily.com', 'https://morivanadaily.com', 'https://www.morivandaily.com', 'https://morivandaily.com', 'https://www.moriavandaily.com', 'https://moriavandaily.com', 'https://www.morivana.com', 'https://morivana.com', 'https://morivana.pages.dev'],
      connectSrc: ["'self'", 'https://api.clerk.com', 'https://ipapi.co', 'https://challenges.cloudflare.com', 'https://morivanadaily.com', 'https://morivandaily.com', 'https://moriavandaily.com', 'https://morivana.pages.dev'],
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
  name: z.string().trim().optional(),
  email: z.string().trim().toLowerCase().email('Valid email is required'),
  confirm_email: z.string().optional(),
  turnstileToken: z.string().optional(),
  region: z.string().trim().optional(),
  source: z.string().trim().optional()
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

  const { name, email, turnstileToken, region, source } = validationResult.data

  // 3. Turnstile verification
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const turnstileOk = await verifyTurnstile(turnstileToken, ip)
  if (!turnstileOk) {
    return res.status(400).json({ error: 'Turnstile verification failed' })
  }

  try {
    await waitlist.insertOne({
      name: name || null,
      email,
      region: region || null,
      source: source || 'waitlist',
      createdAt: new Date(),
      userAgent: req.get('user-agent') ?? null,
      ip: req.ip,
    })

    // Send email notification asynchronously (non-blocking)
    sendWaitlistEmail({ name, email, region, source }).catch(err => {
      console.error('Background waitlist email error:', err)
    })

    return res.status(201).json({ ok: true })
  } catch (err) {
    if (err?.code === 11000) {
      // Send email even if duplicate to satisfy "whenever user fills form, email should be sent"
      sendWaitlistEmail({ name, email, region, source: (source || 'waitlist') + ' (duplicate)' }).catch(err => {
        console.error('Background duplicate waitlist email error:', err)
      })
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

app.get('/', (_req, res) => res.json({ ok: true, message: 'Morivaná API is running', env: NODE_ENV }))
app.get('/api/health', (_req, res) => res.json({ ok: true, env: NODE_ENV }))

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Morivana API listening on http://localhost:${PORT} (${NODE_ENV || 'development'})`)
  startTokenRefreshScheduler()
})

