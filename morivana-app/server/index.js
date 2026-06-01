import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion } from 'mongodb'

const {
  MONGODB_URI,
  MONGODB_DB = 'morivana',
  PORT = 5174,
  NODE_ENV,
  ALLOWED_ORIGIN,
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
// In production, restrict to the deployed static-site origin.
// In development, allow all origins (Vite dev server proxies /api calls).
const corsOptions = NODE_ENV === 'production' && ALLOWED_ORIGIN
  ? {
      origin: ALLOWED_ORIGIN.split(',').map(o => o.trim()),
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  : { origin: true }  // dev: permissive

const app = express()
app.use(cors(corsOptions))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/waitlist', async (req, res) => {
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

app.get('/api/health', (_req, res) => res.json({ ok: true, env: NODE_ENV }))

// ── Start ────────────────────────────────────────────────────────────────────
// NOTE: Static file serving is intentionally removed.
// The frontend is deployed as a Render Static Site (dist/ folder) — Express
// no longer needs to serve HTML. Only /api/* routes live here.

app.listen(PORT, () => {
  console.log(`Morivana API listening on http://localhost:${PORT} (${NODE_ENV || 'development'})`)
})
