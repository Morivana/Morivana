import 'dotenv/config'
import express from 'express'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { google } from 'googleapis'
import { clerkMiddleware } from '@clerk/express'
import {
  corsOptions,
  helmetConfig,
  generalLimiter,
  formLimiter,
  mongoSanitizeMiddleware,
  hppMiddleware,
} from './middleware/security.js'
import { validate, waitlistSchema } from './middleware/validate.js'
import { errorHandler } from './middleware/errorHandler.js'
import stripeWebhooksRouter from './routes/webhooks.js'
import { adminAuth } from './middleware/adminAuth.js'
import { ObjectId } from 'mongodb'

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
  // Hardened Security Options
  ssl: true,
  tlsAllowInvalidCertificates: false,
  // Connection Pool Limits (to prevent resource exhaustion)
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
})

let db = null
let waitlist = null
let products = null
let deliveries = null
let payments = null
let returns = null
let orders = null
let tickets = null
let coupons = null
let storeSettings = null
let emailLogs = null
let reviews = null
let abandonedCheckouts = null
let isDbConnected = false

// Fallback in-memory arrays when MongoDB is offline
let fallbackProductsList = [
  { _id: 'mock-prod-1', name: 'Morivaná Daily Super Greens (50g Trial Pack)', sku: 'MD-50G', price: 499, currency: 'INR', priceUSD: 21, stock: 50, status: 'In Stock' },
  { _id: 'mock-prod-2', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', sku: 'MD-100G', price: 799, currency: 'INR', priceUSD: 39, stock: 120, status: 'In Stock' }
]

let ordersList = [
  { _id: 'mock-ord-6', orderId: 'ORD-006', customer: 'Priya Mehta', email: 'priya@example.com', items: [{ sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹799', usd: '$9.60', paymentStatus: 'Pending', orderStatus: 'Pending', date: 'Jun 13', createdAt: new Date(), method: 'UPI', region: 'IN' },
  { _id: 'mock-ord-7', orderId: 'ORD-007', customer: 'Rahul Singh', email: 'rahul@example.com', items: [{ sku: 'MD-50G', name: 'Morivaná Daily Super Greens (50g Trial Pack)', qty: 2, price: 499 }], total: '₹998', usd: '$12.00', paymentStatus: 'Pending', orderStatus: 'Pending', date: 'Jun 13', createdAt: new Date(), method: 'Card', region: 'IN' },
  { _id: 'mock-ord-5', orderId: 'ORD-005', customer: 'Nia', email: 'nia878982@gmail.com', items: [{ sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹799', usd: '$9.60', paymentStatus: 'Settled', orderStatus: 'Confirmed', date: 'Jun 12', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), method: 'UPI', region: 'IN' },
  { _id: 'mock-ord-4', orderId: 'ORD-004', customer: 'Junaid Jalal', email: 'sunjalal6000@gmail.com', items: [{ sku: 'MD-50G', name: 'Morivaná Daily Super Greens (50g Trial Pack)', qty: 1, price: 499 }, { sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹1,298', usd: '$15.60', paymentStatus: 'Pending', orderStatus: 'Packed', date: 'Jun 11', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), method: 'UPI', region: 'IN' },
  { _id: 'mock-ord-3', orderId: 'ORD-003', customer: 'Ameera Jalal', email: 'jalalameera60@gmail.com', items: [{ sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹799', usd: '$9.60', paymentStatus: 'Settled', orderStatus: 'Shipped', date: 'Jun 10', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), method: 'Card', region: 'IN' },
  { _id: 'mock-ord-2', orderId: 'ORD-002', customer: 'Junaid Jalal', email: 'sunjalal6000@gmail.com', items: [{ sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹799', usd: '$9.60', paymentStatus: 'Settled', orderStatus: 'Shipped', date: 'Jun 9', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), method: 'UPI', region: 'NA' }
]

let ticketsList = [
  { _id: 'mock-tck-1', ticketId: 'TCK-101', customer: 'Nia', email: 'nia@example.com', orderId: 'ORD-001', subject: 'In Transit Status Delay', priority: 'Medium', status: 'Open', replies: [{ sender: 'customer', text: 'My package has been in transit for 2 days, when can I expect it?', timestamp: new Date() }], createdAt: new Date(), region: 'IN' },
  { _id: 'mock-tck-2', ticketId: 'TCK-102', customer: 'Junaid Jalal', email: 'junaid@example.com', orderId: 'ORD-002', subject: 'Change shipping address', priority: 'High', status: 'In Progress', replies: [{ sender: 'customer', text: 'Hi, I need to update my shipping address to Apt 4B.', timestamp: new Date() }, { sender: 'agent', text: 'Sure, we are processing this request.', timestamp: new Date() }], createdAt: new Date(), region: 'NA' },
  { _id: 'mock-tck-3', ticketId: 'TCK-103', customer: 'Ameera Jalal', email: 'ameera@example.com', orderId: 'ORD-003', subject: 'Loving the greens!', priority: 'Low', status: 'Resolved', replies: [{ sender: 'customer', text: 'Just wanted to say the packaging is gorgeous!', timestamp: new Date() }], createdAt: new Date(), region: 'IN' }
]

let returnsList = [
  { _id: 'mock-ret-1', id: 'RET-091', order: 'ORD-104', customer: 'Ameera Jalal', item: 'MD-50G', reason: 'Ordered incorrect size packaging', status: 'Pending', date: 'Jun 11', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-ret-2', id: 'RET-082', order: 'ORD-092', customer: 'test_user_new', item: 'MD-100G', reason: 'Packaging damaged in transit', status: 'Approved', date: 'Jun 4', createdAt: new Date(), region: 'NA' }
]

let deliveriesList = [
  { _id: 'mock-del-1', id: 'ORD-003', customer: 'Ameera Jalal', carrier: 'Shiprocket', tracking: 'SR2026061301', status: 'In transit', dest: 'Mumbai, IN', date: 'Jun 15', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-del-2', id: 'ORD-002', customer: 'Junaid Jalal', carrier: 'Delhivery', tracking: 'DL2026061298', status: 'In transit', dest: 'Toronto, CA', date: 'Jun 14', createdAt: new Date(), region: 'NA' },
  { _id: 'mock-del-3', id: 'ORD-001', customer: 'Nia', carrier: 'Shiprocket', tracking: 'SR2026061189', status: 'Delivered', dest: 'Bangalore, IN', date: 'Jun 13', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-del-4', id: 'ORD-004', customer: 'Junaid Jalal', carrier: '—', tracking: 'Not assigned', status: 'Packed', dest: 'Gurgaon, IN', date: '—', createdAt: new Date(), region: 'IN' }
]

let paymentsList = [
  { _id: 'mock-pay-1', gateway: 'Razorpay', order: 'ORD-001', amount: '₹799', usd: '$9.60', status: 'Settled', method: 'UPI', date: 'Jun 11', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-pay-2', gateway: 'Razorpay', order: 'ORD-002', amount: '₹499', usd: '$6.00', status: 'Settled', method: 'Card', date: 'Jun 10', createdAt: new Date(), region: 'NA' },
  { _id: 'mock-pay-3', gateway: 'Razorpay', order: 'ORD-003', amount: '₹799', usd: '$9.60', status: 'Settled', method: 'UPI', date: 'Jun 9', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-pay-4', gateway: 'Razorpay', order: 'ORD-004', amount: '₹1,298', usd: '$15.60', status: 'Pending', method: 'UPI', date: 'Jun 8', createdAt: new Date(), region: 'IN' },
  { _id: 'mock-pay-5', gateway: 'Razorpay', order: 'ORD-005', amount: '₹499', usd: '$6.00', status: 'Settled', method: 'Card', date: 'Jun 7', createdAt: new Date(), region: 'IN' }
]

let couponsList = [
  { _id: 'mock-cpn-1', code: 'WELCOME10', type: 'Percentage', value: 10, expiryDate: '2026-12-31', usedCount: 45, maxUses: 100, status: 'Active', createdAt: new Date() },
  { _id: 'mock-cpn-2', code: 'SUPERGREENS50', type: 'Fixed', value: 50, expiryDate: '2026-08-31', usedCount: 12, maxUses: 50, status: 'Active', createdAt: new Date() },
  { _id: 'mock-cpn-3', code: 'OFF20', type: 'Percentage', value: 20, expiryDate: '2026-05-15', usedCount: 80, maxUses: 80, status: 'Expired', createdAt: new Date() },
  { _id: 'mock-cpn-4', code: 'TESTFREE', type: 'Percentage', value: 100, expiryDate: '2026-09-30', usedCount: 0, maxUses: 10, status: 'Paused', createdAt: new Date() }
]

let storeSettingsData = {
  storeName: 'Morivaná Daily',
  supportEmail: 'support@morivanadaily.com',
  phone: '+91 98765 43210',
  currency: 'INR',
  taxPercent: 18,
  lowStockThreshold: 20,
  emailTemplates: {
    orderConfirmation: 'Dear {{customer}}, thank you for your order {{orderId}} of {{total}}. We are preparing it for shipment.',
    orderShipped: 'Hi {{customer}}, your order {{orderId}} has been shipped via {{carrier}} with tracking {{tracking}}.'
  },
  webhooks: [
    { url: 'https://api.morivanadaily.com/v1/webhook', events: ['order.created', 'payment.settled'] }
  ]
}

let emailLogsList = [
  { 
    _id: 'mock-email-1', 
    orderId: 'ORD-003', 
    customer: 'Ameera Jalal', 
    email: 'jalalameera60@gmail.com', 
    type: 'order_confirmation', 
    subject: 'Your Morivaná order confirmation', 
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
    status: 'Sent', 
    error: null, 
    body: `<div style="font-family: sans-serif; padding: 30px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 12px; background-color: #FAFAFA; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1C3A1C; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Morivaná Daily</h1>
        <div style="height: 3px; width: 60px; background-color: #C8D96A; margin: 12px auto 0;"></div>
      </div>
      <p style="font-size: 16px; margin-top: 0;">Dear Ameera Jalal,</p>
      <p style="font-size: 16px;">Thank you for your order! We are thrilled to confirm your purchase. We are preparing it for shipment and will send you another email as soon as it leaves our warehouse.</p>
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary — ORD-003</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 10px 0; color: #0F172A; font-weight: 500;">Morivaná Daily Super Greens (100g Daily Ritual) (Qty: 1)</td>
            <td style="padding: 10px 0; color: #64748B; text-align: right;">₹799</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #0F172A;">Total Paid:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #0F172A; text-align: right;">₹799</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</h3>
        <p style="font-size: 14px; color: #475569; margin: 0;">Bangalore, Karnataka, India</p>
      </div>
      <p style="font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1C3A1C;">The Morivaná Team</strong></p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
        &copy; 2026 Morivaná. All rights reserved.
      </div>
    </div>`, 
    attempts: 1,
    region: 'IN'
  },
  { 
    _id: 'mock-email-2', 
    orderId: 'ORD-004', 
    customer: 'Junaid Jalal', 
    email: 'sunjalal6000@gmail.com', 
    type: 'order_confirmation', 
    subject: 'Your Morivaná order confirmation', 
    sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
    status: 'Failed', 
    error: 'SMTP connection timeout', 
    body: `<div style="font-family: sans-serif; padding: 30px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 12px; background-color: #FAFAFA; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1C3A1C; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Morivaná Daily</h1>
        <div style="height: 3px; width: 60px; background-color: #C8D96A; margin: 12px auto 0;"></div>
      </div>
      <p style="font-size: 16px; margin-top: 0;">Dear Junaid Jalal,</p>
      <p style="font-size: 16px;">Thank you for your order! We are thrilled to confirm your purchase. We are preparing it for shipment and will send you another email as soon as it leaves our warehouse.</p>
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Order Summary — ORD-004</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 10px 0; color: #0F172A; font-weight: 500;">Morivaná Daily Super Greens (50g Trial Pack) (Qty: 1)</td>
            <td style="padding: 10px 0; color: #64748B; text-align: right;">₹499</td>
          </tr>
          <tr style="border-bottom: 1px solid #F1F5F9;">
            <td style="padding: 10px 0; color: #0F172A; font-weight: 500;">Morivaná Daily Super Greens (100g Daily Ritual) (Qty: 1)</td>
            <td style="padding: 10px 0; color: #64748B; text-align: right;">₹799</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #0F172A;">Total Paid:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #0F172A; text-align: right;">₹1,298</td>
          </tr>
        </table>
      </div>
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Delivery Address</h3>
        <p style="font-size: 14px; color: #475569; margin: 0;">Gurgaon, Haryana, India</p>
      </div>
      <p style="font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1C3A1C;">The Morivaná Team</strong></p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
        &copy; 2026 Morivaná. All rights reserved.
      </div>
    </div>`, 
    attempts: 1,
    region: 'IN'
  },
  { 
    _id: 'mock-email-3', 
    orderId: 'ORD-002', 
    customer: 'Junaid Jalal', 
    email: 'sunjalal6000@gmail.com', 
    type: 'order_shipped', 
    subject: 'Your Morivaná order has shipped!', 
    sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), 
    status: 'Sent', 
    error: null, 
    body: `<div style="font-family: sans-serif; padding: 30px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 12px; background-color: #FAFAFA; color: #1E293B;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #1C3A1C; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Morivaná Daily</h1>
        <div style="height: 3px; width: 60px; background-color: #C8D96A; margin: 12px auto 0;"></div>
      </div>
      <p style="font-size: 16px; margin-top: 0;">Hi Junaid,</p>
      <p style="font-size: 16px;">Great news! Your order <strong>ORD-002</strong> has shipped and is on its way to you.</p>
      <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
        <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Shipment Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 120px;">Courier:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500;">Delhivery</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Tracking Number:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500; font-family: monospace;">DL2026061298</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Destination:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 500;">Toronto, Canada</td>
          </tr>
        </table>
      </div>
      <p style="font-size: 16px;">Use the tracking number to monitor your package directly on the courier's website.</p>
      <p style="font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1C3A1C;">The Morivaná Team</strong></p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #94A3B8;">
        &copy; 2026 Morivaná. All rights reserved.
      </div>
    </div>`, 
    attempts: 1,
    region: 'NA'
  }
]

let reviewsList = [
  { _id: 'mock-rev-1', sku: 'MD-100G', productName: 'Morivaná Daily Super Greens (100g Daily Ritual)', customer: 'Rahul Singh', email: 'rahul@example.com', rating: 5, title: 'Outstanding taste!', comment: 'Best greens I have ever had. Refreshing and mixes easily. Highly recommended.', status: 'Approved', reply: 'Thank you Rahul! We are glad you love it!', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), region: 'IN' },
  { _id: 'mock-rev-2', sku: 'MD-50G', productName: 'Morivaná Daily Super Greens (50g Trial Pack)', customer: 'Priya Mehta', email: 'priya@example.com', rating: 4, title: 'Very good quality', comment: 'Loved the packaging. The greens feel extremely premium.', status: 'Pending', reply: null, createdAt: new Date(), region: 'IN' },
  { _id: 'mock-rev-3', sku: 'MD-100G', productName: 'Morivaná Daily Super Greens (100g Daily Ritual)', customer: 'Junaid Jalal', email: 'sunjalal6000@gmail.com', rating: 5, title: 'Felt the difference in 3 days', comment: 'Highly recommended for digestion and gut health.', status: 'Approved', reply: null, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), region: 'NA' }
]

let abandonedCheckoutsList = [
  { _id: 'mock-abc-1', email: 'john.doe@example.com', customer: 'John Doe', cartItems: [{ sku: 'MD-100G', name: 'Morivaná Daily Super Greens (100g Daily Ritual)', qty: 1, price: 799 }], total: '₹799', usd: '$9.60', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), reminderSent: false, reminderSentAt: null, region: 'IN' },
  { _id: 'mock-abc-2', email: 'mary.jane@example.com', customer: 'Mary Jane', cartItems: [{ sku: 'MD-50G', name: 'Morivaná Daily Super Greens (50g Trial Pack)', qty: 2, price: 499 }], total: '₹998', usd: '$12.00', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), reminderSent: true, reminderSentAt: new Date(Date.now() - 20 * 60 * 60 * 1000), region: 'NA' }
]

await client.connect().then(() => {
  console.log('[DB] MongoDB connected successfully')
  isDbConnected = true
}).catch(err => {
  console.error('[DB] MongoDB connection failed:', err.message)
  console.warn('[DB] Warning: Continuing server startup without active DB connection.')
})

if (isDbConnected) {
  db = client.db(MONGODB_DB)
  waitlist = db.collection('waitlist')
  await waitlist.createIndex({ email: 1 }, { unique: true })

  products = db.collection('products')
  await products.createIndex({ sku: 1 }, { unique: true })
  const productCount = await products.countDocuments()
  if (productCount === 0) {
    await products.insertMany([
      {
        name: 'Morivaná Daily Super Greens (50g Trial Pack)',
        sku: 'MD-50G',
        price: 499,
        currency: 'INR',
        priceUSD: 21,
        stock: 50,
        status: 'In Stock',
        createdAt: new Date(),
      },
      {
        name: 'Morivaná Daily Super Greens (100g Daily Ritual)',
        sku: 'MD-100G',
        price: 799,
        currency: 'INR',
        priceUSD: 39,
        stock: 120,
        status: 'In Stock',
        createdAt: new Date(),
      }
    ])
    console.log('[DB] Seeded products collection with initial inventory')
  }

  deliveries = db.collection('deliveries')
  const deliveriesCount = await deliveries.countDocuments()
  if (deliveriesCount === 0) {
    await deliveries.insertMany([
      { id: 'ORD-001', customer: 'Nia', carrier: 'Delhivery', tracking: 'DEL987654321', status: 'Shipped', dest: 'Mumbai, IN', date: 'Jun 10', createdAt: new Date() },
      { id: 'ORD-002', customer: 'Junaid Jalal', carrier: 'DHL Express', tracking: 'DHL112233445', status: 'Processing', dest: 'Toronto, CA', date: 'Jun 10', createdAt: new Date() },
      { id: 'ORD-003', customer: 'Ameera Jalal', carrier: 'BlueDart', tracking: 'BD556677889', status: 'Delivered', dest: 'Bangalore, IN', date: 'Jun 9', createdAt: new Date() },
      { id: 'ORD-004', customer: 'test_user_gmail', carrier: 'Canada Post', tracking: 'CP778899001', status: 'Shipped', dest: 'Vancouver, CA', date: 'Jun 8', createdAt: new Date() },
      { id: 'ORD-005', customer: 'test_api@example.com', carrier: 'Delhivery', tracking: 'DEL123456789', status: 'Delivered', dest: 'Delhi, IN', date: 'Jun 7', createdAt: new Date() }
    ])
    console.log('[DB] Seeded deliveries collection')
  }

  payments = db.collection('payments')
  const paymentsCount = await payments.countDocuments()
  if (paymentsCount === 0) {
    await payments.insertMany([
      { gateway: 'Razorpay', order: 'ORD-001', amount: '₹799', usd: '$9.60', status: 'Settled', method: 'UPI', date: 'Jun 11', createdAt: new Date() },
      { gateway: 'Razorpay', order: 'ORD-002', amount: '₹499', usd: '$6.00', status: 'Settled', method: 'Card', date: 'Jun 10', createdAt: new Date() },
      { gateway: 'Razorpay', order: 'ORD-003', amount: '₹799', usd: '$9.60', status: 'Settled', method: 'UPI', date: 'Jun 9', createdAt: new Date() },
      { gateway: 'Razorpay', order: 'ORD-004', amount: '₹1,298', usd: '$15.60', status: 'Pending', method: 'UPI', date: 'Jun 8', createdAt: new Date() },
      { gateway: 'Razorpay', order: 'ORD-005', amount: '₹499', usd: '$6.00', status: 'Settled', method: 'Card', date: 'Jun 7', createdAt: new Date() }
    ])
    console.log('[DB] Seeded payments collection')
  }

  returns = db.collection('returns')
  const returnsCount = await returns.countDocuments()
  if (returnsCount === 0) {
    await returns.insertMany([
      { id: 'RET-091', order: 'ORD-104', customer: 'Ameera Jalal', item: 'MD-50G', reason: 'Ordered incorrect size packaging', status: 'Pending', date: 'Jun 11', createdAt: new Date() },
      { id: 'RET-082', order: 'ORD-092', customer: 'test_user_new@example.com', item: 'MD-100G', reason: 'Packaging damaged in transit', status: 'Approved', date: 'Jun 4', createdAt: new Date() }
    ])
    console.log('[DB] Seeded returns collection')
  }

  orders = db.collection('orders')
  const ordersCount = await orders.countDocuments()
  if (ordersCount === 0) {
    await orders.insertMany(ordersList)
    console.log('[DB] Seeded orders collection')
  }

  tickets = db.collection('tickets')
  const ticketsCount = await tickets.countDocuments()
  if (ticketsCount === 0) {
    await tickets.insertMany(ticketsList)
    console.log('[DB] Seeded tickets collection')
  }

  coupons = db.collection('coupons')
  const couponsCount = await coupons.countDocuments()
  if (couponsCount === 0) {
    await coupons.insertMany(couponsList)
    console.log('[DB] Seeded coupons collection')
  }

  storeSettings = db.collection('storeSettings')
  const settingsCount = await storeSettings.countDocuments()
  if (settingsCount === 0) {
    await storeSettings.insertOne(storeSettingsData)
    console.log('[DB] Seeded storeSettings collection')
  }

  emailLogs = db.collection('emailLogs')
  const emailLogsCount = await emailLogs.countDocuments()
  if (emailLogsCount === 0) {
    await emailLogs.insertMany(emailLogsList)
    console.log('[DB] Seeded emailLogs collection')
  }

  reviews = db.collection('reviews')
  const reviewsCount = await reviews.countDocuments()
  if (reviewsCount === 0) {
    await reviews.insertMany(reviewsList)
    console.log('[DB] Seeded reviews collection')
  }

  abandonedCheckouts = db.collection('abandonedCheckouts')
  const abandonedCheckoutsCount = await abandonedCheckouts.countDocuments()
  if (abandonedCheckoutsCount === 0) {
    await abandonedCheckouts.insertMany(abandonedCheckoutsList)
    console.log('[DB] Seeded abandonedCheckouts collection')
  }
}


const app = express()

// Trust proxy (required when running behind a reverse proxy like Render or Cloudflare)
app.set('trust proxy', 1)

// ── Security middleware — must be first, before any routes ──
app.use(helmetConfig)
app.use(corsOptions)
app.options(/.*/, corsOptions) // handle preflight requests
app.use(generalLimiter)
// Express v5 compatibility middleware: req.query is a read-only getter by default, which throws when mutated by express-mongo-sanitize.
app.use((req, res, next) => {
  if (req.query) {
    Object.defineProperty(req, 'query', {
      value: { ...req.query },
      writable: true,
      configurable: true,
      enumerable: true
    })
  }
  next()
})

app.use(mongoSanitizeMiddleware)
app.use(hppMiddleware)

// ── Clerk authentication middleware ──
let clerkMiddle = (req, res, next) => {
  req.auth = {}
  next()
}
const hasClerkKeys = (process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY) && process.env.CLERK_SECRET_KEY
if (hasClerkKeys) {
  try {
    clerkMiddle = clerkMiddleware({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY
    })
  } catch (err) {
    console.error('Failed to initialize Clerk middleware:', err)
  }
} else {
  console.warn('[CLERK] Warning: CLERK_SECRET_KEY is missing. Clerk authentication will be mocked (bypass authentication only).')
}
app.use((req, res, next) => clerkMiddle(req, res, next))

// ── Raw body parser for Stripe webhooks (registered BEFORE express.json) ──
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }))

// Webhook Router
app.use('/api/webhooks', stripeWebhooksRouter)

// ── Body parsers — after security middleware ──
app.use(express.json({ limit: '10kb' })) // 10kb limit prevents payload flooding
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

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/csrf', (req, res) => {
  return res.json({ csrfToken: 'static_csrf_token' })
})

app.post('/api/waitlist', formLimiter, validate(waitlistSchema), async (req, res, next) => {
  try {
    // 1. Honeypot check
    if (req.body?.confirm_email) {
      // Fail silently to fool spam bots
      return res.status(201).json({ ok: true, note: 'silenced' })
    }

    const { name, email, turnstileToken, region, source } = req.body

    // 2. Turnstile verification
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const turnstileOk = await verifyTurnstile(turnstileToken, ip)
    if (!turnstileOk) {
      return res.status(400).json({ error: 'Turnstile verification failed' })
    }

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
      const { name, email, region, source } = req.body
      // Send email even if duplicate to satisfy "whenever user fills form, email should be sent"
      sendWaitlistEmail({ name, email, region, source: (source || 'waitlist') + ' (duplicate)' }).catch(err => {
        console.error('Background duplicate waitlist email error:', err)
      })
      return res.status(200).json({ ok: true, duplicate: true })
    }
    next(err)
  }
})

app.post('/api/vitals', (req, res, next) => {
  try {
    const { name, value, path } = req.body || {}
    console.log(`[Web Vital] ${name}: ${value} on ${path}`)
    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// Public endpoint for product inventory
app.get('/api/products', async (req, res, next) => {
  try {
    const list = await products.find().toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST Bypass Login
app.post('/api/admin/bypass-login', (req, res) => {
  const { passcode } = req.body
  const bypassCode = process.env.ADMIN_BYPASS_CODE || 'morivana-admin-2026'
  
  if (!passcode) {
    return res.status(400).json({ error: 'Passcode is required.' })
  }
  
  if (passcode.trim() === bypassCode) {
    return res.json({ ok: true, token: `bypass-${bypassCode}` })
  } else {
    return res.status(401).json({ error: 'Invalid passcode.' })
  }
})

// Admin check-auth
app.get('/api/admin/auth-check', adminAuth, (req, res) => {
  return res.json({ ok: true, user: req.adminUser })
})

// Country Filter Helpers for Admin Portal
const getCountryFilter = (countryParam) => {
  const c = (countryParam || 'all').toLowerCase();
  if (c === 'in') {
    return { region: { $in: ['INDIA', 'IN', 'india', 'in'] } };
  } else if (c === 'ca') {
    return { region: { $nin: ['INDIA', 'IN', 'india', 'in'] } };
  }
  return {};
};

const isMatchCountry = (itemRegion, countryParam) => {
  const c = (countryParam || 'all').toLowerCase();
  const r = (itemRegion || 'GLOBAL').toUpperCase();
  const isIndia = r === 'INDIA' || r === 'IN';
  if (c === 'in') {
    return isIndia;
  } else if (c === 'ca') {
    return !isIndia;
  }
  return true;
};

app.get('/api/admin/stats', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    const countryKey = countryParam.toLowerCase()

    // Helper functions for mock/offline calculation
    const getMetricsForCountry = (c) => {
      const pList = paymentsList.filter(p => isMatchCountry(p.region, c))
      const oList = ordersList.filter(o => isMatchCountry(o.region, c))
      const tList = ticketsList.filter(t => isMatchCountry(t.region, c))
      const rList = returnsList.filter(r => isMatchCountry(r.region, c))
      const isIN = c === 'in'

      const totalEarningsVal = pList.reduce((sum, p) => {
        if (isIN) {
          const clean = p.amount.replace(/[^\d]/g, '')
          return sum + (parseInt(clean, 10) || 0)
        } else {
          const clean = p.usd.replace(/[^\d]/g, '')
          return sum + (parseFloat(clean) || 0)
        }
      }, 0)

      const paymentsReceivedVal = pList
        .filter(p => p.status === 'Settled')
        .reduce((sum, p) => {
          if (isIN) {
            const clean = p.amount.replace(/[^\d]/g, '')
            return sum + (parseInt(clean, 10) || 0)
          } else {
            const clean = p.usd.replace(/[^\d]/g, '')
            return sum + (parseFloat(clean) || 0)
          }
        }, 0)

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todaySettledPayments = pList.filter(p => {
        if (p.status !== 'Settled') return false
        const payDate = p.createdAt ? new Date(p.createdAt) : new Date()
        return payDate >= todayStart
      })

      const revenueTodayVal = todaySettledPayments.reduce((sum, p) => {
        if (isIN) {
          const clean = p.amount.replace(/[^\d]/g, '')
          return sum + (parseInt(clean, 10) || 0)
        } else {
          const clean = p.usd.replace(/[^\d]/g, '')
          return sum + (parseFloat(clean) || 0)
        }
      }, 0)

      const formattedEarnings = isIN ? `₹${totalEarningsVal.toLocaleString('en-IN')}` : `$${totalEarningsVal.toFixed(2)} CAD`
      const formattedPayments = isIN ? `₹${paymentsReceivedVal.toLocaleString('en-IN')}` : `$${paymentsReceivedVal.toFixed(2)} CAD`
      const formattedRevenue = isIN ? `₹${revenueTodayVal.toLocaleString('en-IN')}` : `$${revenueTodayVal.toFixed(2)} CAD`

      return {
        totalEarnings: formattedEarnings,
        paymentsReceived: formattedPayments,
        revenueToday: formattedRevenue,
        deltaEarnings: isIN ? `+₹${totalEarningsVal.toLocaleString('en-IN')}` : `+$${totalEarningsVal.toFixed(2)} CAD`,
        deltaPayments: isIN ? `+₹${paymentsReceivedVal.toLocaleString('en-IN')}` : `+$${paymentsReceivedVal.toFixed(2)} CAD`,
        pendingOrdersCount: oList.filter(o => ['Processing', 'Pending'].includes(o.orderStatus)).length,
        openTicketsCount: tList.filter(t => ['Open', 'In Progress'].includes(t.status)).length,
        pendingReturnsCount: rList.filter(r => r.status === 'Pending').length,
        waitlistCount: [
          { region: 'india' },
          { region: 'canada' },
          { region: 'global' },
          { region: 'global' },
          { region: 'global' },
          { region: 'global' },
          { region: 'canada' },
          { region: 'india' }
        ].filter(s => isMatchCountry(s.region, c)).length
      }
    }

    if (!isDbConnected || !waitlist) {
      // Offline fallback computations
      const fallbackProducts = [
        { sku: 'MD-50G', stock: 50, price: 499 },
        { sku: 'MD-100G', stock: 120, price: 799 }
      ]
      const totalStock = fallbackProducts.reduce((sum, p) => sum + p.stock, 0)
      const lowStockThreshold = parseInt(storeSettingsData.lowStockThreshold || 20, 10)
      const lowStockCount = fallbackProducts.filter(p => p.stock < lowStockThreshold).length

      const mockRecentSignups = [
        { _id: 'mock-sub-1', name: 'Nia', email: 'nia@example.com', region: 'india', createdAt: new Date() },
        { _id: 'mock-sub-2', name: 'Junaid Jalal', email: 'junaid@example.com', region: 'canada', createdAt: new Date() },
        { _id: 'mock-sub-3', name: 'Ameera Jalal', email: 'ameera@example.com', region: 'global', createdAt: new Date() }
      ].filter(s => isMatchCountry(s.region, countryParam))

      const indiaMetrics = getMetricsForCountry('in')
      const canadaMetrics = getMetricsForCountry('ca')

      const combinedMetrics = {
        waitlistCount: mockRecentSignups.length,
        totalStock,
        activeProductsCount: 2,
        uniqueRegionsCount: countryKey === 'in' ? 1 : countryKey === 'ca' ? 2 : 3,
        lowStockCount,
        pendingOrdersCount: ordersList.filter(o => isMatchCountry(o.region, countryParam) && ['Processing', 'Pending'].includes(o.orderStatus)).length,
        openTicketsCount: ticketsList.filter(t => isMatchCountry(t.region, countryParam) && ['Open', 'In Progress'].includes(t.status)).length,
        pendingReturnsCount: returnsList.filter(r => isMatchCountry(r.region, countryParam) && r.status === 'Pending').length,
        india: indiaMetrics,
        canada: canadaMetrics
      }

      if (countryKey === 'in') {
        Object.assign(combinedMetrics, indiaMetrics)
      } else if (countryKey === 'ca') {
        Object.assign(combinedMetrics, canadaMetrics)
      } else {
        combinedMetrics.totalEarnings = ""
        combinedMetrics.paymentsReceived = ""
        combinedMetrics.revenueToday = ""
        combinedMetrics.deltaEarnings = ""
        combinedMetrics.deltaPayments = ""
      }

      return res.json({
        metrics: combinedMetrics,
        charts: {
          growth: [
            { date: 'Jun 4', count: 0 },
            { date: 'Jun 5', count: 0 },
            { date: 'Jun 6', count: 0 },
            { date: 'Jun 7', count: 0 },
            { date: 'Jun 8', count: countryKey === 'in' ? 0 : 1 },
            { date: 'Jun 9', count: countryKey === 'in' ? 1 : 2 },
            { date: 'Jun 10', count: countryKey === 'in' ? 1 : 4 },
            { date: 'Jun 11', count: countryKey === 'in' ? 1 : 6 },
            { date: 'Jun 12', count: countryKey === 'in' ? 1 : 7 }
          ],
          inventory: fallbackProducts.map(p => ({ name: p.sku, stock: p.stock, price: p.price }))
        },
        recentSignups: mockRecentSignups
      })
    }

    // DB-connected mode
    const getMetricsFromDb = async (c) => {
      const waitlistFilter = getCountryFilter(c)
      const orderFilter = getCountryFilter(c)
      const paymentFilter = getCountryFilter(c)
      const ticketFilter = getCountryFilter(c)
      const returnFilter = getCountryFilter(c)

      const totalWaitlist = await waitlist.countDocuments(waitlistFilter)
      
      const pendingOrdersCount = orders ? await orders.countDocuments({
        ...orderFilter,
        orderStatus: { $in: ['Processing', 'Pending'] }
      }) : ordersList.filter(o => isMatchCountry(o.region, c) && ['Processing', 'Pending'].includes(o.orderStatus)).length

      const openTicketsCount = tickets ? await tickets.countDocuments({
        ...ticketFilter,
        status: { $in: ['Open', 'In Progress'] }
      }) : ticketsList.filter(t => isMatchCountry(t.region, c) && ['Open', 'In Progress'].includes(t.status)).length

      const pendingReturnsCount = returns ? await returns.countDocuments({
        ...returnFilter,
        status: 'Pending'
      }) : returnsList.filter(r => isMatchCountry(r.region, c) && r.status === 'Pending').length

      const allPayments = await payments.find(paymentFilter).toArray()
      const isIN = c === 'in'

      const totalEarningsVal = allPayments.reduce((sum, p) => {
        if (isIN) {
          const clean = p.amount.replace(/[^\d]/g, '')
          return sum + (parseInt(clean, 10) || 0)
        } else {
          const clean = p.usd.replace(/[^\d]/g, '')
          return sum + (parseFloat(clean) || 0)
        }
      }, 0)

      const paymentsReceivedVal = allPayments
        .filter(p => p.status === 'Settled')
        .reduce((sum, p) => {
          if (isIN) {
            const clean = p.amount.replace(/[^\d]/g, '')
            return sum + (parseInt(clean, 10) || 0)
          } else {
            const clean = p.usd.replace(/[^\d]/g, '')
            return sum + (parseFloat(clean) || 0)
          }
        }, 0)

      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todaySettledPayments = allPayments.filter(p => {
        if (p.status !== 'Settled') return false
        const payDate = p.createdAt ? new Date(p.createdAt) : new Date()
        return payDate >= todayStart
      })

      const revenueTodayVal = todaySettledPayments.reduce((sum, p) => {
        if (isIN) {
          const clean = p.amount.replace(/[^\d]/g, '')
          return sum + (parseInt(clean, 10) || 0)
        } else {
          const clean = p.usd.replace(/[^\d]/g, '')
          return sum + (parseFloat(clean) || 0)
        }
      }, 0)

      const formattedEarnings = isIN ? `₹${totalEarningsVal.toLocaleString('en-IN')}` : `$${totalEarningsVal.toFixed(2)} CAD`
      const formattedPayments = isIN ? `₹${paymentsReceivedVal.toLocaleString('en-IN')}` : `$${paymentsReceivedVal.toFixed(2)} CAD`
      const formattedRevenue = isIN ? `₹${revenueTodayVal.toLocaleString('en-IN')}` : `$${revenueTodayVal.toFixed(2)} CAD`

      return {
        totalEarnings: formattedEarnings,
        paymentsReceived: formattedPayments,
        revenueToday: formattedRevenue,
        deltaEarnings: isIN ? `+₹${totalEarningsVal.toLocaleString('en-IN')}` : `+$${totalEarningsVal.toFixed(2)} CAD`,
        deltaPayments: isIN ? `+₹${paymentsReceivedVal.toLocaleString('en-IN')}` : `+$${paymentsReceivedVal.toFixed(2)} CAD`,
        pendingOrdersCount,
        openTicketsCount,
        pendingReturnsCount,
        waitlistCount: totalWaitlist
      }
    }

    const waitlistFilter = getCountryFilter(countryParam)
    const orderFilter = getCountryFilter(countryParam)
    const ticketFilter = getCountryFilter(countryParam)
    const returnFilter = getCountryFilter(countryParam)

    const totalWaitlist = await waitlist.countDocuments(waitlistFilter)
    const allProducts = await products.find().toArray()
    const totalStock = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0)

    const growthTrend = []
    for (let i = 9; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(23, 59, 59, 999)
      const count = await waitlist.countDocuments({
        ...waitlistFilter,
        createdAt: { $lte: d }
      })
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      growthTrend.push({ date: dateStr, count })
    }

    const inventoryStats = allProducts.map(p => ({
      name: p.sku,
      stock: p.stock || 0,
      price: p.price
    }))

    const activeProductsCount = allProducts.length
    const waitlistDocs = await waitlist.find(waitlistFilter, { projection: { region: 1 } }).toArray()
    const uniqueRegions = [...new Set(waitlistDocs.map(doc => doc.region).filter(Boolean))]
    const uniqueRegionsCount = uniqueRegions.length

    const recentSignups = await waitlist.find(waitlistFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    const pendingOrdersCount = orders ? await orders.countDocuments({
      ...orderFilter,
      orderStatus: { $in: ['Processing', 'Pending'] }
    }) : ordersList.filter(o => isMatchCountry(o.region, countryParam) && ['Processing', 'Pending'].includes(o.orderStatus)).length

    let threshold = 20
    if (storeSettings) {
      const settings = await storeSettings.findOne()
      if (settings && settings.lowStockThreshold !== undefined) {
        threshold = parseInt(settings.lowStockThreshold, 10)
      }
    } else {
      threshold = parseInt(storeSettingsData.lowStockThreshold || 20, 10)
    }
    const lowStockCount = allProducts.filter(p => (p.stock || 0) < threshold).length

    const openTicketsCount = tickets ? await tickets.countDocuments({
      ...ticketFilter,
      status: { $in: ['Open', 'In Progress'] }
    }) : ticketsList.filter(t => isMatchCountry(t.region, countryParam) && ['Open', 'In Progress'].includes(t.status)).length

    const pendingReturnsCount = returns ? await returns.countDocuments({ ...returnFilter, status: 'Pending' }) : returnsList.filter(r => isMatchCountry(r.region, countryParam) && r.status === 'Pending').length

    const indiaMetrics = await getMetricsFromDb('in')
    const canadaMetrics = await getMetricsFromDb('ca')

    const combinedMetrics = {
      waitlistCount: totalWaitlist,
      totalStock,
      activeProductsCount,
      uniqueRegionsCount,
      pendingOrdersCount,
      lowStockCount,
      openTicketsCount,
      pendingReturnsCount,
      india: indiaMetrics,
      canada: canadaMetrics
    }

    if (countryKey === 'in') {
      Object.assign(combinedMetrics, indiaMetrics)
    } else if (countryKey === 'ca') {
      Object.assign(combinedMetrics, canadaMetrics)
    } else {
      combinedMetrics.totalEarnings = ""
      combinedMetrics.paymentsReceived = ""
      combinedMetrics.revenueToday = ""
      combinedMetrics.deltaEarnings = ""
      combinedMetrics.deltaPayments = ""
    }

    return res.json({
      metrics: combinedMetrics,
      charts: {
        growth: growthTrend,
        inventory: inventoryStats
      },
      recentSignups
    })
  } catch (err) {
    next(err)
  }
})

// GET Admin Inventory
app.get('/api/admin/inventory', adminAuth, async (req, res, next) => {
  try {
    if (!isDbConnected || !products) {
      return res.json(fallbackProductsList)
    }
    const list = await products.find().toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST Add Product
app.post('/api/admin/inventory', adminAuth, async (req, res, next) => {
  try {
    const { name, sku, price, stock, currency = 'INR', priceUSD } = req.body

    if (!name || !sku || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields (name, sku, price, stock).' })
    }

    const upperSku = sku.toUpperCase().trim()

    if (!isDbConnected || !products) {
      if (fallbackProductsList.some(p => p.sku === upperSku)) {
        return res.status(400).json({ error: 'Product SKU must be unique.' })
      }
      const newProduct = {
        _id: `mock-prod-${Date.now()}`,
        name,
        sku: upperSku,
        price: Number(price),
        currency,
        priceUSD: priceUSD ? Number(priceUSD) : Math.round(Number(price) / 24),
        stock: Number(stock),
        status: Number(stock) > 0 ? 'In Stock' : 'Out of Stock',
        createdAt: new Date()
      }
      fallbackProductsList.push(newProduct)
      return res.status(201).json({ ok: true, product: newProduct })
    }

    const newProduct = {
      name,
      sku: upperSku,
      price: Number(price),
      currency,
      priceUSD: priceUSD ? Number(priceUSD) : Math.round(Number(price) / 24),
      stock: Number(stock),
      status: Number(stock) > 0 ? 'In Stock' : 'Out of Stock',
      createdAt: new Date()
    }

    const result = await products.insertOne(newProduct)
    return res.status(201).json({ ok: true, product: { ...newProduct, _id: result.insertedId } })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ error: 'Product SKU must be unique.' })
    }
    next(err)
  }
})

// PUT Update Product
app.put('/api/admin/inventory/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, sku, price, stock, priceUSD, currency } = req.body

    if (!isDbConnected || !products) {
      const idx = fallbackProductsList.findIndex(p => p._id === id || p.sku === id)
      if (idx === -1) return res.status(404).json({ error: 'Product not found.' })

      if (sku) {
        const upperSku = sku.toUpperCase().trim()
        if (fallbackProductsList.some((p, i) => i !== idx && p.sku === upperSku)) {
          return res.status(400).json({ error: 'Product SKU must be unique.' })
        }
        fallbackProductsList[idx].sku = upperSku
      }
      if (name) fallbackProductsList[idx].name = name
      if (price !== undefined) fallbackProductsList[idx].price = Number(price)
      if (priceUSD !== undefined) fallbackProductsList[idx].priceUSD = Number(priceUSD)
      if (currency) fallbackProductsList[idx].currency = currency
      if (stock !== undefined) {
        fallbackProductsList[idx].stock = Number(stock)
        fallbackProductsList[idx].status = Number(stock) > 0 ? 'In Stock' : 'Out of Stock'
      }
      return res.json({ ok: true, product: fallbackProductsList[idx] })
    }

    const updateFields = {}
    if (name) updateFields.name = name
    if (sku) updateFields.sku = sku.toUpperCase().trim()
    if (price !== undefined) updateFields.price = Number(price)
    if (priceUSD !== undefined) updateFields.priceUSD = Number(priceUSD)
    if (currency) updateFields.currency = currency
    if (stock !== undefined) {
      updateFields.stock = Number(stock)
      updateFields.status = Number(stock) > 0 ? 'In Stock' : 'Out of Stock'
    }

    const result = await products.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: 'after' }
    )

    if (!result) {
      return res.status(404).json({ error: 'Product not found.' })
    }

    return res.json({ ok: true, product: result })
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({ error: 'Product SKU must be unique.' })
    }
    next(err)
  }
})

// DELETE Product
app.delete('/api/admin/inventory/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params

    if (!isDbConnected || !products) {
      const idx = fallbackProductsList.findIndex(p => p._id === id || p.sku === id)
      if (idx === -1) return res.status(404).json({ error: 'Product not found.' })
      fallbackProductsList.splice(idx, 1)
      return res.json({ ok: true })
    }

    const result = await products.deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found.' })
    }
    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// GET Admin Deliveries
app.get('/api/admin/deliveries', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !deliveries) {
      const filtered = deliveriesList.filter(d => isMatchCountry(d.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await deliveries.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// PUT Admin Deliveries (Assign Courier or Update Status)
app.put('/api/admin/deliveries/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { carrier, tracking, status, date } = req.body
    if (!isDbConnected || !deliveries) {
      const delIdx = deliveriesList.findIndex(d => d._id === id || d.id === id)
      if (delIdx !== -1) {
        if (carrier) deliveriesList[delIdx].carrier = carrier
        if (tracking) deliveriesList[delIdx].tracking = tracking
        if (status) deliveriesList[delIdx].status = status
        if (date) deliveriesList[delIdx].date = date
        return res.json({ ok: true, delivery: deliveriesList[delIdx] })
      }
      return res.status(404).json({ error: 'Delivery item not found' })
    }
    const { ObjectId } = await import('mongodb')
    let query = { _id: id }
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { id: id }
    }
    const updateObj = {}
    if (carrier) updateObj.carrier = carrier
    if (tracking) updateObj.tracking = tracking
    if (status) updateObj.status = status
    if (date) updateObj.date = date

    const result = await deliveries.findOneAndUpdate(
      query,
      { $set: updateObj },
      { returnDocument: 'after' }
    )
    return res.json({ ok: true, delivery: result })
  } catch (err) {
    next(err)
  }
})

// GET Admin Payments
app.get('/api/admin/payments', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !payments) {
      const filtered = paymentsList.filter(p => isMatchCountry(p.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await payments.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// PUT Admin Payments (Update Status/Refund)
app.put('/api/admin/payments/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!isDbConnected || !payments) {
      const payIdx = paymentsList.findIndex(p => p._id === id || p.order === id)
      if (payIdx !== -1) {
        paymentsList[payIdx].status = status
        return res.json({ ok: true, payment: paymentsList[payIdx] })
      }
      return res.status(404).json({ error: 'Payment record not found' })
    }
    const { ObjectId } = await import('mongodb')
    let query = { _id: id }
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { order: id }
    }
    const result = await payments.findOneAndUpdate(
      query,
      { $set: { status } },
      { returnDocument: 'after' }
    )
    return res.json({ ok: true, payment: result })
  } catch (err) {
    next(err)
  }
})

// GET Admin Returns
app.get('/api/admin/returns', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !returns) {
      const filtered = returnsList.filter(r => isMatchCountry(r.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await returns.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// PUT Admin Returns (Approve, Reject, Refund, etc.)
app.put('/api/admin/returns/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!isDbConnected || !returns) {
      const retIdx = returnsList.findIndex(r => r._id === id || r.id === id)
      if (retIdx !== -1) {
        returnsList[retIdx].status = status
        return res.json({ ok: true, returnItem: returnsList[retIdx] })
      }
      return res.status(404).json({ error: 'Return item not found' })
    }
    const { ObjectId } = await import('mongodb')
    let query = { _id: id }
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { id: id }
    }
    const result = await returns.findOneAndUpdate(
      query,
      { $set: { status } },
      { returnDocument: 'after' }
    )
    return res.json({ ok: true, returnItem: result })
  } catch (err) {
    next(err)
  }
})

// ── GA4 Config Helper ────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getGA4Config() {
  const propertyId = process.env.GA4_PROPERTY_ID
  if (!propertyId) return { configured: false, reason: 'Missing GA4_PROPERTY_ID in environment' }

  let keyData = null
  if (process.env.GA4_SERVICE_ACCOUNT_KEY) {
    try {
      keyData = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY)
    } catch (e) {
      return { configured: false, reason: 'GA4_SERVICE_ACCOUNT_KEY is not valid JSON' }
    }
  } else {
    const keyPath = process.env.GA4_KEY_PATH || path.join(__dirname, 'ga4-key.json')
    if (fs.existsSync(keyPath)) {
      try {
        keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
      } catch (e) {
        return { configured: false, reason: `Failed to read or parse service account key at ${keyPath}` }
      }
    }
  }

  if (!keyData || !keyData.client_email || !keyData.private_key) {
    return { configured: false, reason: 'Missing service account credentials (client_email and/or private_key)' }
  }

  return { configured: true, keyData, propertyId }
}

// ── GA4 Analytics Endpoint ───────────────────────────────────────────────────
app.get('/api/admin/analytics', adminAuth, async (req, res, next) => {
  const timeframe = req.query.timeframe || '30d'

  // Dynamic high-fidelity mock datasets for fallbacks and demo mode
  const getMockData = (tf) => {
    const deltaLabel = 
      tf === '30m' ? 'vs previous 30m' :
      tf === '1h' ? 'vs previous 1h' :
      tf === '4h' ? 'vs previous 4h' :
      tf === '24h' ? 'vs yesterday' : 'vs last 30d'

    switch (tf) {
      case '30m':
        return {
          configured: false,
          metrics: {
            sessions: { value: '42', delta: '+15.2%', label: deltaLabel },
            activeUsers: { value: '28', delta: '+8.4%', label: deltaLabel },
            pageViews: { value: '114', delta: '+12.1%', label: deltaLabel },
            bounceRate: { value: '28.5%', delta: '-4.2%', label: deltaLabel },
            avgSessionDuration: { value: '1m 45s', delta: '+6.1%', label: deltaLabel }
          },
          channels: [
            { channel: 'Direct', sessions: 26, percent: '62.0%' },
            { channel: 'Organic Social', sessions: 10, percent: '24.0%' },
            { channel: 'Organic Search', sessions: 6, percent: '14.0%' }
          ],
          devices: [
            { device: 'Desktop', sessions: 23, percent: '54.8%' },
            { device: 'Mobile', sessions: 17, percent: '40.5%' },
            { device: 'Tablet', sessions: 2, percent: '4.8%' }
          ],
          regions: [
            { region: 'India', sessions: 26, percent: '61.9%' },
            { region: 'Canada', sessions: 12, percent: '28.6%' },
            { region: 'United States', sessions: 4, percent: '9.5%' }
          ],
          pages: [
            { path: '/', title: 'Home | Purest Super Greens', pageViews: 65, sessions: 26 },
            { path: '/shop/daily-greens', title: 'Product Details | Morivaná Daily', pageViews: 28, sessions: 10 },
            { path: '/waitlist', title: 'Waitlist Form', pageViews: 15, sessions: 4 },
            { path: '/about', title: 'Our Story', pageViews: 6, sessions: 2 }
          ],
          trend: [
            { date: 'T-25m', count: 5 },
            { date: 'T-20m', count: 8 },
            { date: 'T-15m', count: 6 },
            { date: 'T-10m', count: 11 },
            { date: 'T-5m', count: 4 },
            { date: 'Now', count: 8 }
          ]
        }
      case '1h':
        return {
          configured: false,
          metrics: {
            sessions: { value: '98', delta: '+8.6%', label: deltaLabel },
            activeUsers: { value: '64', delta: '+5.1%', label: deltaLabel },
            pageViews: { value: '245', delta: '+10.4%', label: deltaLabel },
            bounceRate: { value: '32.1%', delta: '-2.1%', label: deltaLabel },
            avgSessionDuration: { value: '1m 58s', delta: '+3.2%', label: deltaLabel }
          },
          channels: [
            { channel: 'Direct', sessions: 64, percent: '65.3%' },
            { channel: 'Organic Social', sessions: 22, percent: '22.4%' },
            { channel: 'Organic Search', sessions: 12, percent: '12.3%' }
          ],
          devices: [
            { device: 'Desktop', sessions: 54, percent: '55.1%' },
            { device: 'Mobile', sessions: 40, percent: '40.8%' },
            { device: 'Tablet', sessions: 4, percent: '4.1%' }
          ],
          regions: [
            { region: 'India', sessions: 60, percent: '61.2%' },
            { region: 'Canada', sessions: 28, percent: '28.6%' },
            { region: 'United States', sessions: 10, percent: '10.2%' }
          ],
          pages: [
            { path: '/', title: 'Home | Purest Super Greens', pageViews: 120, sessions: 54 },
            { path: '/shop/daily-greens', title: 'Product Details | Morivaná Daily', pageViews: 62, sessions: 24 },
            { path: '/waitlist', title: 'Waitlist Form', pageViews: 45, sessions: 14 },
            { path: '/about', title: 'Our Story', pageViews: 18, sessions: 6 }
          ],
          trend: [
            { date: '50m ago', count: 12 },
            { date: '40m ago', count: 18 },
            { date: '30m ago', count: 15 },
            { date: '20m ago', count: 22 },
            { date: '10m ago', count: 14 },
            { date: 'Just now', count: 17 }
          ]
        }
      case '4h':
        return {
          configured: false,
          metrics: {
            sessions: { value: '320', delta: '+14.2%', label: deltaLabel },
            activeUsers: { value: '210', delta: '+11.8%', label: deltaLabel },
            pageViews: { value: '812', delta: '+16.5%', label: deltaLabel },
            bounceRate: { value: '35.8%', delta: '-3.1%', label: deltaLabel },
            avgSessionDuration: { value: '2m 05s', delta: '+5.4%', label: deltaLabel }
          },
          channels: [
            { channel: 'Direct', sessions: 218, percent: '68.1%' },
            { channel: 'Organic Social', sessions: 67, percent: '20.9%' },
            { channel: 'Organic Search', sessions: 35, percent: '11.0%' }
          ],
          devices: [
            { device: 'Desktop', sessions: 179, percent: '55.9%' },
            { device: 'Mobile', sessions: 128, percent: '40.0%' },
            { device: 'Tablet', sessions: 13, percent: '4.1%' }
          ],
          regions: [
            { region: 'India', sessions: 198, percent: '61.9%' },
            { region: 'Canada', sessions: 90, percent: '28.1%' },
            { region: 'United States', sessions: 32, percent: '10.0%' }
          ],
          pages: [
            { path: '/', title: 'Home | Purest Super Greens', pageViews: 380, sessions: 178 },
            { path: '/shop/daily-greens', title: 'Product Details | Morivaná Daily', pageViews: 210, sessions: 85 },
            { path: '/waitlist', title: 'Waitlist Form', pageViews: 162, sessions: 41 },
            { path: '/about', title: 'Our Story', pageViews: 60, sessions: 16 }
          ],
          trend: [
            { date: '3h ago', count: 65 },
            { date: '2h ago', count: 88 },
            { date: '1h ago', count: 74 },
            { date: 'This hour', count: 93 }
          ]
        }
      case '24h':
        return {
          configured: false,
          metrics: {
            sessions: { value: '1,140', delta: '+9.4%', label: deltaLabel },
            activeUsers: { value: '720', delta: '+7.1%', label: deltaLabel },
            pageViews: { value: '2,740', delta: '+11.2%', label: deltaLabel },
            bounceRate: { value: '39.2%', delta: '-1.8%', label: deltaLabel },
            avgSessionDuration: { value: '2m 10s', delta: '+4.1%', label: deltaLabel }
          },
          channels: [
            { channel: 'Direct', sessions: 764, percent: '67.0%' },
            { channel: 'Organic Social', sessions: 262, percent: '23.0%' },
            { channel: 'Organic Search', sessions: 114, percent: '10.0%' }
          ],
          devices: [
            { device: 'Desktop', sessions: 627, percent: '55.0%' },
            { device: 'Mobile', sessions: 467, percent: '41.0%' },
            { device: 'Tablet', sessions: 46, percent: '4.0%' }
          ],
          regions: [
            { region: 'India', sessions: 706, percent: '61.9%' },
            { region: 'Canada', sessions: 320, percent: '28.1%' },
            { region: 'United States', sessions: 114, percent: '10.0%' }
          ],
          pages: [
            { path: '/', title: 'Home | Purest Super Greens', pageViews: 1320, sessions: 760 },
            { path: '/shop/daily-greens', title: 'Product Details | Morivaná Daily', pageViews: 710, sessions: 280 },
            { path: '/waitlist', title: 'Waitlist Form', pageViews: 512, sessions: 140 },
            { path: '/about', title: 'Our Story', pageViews: 198, sessions: 60 }
          ],
          trend: [
            { date: '20h ago', count: 140 },
            { date: '16h ago', count: 190 },
            { date: '12h ago', count: 165 },
            { date: '8h ago', count: 210 },
            { date: '4h ago', count: 185 },
            { date: 'Now', count: 250 }
          ]
        }
      case '30d':
      default:
        return {
          configured: false,
          metrics: {
            sessions: { value: '1,420', delta: '+12.4%', label: deltaLabel },
            activeUsers: { value: '890', delta: '+8.2%', label: deltaLabel },
            pageViews: { value: '3,420', delta: '+15.1%', label: deltaLabel },
            bounceRate: { value: '42.5%', delta: '-2.4%', label: deltaLabel },
            avgSessionDuration: { value: '2m 14s', delta: '+4.8%', label: deltaLabel }
          },
          channels: [
            { channel: 'Direct', sessions: 965, percent: '68.0%' },
            { channel: 'Organic Social', sessions: 312, percent: '22.0%' },
            { channel: 'Organic Search', sessions: 143, percent: '10.0%' }
          ],
          devices: [
            { device: 'Desktop', sessions: 781, percent: '55.0%' },
            { device: 'Mobile', sessions: 582, percent: '41.0%' },
            { device: 'Tablet', sessions: 57, percent: '4.0%' }
          ],
          regions: [
            { region: 'India', sessions: 880, percent: '62.0%' },
            { region: 'Canada', sessions: 397, percent: '28.0%' },
            { region: 'United States', sessions: 143, percent: '10.0%' }
          ],
          pages: [
            { path: '/', title: 'Home | Purest Super Greens', pageViews: 1840, sessions: 980 },
            { path: '/product', title: 'Product Details | Morivaná Daily', pageViews: 890, sessions: 420 },
            { path: '/cart', title: 'Shopping Cart', pageViews: 410, sessions: 210 },
            { path: '/checkout', title: 'Secure Checkout', pageViews: 280, sessions: 140 }
          ],
          trend: [
            { date: 'Jun 4', count: 25 },
            { date: 'Jun 5', count: 32 },
            { date: 'Jun 6', count: 28 },
            { date: 'Jun 7', count: 45 },
            { date: 'Jun 8', count: 38 },
            { date: 'Jun 9', count: 52 },
            { date: 'Jun 10', count: 47 },
            { date: 'Jun 11', count: 64 },
            { date: 'Jun 12', count: 58 },
            { date: 'Jun 13', count: 72 }
          ]
        }
    }
  }

  const countryParam = req.query.country || 'all'
  const mockPayload = getMockData(timeframe)

  const adjustAnalyticsPayload = (payload, c) => {
    const key = (c || 'all').toLowerCase()
    if (key === 'all') return payload

    const regions = payload.regions || []
    let filteredRegions = []
    let sessionsFactor = 1.0

    if (key === 'in') {
      filteredRegions = regions.filter(r => r.region.toLowerCase() === 'india')
      const indiaSessions = filteredRegions[0]?.sessions || 880
      const totalSessions = regions.reduce((sum, r) => sum + r.sessions, 0) || 1
      sessionsFactor = indiaSessions / totalSessions
      filteredRegions = filteredRegions.map(r => ({ ...r, percent: '100.0%' }))
    } else if (key === 'ca') {
      filteredRegions = regions.filter(r => r.region.toLowerCase() !== 'india')
      const caSessionsSum = filteredRegions.reduce((sum, r) => sum + r.sessions, 0) || 1
      const totalSessions = regions.reduce((sum, r) => sum + r.sessions, 0) || 1
      sessionsFactor = caSessionsSum / totalSessions
      filteredRegions = filteredRegions.map(r => ({
        ...r,
        percent: `${((r.sessions / caSessionsSum) * 100).toFixed(1)}%`
      }))
    }

    const parseVal = (v) => parseInt((v || '').replace(/[^\d]/g, ''), 10) || 0
    const adjustVal = (v) => Math.round(parseVal(v) * sessionsFactor).toLocaleString()

    const adjustedMetrics = { ...payload.metrics }
    if (adjustedMetrics.sessions) adjustedMetrics.sessions.value = adjustVal(adjustedMetrics.sessions.value)
    if (adjustedMetrics.activeUsers) adjustedMetrics.activeUsers.value = adjustVal(adjustedMetrics.activeUsers.value)
    if (adjustedMetrics.pageViews) adjustedMetrics.pageViews.value = adjustVal(adjustedMetrics.pageViews.value)

    const adjustedTrend = (payload.trend || []).map(t => ({
      ...t,
      count: Math.round(t.count * sessionsFactor)
    }))

    const adjustedChannels = (payload.channels || []).map(ch => ({
      ...ch,
      sessions: Math.round(ch.sessions * sessionsFactor)
    }))
    const totalChSessions = adjustedChannels.reduce((sum, ch) => sum + ch.sessions, 0) || 1
    adjustedChannels.forEach(ch => {
      ch.percent = `${((ch.sessions / totalChSessions) * 100).toFixed(1)}%`
    })

    return {
      ...payload,
      metrics: adjustedMetrics,
      regions: filteredRegions,
      trend: adjustedTrend,
      channels: adjustedChannels
    }
  }

  const adjustedPayload = adjustAnalyticsPayload(mockPayload, countryParam)

  const config = getGA4Config()
  if (!config.configured) {
    return res.json({ ...adjustedPayload, reason: config.reason })
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.keyData.client_email,
        private_key: config.keyData.private_key
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    })
    const authClient = await auth.getClient()

    const analyticsdata = google.analyticsdata({
      version: 'v1beta',
      auth: authClient
    })

    // Resolve date bounds based on timeframe query parameter
    let startDate = '30daysAgo'
    let endDate = 'today'
    let prevStartDate = '60daysAgo'
    let prevEndDate = '31daysAgo'
    let trendDimension = 'date'

    if (timeframe === '30m' || timeframe === '1h' || timeframe === '4h') {
      startDate = 'today'
      endDate = 'today'
      prevStartDate = 'today'
      prevEndDate = 'today'
      trendDimension = timeframe === '30m' ? 'minute' : 'hour'
    } else if (timeframe === '24h') {
      startDate = 'yesterday'
      endDate = 'today'
      prevStartDate = '2daysAgo'
      prevEndDate = 'yesterday'
      trendDimension = 'hour'
    }

    const [currentPeriod, previousPeriod, channelReport, pagesReport, trendReport, devicesReport, regionsReport] = await Promise.all([
      // Current Period totals
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ]
        }
      }),
      // Previous Period totals
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate: prevStartDate, endDate: prevEndDate }],
          metrics: [
            { name: 'sessions' },
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ]
        }
      }),
      // Channels
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }]
        }
      }),
      // Pages
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
          metrics: [{ name: 'screenPageViews' }, { name: 'sessions' }],
          limit: 10
        }
      }),
      // Trend
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: trendDimension }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ dimension: { dimensionName: trendDimension } }]
        }
      }),
      // Devices
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'sessions' }]
        }
      }),
      // Regions/Countries
      analyticsdata.properties.runReport({
        property: `properties/${config.propertyId}`,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'sessions' }],
          limit: 5
        }
      })
    ])

    const getMetricVal = (report, index) => {
      const row = report.data.rows?.[0]
      if (!row || !row.metricValues || !row.metricValues[index]) return 0
      return parseFloat(row.metricValues[index].value || 0)
    }

    const currSessions = getMetricVal(currentPeriod, 0)
    const currUsers = getMetricVal(currentPeriod, 1)
    const currViews = getMetricVal(currentPeriod, 2)
    const currBounce = getMetricVal(currentPeriod, 3)
    const currDuration = getMetricVal(currentPeriod, 4)

    const prevSessions = getMetricVal(previousPeriod, 0)
    const prevUsers = getMetricVal(previousPeriod, 1)
    const prevViews = getMetricVal(previousPeriod, 2)
    const prevBounce = getMetricVal(previousPeriod, 3)
    const prevDuration = getMetricVal(previousPeriod, 4)

    const calculateDelta = (curr, prev) => {
      if (!prev) return '+0.0%'
      const pct = ((curr - prev) / prev) * 100
      const sign = pct >= 0 ? '+' : ''
      return `${sign}${pct.toFixed(1)}%`
    }

    const formatBounceRate = (val) => {
      const floatVal = parseFloat(val)
      if (isNaN(floatVal)) return '0.0%'
      if (floatVal <= 1.0) return `${(floatVal * 100).toFixed(1)}%`
      return `${floatVal.toFixed(1)}%`
    }

    const formatDuration = (seconds) => {
      const floatSec = parseFloat(seconds)
      if (isNaN(floatSec) || floatSec <= 0) return '0s'
      const m = Math.floor(floatSec / 60)
      const s = Math.round(floatSec % 60)
      return m > 0 ? `${m}m ${s}s` : `${s}s`
    }

    const channelsData = (channelReport.data.rows || []).map(row => {
      const channel = row.dimensionValues?.[0]?.value || 'Direct'
      const sessions = parseInt(row.metricValues?.[0]?.value || 0, 10)
      return { channel, sessions }
    })

    const totalChannelSessions = channelsData.reduce((sum, c) => sum + c.sessions, 0)
    const channels = channelsData.map(c => ({
      ...c,
      percent: totalChannelSessions > 0 ? `${((c.sessions / totalChannelSessions) * 100).toFixed(1)}%` : '0%'
    }))

    const devicesData = (devicesReport.data.rows || []).map(row => {
      const device = row.dimensionValues?.[0]?.value || 'Desktop'
      const sessions = parseInt(row.metricValues?.[0]?.value || 0, 10)
      return { device, sessions }
    })
    const totalDeviceSessions = devicesData.reduce((sum, d) => sum + d.sessions, 0)
    const devices = devicesData.map(d => ({
      ...d,
      percent: totalDeviceSessions > 0 ? `${((d.sessions / totalDeviceSessions) * 100).toFixed(1)}%` : '0%'
    }))

    const regionsData = (regionsReport.data.rows || []).map(row => {
      const region = row.dimensionValues?.[0]?.value || 'Global'
      const sessions = parseInt(row.metricValues?.[0]?.value || 0, 10)
      return { region, sessions }
    })
    const totalRegionSessions = regionsData.reduce((sum, r) => sum + r.sessions, 0)
    const regions = regionsData.map(r => ({
      ...r,
      percent: totalRegionSessions > 0 ? `${((r.sessions / totalRegionSessions) * 100).toFixed(1)}%` : '0%'
    }))

    const pages = (pagesReport.data.rows || []).map(row => {
      const path = row.dimensionValues?.[0]?.value || '/'
      const title = row.dimensionValues?.[1]?.value || ''
      const pageViews = parseInt(row.metricValues?.[0]?.value || 0, 10)
      const sessions = parseInt(row.metricValues?.[1]?.value || 0, 10)
      return { path, title, pageViews, sessions }
    })

    const trend = (trendReport.data.rows || []).map(row => {
      const rawDim = row.dimensionValues?.[0]?.value || ''
      let formattedDate = rawDim
      if (trendDimension === 'date' && rawDim.length === 8) {
        const y = rawDim.slice(0, 4)
        const m = parseInt(rawDim.slice(4, 6), 10) - 1
        const d = parseInt(rawDim.slice(6, 8), 10)
        const dateObj = new Date(y, m, d)
        formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } else if (trendDimension === 'hour') {
        formattedDate = `${rawDim}:00`
      } else if (trendDimension === 'minute') {
        formattedDate = `T-${30 - parseInt(rawDim, 10)}m`
      }
      const count = parseInt(row.metricValues?.[0]?.value || 0, 10)
      return { date: formattedDate, count }
    })

    const deltaLabel = 
      timeframe === '30m' ? 'vs previous 30m' :
      timeframe === '1h' ? 'vs previous 1h' :
      timeframe === '4h' ? 'vs previous 4h' :
      timeframe === '24h' ? 'vs yesterday' : 'vs last 30d'

    return res.json({
      configured: true,
      metrics: {
        sessions: { value: currSessions.toLocaleString(), delta: calculateDelta(currSessions, prevSessions), label: deltaLabel },
        activeUsers: { value: currUsers.toLocaleString(), delta: calculateDelta(currUsers, prevUsers), label: deltaLabel },
        pageViews: { value: currViews.toLocaleString(), delta: calculateDelta(currViews, prevViews), label: deltaLabel },
        bounceRate: { value: formatBounceRate(currBounce), delta: calculateDelta(currBounce, prevBounce), label: deltaLabel },
        avgSessionDuration: { value: formatDuration(currDuration), delta: calculateDelta(currDuration, prevDuration), label: deltaLabel }
      },
      channels,
      devices,
      regions,
      pages,
      trend
    })
  } catch (err) {
    console.error('Google Analytics Data API Error:', err)
    return res.json({
      ...mockPayload,
      configured: true,
      fallback: true,
      error: err.message || 'Unknown Google Analytics Data API error'
    })
  }
})

app.get('/api/admin/customers', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    
    const mockCustomers = [
      { _id: 'mock-sub-4', name: 'Devang', email: 'devangdhakate22@gmail.com', region: 'CANADA', orders: 0, ltv: '$0.00 CAD', signout: 'Jun 12' },
      { _id: 'mock-sub-1', name: 'Nia', email: 'nia878982@gmail.com', region: 'INDIA', orders: 1, ltv: '₹799 INR', signout: 'Jun 10' },
      { _id: 'mock-sub-2', name: 'Junaid Jalal', email: 'sunjalal6000@gmail.com', region: 'CANADA', orders: 2, ltv: '$25.20 CAD', signout: 'Jun 10' },
      { _id: 'mock-sub-3', name: 'Ameera Jalal', email: 'jalalameera60@gmail.com', region: 'INDIA', orders: 1, ltv: '₹799 INR', signout: 'Jun 10' },
      { _id: 'mock-sub-5', name: 'test_user_gmail_api_new', email: 'test_user_gmail_api_new@example.com', region: 'CANADA', orders: 0, ltv: '$0.00 CAD', signout: 'Jun 9' },
      { _id: 'mock-sub-6', name: 'test_user_gmail_api', email: 'test_user_gmail_api@example.com', region: 'INDIA', orders: 0, ltv: '₹0 INR', signout: 'Jun 9' }
    ]

    if (!isDbConnected || !waitlist) {
      const filtered = mockCustomers.filter(c => isMatchCountry(c.region, countryParam))
      return res.json(filtered)
    }

    const filter = getCountryFilter(countryParam)
    const [list, allDeliveries, allOrders] = await Promise.all([
      waitlist.find(filter).sort({ createdAt: -1 }).toArray(),
      deliveries.find({ status: 'Delivered' }).toArray(),
      orders ? orders.find().toArray() : Promise.resolve(ordersList)
    ])

    const formatted = list.map(sub => {
      const subName = (sub.name || sub.email.split('@')[0] || '').toLowerCase().trim()
      const subEmail = sub.email.toLowerCase().trim()

      const customerOrders = allOrders.filter(o => {
        const orderEmail = (o.email || '').toLowerCase().trim()
        const orderCustomer = (o.customer || '').toLowerCase().trim()
        return orderEmail === subEmail || (subName && orderCustomer === subName)
      })

      const ordersCompleted = customerOrders.filter(o => o.orderStatus === 'Delivered').length
      
      const subRegion = (sub.region || 'GLOBAL').toUpperCase()
      const isIndia = subRegion === 'INDIA' || subRegion === 'IN'

      let ltvVal = '₹0 INR'
      if (isIndia) {
        const totalLtvINR = customerOrders
          .filter(o => o.paymentStatus === 'Settled')
          .reduce((sum, o) => {
            const clean = (o.total || '').replace(/[^\d]/g, '')
            return sum + (parseInt(clean, 10) || 0)
          }, 0)
        ltvVal = `₹${totalLtvINR.toLocaleString('en-IN')} INR`
      } else {
        const totalLtvCAD = customerOrders
          .filter(o => o.paymentStatus === 'Settled')
          .reduce((sum, o) => {
            const clean = (o.usd || '').replace(/[^\d\.]/g, '')
            return sum + (parseFloat(clean) || 0)
          }, 0)
        ltvVal = `$${totalLtvCAD.toFixed(2)} CAD`
      }

      const dateStr = sub.createdAt
        ? new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—'

      return {
        _id: sub._id,
        name: sub.name || sub.email.split('@')[0] || 'Subscriber',
        email: sub.email,
        region: isIndia ? 'INDIA' : 'CANADA',
        orders: ordersCompleted,
        ltv: ltvVal,
        signout: dateStr
      }
    })
    return res.json(formatted)
  } catch (err) {
    next(err)
  }
})

// ── Upgrade Admin Endpoints ──────────────────────────────────────────────────

// GET Admin Orders
app.get('/api/admin/orders', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !orders) {
      const filtered = ordersList.filter(o => isMatchCountry(o.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await orders.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST Create Admin Order
app.post('/api/admin/orders', adminAuth, async (req, res, next) => {
  try {
    const { orderId, customer, email, items, total, usd, paymentStatus, orderStatus } = req.body
    const newOrder = {
      orderId: orderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customer || 'Anonymous',
      email: email || 'customer@example.com',
      items: items || [],
      total: total || '₹0',
      usd: usd || '$0.00',
      paymentStatus: paymentStatus || 'Pending',
      orderStatus: orderStatus || 'Processing',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      createdAt: new Date()
    }
    if (!isDbConnected || !orders) {
      newOrder._id = `mock-ord-${Date.now()}`
      ordersList.unshift(newOrder)
      return res.json({ ok: true, order: newOrder })
    }
    const result = await orders.insertOne(newOrder)
    newOrder._id = result.insertedId
    return res.json({ ok: true, order: newOrder })
  } catch (err) {
    next(err)
  }
})

// PUT Update Admin Order
app.put('/api/admin/orders/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body
    delete updateData._id

    if (!isDbConnected || !orders) {
      const idx = ordersList.findIndex(o => o._id === id || o.orderId === id)
      if (idx === -1) return res.status(404).json({ error: 'Order not found' })
      ordersList[idx] = { ...ordersList[idx], ...updateData }
      return res.json({ ok: true, order: ordersList[idx] })
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { orderId: id }
    const result = await orders.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!result) return res.status(404).json({ error: 'Order not found' })
    return res.json({ ok: true, order: result })
  } catch (err) {
    next(err)
  }
})

// GET Admin Support Tickets
app.get('/api/admin/tickets', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !tickets) {
      const filtered = ticketsList.filter(t => isMatchCountry(t.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await tickets.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST Create Support Ticket
app.post('/api/admin/tickets', adminAuth, async (req, res, next) => {
  try {
    const { customer, email, orderId, subject, priority } = req.body
    const newTicket = {
      ticketId: `TCK-${Math.floor(100 + Math.random() * 900)}`,
      customer: customer || 'Guest',
      email: email || '',
      orderId: orderId || '',
      subject: subject || 'No Subject',
      priority: priority || 'Low',
      status: 'Open',
      replies: [],
      createdAt: new Date()
    }
    if (!isDbConnected || !tickets) {
      newTicket._id = `mock-tck-${Date.now()}`
      ticketsList.unshift(newTicket)
      return res.json({ ok: true, ticket: newTicket })
    }
    const result = await tickets.insertOne(newTicket)
    newTicket._id = result.insertedId
    return res.json({ ok: true, ticket: newTicket })
  } catch (err) {
    next(err)
  }
})

// PUT Update Ticket
app.put('/api/admin/tickets/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body
    delete updateData._id

    if (!isDbConnected || !tickets) {
      const idx = ticketsList.findIndex(t => t._id === id || t.ticketId === id)
      if (idx === -1) return res.status(404).json({ error: 'Ticket not found' })
      ticketsList[idx] = { ...ticketsList[idx], ...updateData }
      return res.json({ ok: true, ticket: ticketsList[idx] })
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { ticketId: id }
    const result = await tickets.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!result) return res.status(404).json({ error: 'Ticket not found' })
    return res.json({ ok: true, ticket: result })
  } catch (err) {
    next(err)
  }
})

// POST Ticket reply
app.post('/api/admin/tickets/:id/replies', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { sender, text } = req.body
    if (!sender || !text) return res.status(400).json({ error: 'Sender and text are required' })

    const newReply = { sender, text, timestamp: new Date() }

    if (!isDbConnected || !tickets) {
      const idx = ticketsList.findIndex(t => t._id === id || t.ticketId === id)
      if (idx === -1) return res.status(404).json({ error: 'Ticket not found' })
      ticketsList[idx].replies.push(newReply)
      return res.json({ ok: true, ticket: ticketsList[idx] })
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { ticketId: id }
    const result = await tickets.findOneAndUpdate(
      query,
      { $push: { replies: newReply } },
      { returnDocument: 'after' }
    )
    if (!result) return res.status(404).json({ error: 'Ticket not found' })
    return res.json({ ok: true, ticket: result })
  } catch (err) {
    next(err)
  }
})

// GET Admin Coupons
app.get('/api/admin/coupons', adminAuth, async (req, res, next) => {
  try {
    if (!isDbConnected || !coupons) {
      return res.json(couponsList)
    }
    const list = await coupons.find().sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

// POST Create Coupon
app.post('/api/admin/coupons', adminAuth, async (req, res, next) => {
  try {
    const { code, type, value, expiryDate, maxUses } = req.body
    if (!code || !type || value === undefined) {
      return res.status(400).json({ error: 'Code, type, and value are required.' })
    }
    const upperCode = code.toUpperCase().trim()
    const newCoupon = {
      code: upperCode,
      type,
      value: parseFloat(value),
      expiryDate: expiryDate || '',
      usedCount: 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : 100,
      status: 'Active',
      createdAt: new Date()
    }
    if (!isDbConnected || !coupons) {
      if (couponsList.some(c => c.code === upperCode)) {
        return res.status(400).json({ error: 'Coupon code already exists.' })
      }
      newCoupon._id = `mock-cpn-${Date.now()}`
      couponsList.unshift(newCoupon)
      return res.json({ ok: true, coupon: newCoupon })
    }
    const existing = await coupons.findOne({ code: upperCode })
    if (existing) {
      return res.status(400).json({ error: 'Coupon code already exists.' })
    }
    const result = await coupons.insertOne(newCoupon)
    newCoupon._id = result.insertedId
    return res.json({ ok: true, coupon: newCoupon })
  } catch (err) {
    next(err)
  }
})

// PUT Update Coupon
app.put('/api/admin/coupons/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body
    delete updateData._id

    if (!isDbConnected || !coupons) {
      const idx = couponsList.findIndex(c => c._id === id || c.code === id)
      if (idx === -1) return res.status(404).json({ error: 'Coupon not found' })
      couponsList[idx] = { ...couponsList[idx], ...updateData }
      return res.json({ ok: true, coupon: couponsList[idx] })
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { code: id }
    const result = await coupons.findOneAndUpdate(
      query,
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (!result) return res.status(404).json({ error: 'Coupon not found' })
    return res.json({ ok: true, coupon: result })
  } catch (err) {
    next(err)
  }
})

// DELETE Coupon
app.delete('/api/admin/coupons/:id', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    if (!isDbConnected || !coupons) {
      const idx = couponsList.findIndex(c => c._id === id || c.code === id)
      if (idx === -1) return res.status(404).json({ error: 'Coupon not found' })
      couponsList.splice(idx, 1)
      return res.json({ ok: true })
    }
    const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { code: id }
    const result = await coupons.deleteOne(query)
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Coupon not found' })
    return res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

// GET Settings
app.get('/api/admin/settings', adminAuth, async (req, res, next) => {
  try {
    if (!isDbConnected || !storeSettings) {
      return res.json(storeSettingsData)
    }
    const settings = await storeSettings.findOne()
    return res.json(settings || storeSettingsData)
  } catch (err) {
    next(err)
  }
})

// PUT Settings
app.put('/api/admin/settings', adminAuth, async (req, res, next) => {
  try {
    const updateData = req.body
    delete updateData._id

    if (!isDbConnected || !storeSettings) {
      storeSettingsData = { ...storeSettingsData, ...updateData }
      return res.json({ ok: true, settings: storeSettingsData })
    }
    const settings = await storeSettings.findOne()
    let result
    if (settings) {
      result = await storeSettings.findOneAndUpdate(
        { _id: settings._id },
        { $set: updateData },
        { returnDocument: 'after' }
      )
    } else {
      const insertRes = await storeSettings.insertOne(updateData)
      result = { _id: insertRes.insertedId, ...updateData }
    }
    return res.json({ ok: true, settings: result })
  } catch (err) {
    next(err)
  }
})

// Bulk Inventory CSV Importer
app.post('/api/admin/inventory/bulk', adminAuth, async (req, res, next) => {
  try {
    const { items } = req.body
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' })
    }

    const parsedItems = items.map(item => ({
      name: item.name || `Variant ${item.sku}`,
      sku: (item.sku || '').trim().toUpperCase(),
      price: parseFloat(item.price || 0),
      currency: item.currency || 'INR',
      priceUSD: item.priceUSD ? parseFloat(item.priceUSD) : Math.round(parseFloat(item.price || 0) / 24),
      stock: parseInt(item.stock || 0, 10),
      status: parseInt(item.stock || 0, 10) > 0 ? 'In Stock' : 'Out of Stock',
      createdAt: new Date()
    })).filter(item => item.sku)

    if (!isDbConnected || !products) {
      parsedItems.forEach(newItem => {
        const idx = fallbackProductsList.findIndex(p => p.sku === newItem.sku)
        if (idx !== -1) {
          fallbackProductsList[idx] = { ...fallbackProductsList[idx], ...newItem, _id: fallbackProductsList[idx]._id }
        } else {
          newItem._id = `mock-prod-${Date.now()}-${Math.random()}`
          fallbackProductsList.push(newItem)
        }
      })
      return res.json({ ok: true, count: parsedItems.length })
    }

    const ops = parsedItems.map(item => ({
      updateOne: {
        filter: { sku: item.sku },
        update: { $set: item },
        upsert: true
      }
    }))
    await products.bulkWrite(ops)
    return res.json({ ok: true, count: parsedItems.length })
  } catch (err) {
    next(err)
  }
})


// ── EMAIL / NOTIFICATION LOGS ENDPOINTS ──────────────────────────────────────
app.get('/api/admin/email-logs', adminAuth, async (req, res, next) => {
  try {
    if (!isDbConnected || !emailLogs) {
      return res.json(emailLogsList)
    }
    const list = await emailLogs.find().sort({ sentAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

app.post('/api/admin/email-logs/:id/resend', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    let log = null
    let idx = -1

    if (!isDbConnected || !emailLogs) {
      idx = emailLogsList.findIndex(l => l._id === id)
      if (idx === -1) return res.status(404).json({ error: 'Email log not found.' })
      log = emailLogsList[idx]
    } else {
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      log = await emailLogs.findOne(query)
      if (!log) return res.status(404).json({ error: 'Email log not found.' })
    }

    // Attempt email sending
    let status = 'Sent'
    let errorMsg = null
    try {
      await sendEmailRaw({
        to: log.email,
        subject: log.subject,
        html: log.body,
        text: log.body.replace(/<[^>]*>/g, '') // strip HTML tags for text body fallback
      })
    } catch (err) {
      status = 'Failed'
      errorMsg = err.message || 'SMTP Connection Timeout'
    }

    const updatedFields = {
      status,
      error: errorMsg,
      sentAt: new Date(),
      attempts: (log.attempts || 0) + 1
    }

    if (!isDbConnected || !emailLogs) {
      emailLogsList[idx] = { ...log, ...updatedFields }
      log = emailLogsList[idx]
    } else {
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      await emailLogs.updateOne(query, { $set: updatedFields })
      log = await emailLogs.findOne(query)
    }

    return res.json({ ok: true, log })
  } catch (err) {
    next(err)
  }
})

// ── CUSTOMER REVIEWS ENDPOINTS ───────────────────────────────────────────────
app.get('/api/admin/reviews', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !reviews) {
      const filtered = reviewsList.filter(r => isMatchCountry(r.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await reviews.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

app.put('/api/admin/reviews/:id/status', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' })
    }

    let review = null
    if (!isDbConnected || !reviews) {
      const idx = reviewsList.findIndex(r => r._id === id)
      if (idx === -1) return res.status(404).json({ error: 'Review not found.' })
      reviewsList[idx].status = status
      review = reviewsList[idx]
    } else {
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      const result = await reviews.findOneAndUpdate(
        query,
        { $set: { status } },
        { returnDocument: 'after' }
      )
      if (!result) return res.status(404).json({ error: 'Review not found.' })
      review = result
    }

    return res.json({ ok: true, review })
  } catch (err) {
    next(err)
  }
})

app.post('/api/admin/reviews/:id/reply', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const { reply } = req.body

    let review = null
    if (!isDbConnected || !reviews) {
      const idx = reviewsList.findIndex(r => r._id === id)
      if (idx === -1) return res.status(404).json({ error: 'Review not found.' })
      reviewsList[idx].reply = reply || null
      review = reviewsList[idx]
    } else {
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      const result = await reviews.findOneAndUpdate(
        query,
        { $set: { reply: reply || null } },
        { returnDocument: 'after' }
      )
      if (!result) return res.status(404).json({ error: 'Review not found.' })
      review = result
    }

    return res.json({ ok: true, review })
  } catch (err) {
    next(err)
  }
})

// ── ABANDONED CHECKOUTS ENDPOINTS ──────────────────────────────────────────
app.get('/api/admin/abandoned-checkouts', adminAuth, async (req, res, next) => {
  try {
    const countryParam = req.query.country || 'all'
    if (!isDbConnected || !abandonedCheckouts) {
      const filtered = abandonedCheckoutsList.filter(a => isMatchCountry(a.region, countryParam))
      return res.json(filtered)
    }
    const filter = getCountryFilter(countryParam)
    const list = await abandonedCheckouts.find(filter).sort({ createdAt: -1 }).toArray()
    return res.json(list)
  } catch (err) {
    next(err)
  }
})

app.post('/api/admin/abandoned-checkouts/:id/remind', adminAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    let checkout = null
    let idx = -1

    if (!isDbConnected || !abandonedCheckouts) {
      idx = abandonedCheckoutsList.findIndex(c => c._id === id)
      if (idx === -1) return res.status(404).json({ error: 'Checkout record not found.' })
      checkout = abandonedCheckoutsList[idx]
    } else {
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      checkout = await abandonedCheckouts.findOne(query)
      if (!checkout) return res.status(404).json({ error: 'Checkout record not found.' })
    }

    const customerSubject = `Complete your Morivaná purchase`
    const customerText = `Hi ${checkout.customer || 'there'},\n\nWe noticed you left some items in your cart. Complete your purchase now at Morivaná.\n\nBest,\nThe Morivaná Team`
    const customerHtml = `
      <div style="font-family: sans-serif; padding: 30px; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #EAEAEA; border-radius: 12px; background-color: #FAFAFA; color: #1E293B;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1C3A1C; font-size: 28px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">Morivaná Daily</h1>
          <div style="height: 3px; width: 60px; background-color: #C8D96A; margin: 12px auto 0;"></div>
        </div>
        
        <p style="font-size: 16px; margin-top: 0;">Hi ${checkout.customer || 'there'},</p>
        
        <p style="font-size: 16px;">We noticed you left some items in your shopping cart. Complete your order to lock in your pure super greens!</p>
        
        <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; border: 1px solid #E2E8F0; margin: 24px 0;">
          <h3 style="color: #1C3A1C; margin-top: 0; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Items Left in Your Cart</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${(checkout.cartItems || []).map(item => `
              <tr style="border-bottom: 1px solid #F1F5F9;">
                <td style="padding: 10px 0; color: #0F172A; font-weight: 500;">${item.name} (Qty: ${item.qty})</td>
                <td style="padding: 10px 0; color: #64748B; text-align: right;">₹${item.price}</td>
              </tr>
            `).join('')}
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #0F172A;">Total Value:</td>
              <td style="padding: 10px 0; font-weight: bold; color: #0F172A; text-align: right;">${checkout.total}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 16px; text-align: center; margin: 30px 0;">
          <a href="${process.env.ALLOWED_ORIGIN || 'http://localhost:5173'}/checkout" style="background-color: #1C3A1C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Complete Your Order</a>
        </p>
        
        <p style="font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1C3A1C;">The Morivaná Team</strong></p>
      </div>
    `

    // Attempt to send checkout reminder email
    try {
      await sendEmailRaw({
        to: checkout.email,
        subject: customerSubject,
        text: customerText,
        html: customerHtml
      })
    } catch (emailErr) {
      console.error(`Failed to send reminder email to ${checkout.email}:`, emailErr)
    }

    // Always log this email transaction under Email Logs
    const newLog = {
      orderId: null,
      customer: checkout.customer || 'Guest',
      email: checkout.email,
      type: 'abandoned_cart_reminder',
      subject: customerSubject,
      sentAt: new Date(),
      status: 'Sent',
      error: null,
      body: customerHtml,
      attempts: 1
    }

    if (!isDbConnected || !emailLogs) {
      newLog._id = `mock-email-${Date.now()}`
      emailLogsList.push(newLog)
      
      abandonedCheckoutsList[idx].reminderSent = true
      abandonedCheckoutsList[idx].reminderSentAt = new Date()
      checkout = abandonedCheckoutsList[idx]
    } else {
      await emailLogs.insertOne(newLog)
      
      const { ObjectId } = await import('mongodb')
      const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id }
      await abandonedCheckouts.updateOne(query, {
        $set: { reminderSent: true, reminderSentAt: new Date() }
      })
      checkout = await abandonedCheckouts.findOne(query)
    }

    return res.json({ ok: true, checkout })
  } catch (err) {
    next(err)
  }
})


app.get('/', (_req, res) => res.json({ ok: true, message: 'Morivaná API is running', env: NODE_ENV }))
app.get('/api/health', (_req, res) => res.json({ ok: true, env: NODE_ENV }))

// ── Error Handler (must be last) ─────────────────────────────────────────────
app.use(errorHandler)

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Morivana API listening on http://localhost:${PORT} (${NODE_ENV || 'development'})`)
  startTokenRefreshScheduler()
})

