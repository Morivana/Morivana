import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { MongoClient, ServerApiVersion } from 'mongodb'

const { MONGODB_URI, MONGODB_DB = 'morivana', PORT = 5174 } = process.env

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment. Set it in morivana-app/.env')
  process.exit(1)
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
})

await client.connect()
const db = client.db(MONGODB_DB)
const waitlist = db.collection('waitlist')
await waitlist.createIndex({ email: 1 }, { unique: true })

const app = express()
app.use(cors())
app.use(express.json())

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/waitlist', async (req, res) => {
  const name = String(req.body?.name ?? '').trim()
  const email = String(req.body?.email ?? '').trim().toLowerCase()

  if (!name) return res.status(400).json({ error: 'Name is required' })
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

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`Waitlist API listening on http://localhost:${PORT}`)
})
