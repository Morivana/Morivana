import express from 'express'
import Stripe from 'stripe'

const router = express.Router()
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// IMPORTANT: this route must use express.raw() body parser
// That is registered in server/index.js BEFORE express.json()
// Do not add express.json() middleware on this route

router.post('/stripe', async (req, res) => {
  if (!stripe || !webhookSecret) {
    console.warn('[WEBHOOK] Stripe is not configured, mocking response')
    return res.json({ received: true, mocked: true })
  }

  const sig = req.headers['stripe-signature']

  if (!sig) {
    console.warn('[WEBHOOK] Missing Stripe signature')
    return res.status(400).send('Missing signature')
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error(`[WEBHOOK] Signature verification failed: ${err.message}`)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Process event types
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        await handleCheckoutCompleted(session)
        break
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object
        await handlePaymentFailed(intent)
        break
      }
      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (err) {
    console.error(`[WEBHOOK] Handler error for ${event.type}: ${err.message}`)
    // Return 200 to prevent Stripe from retrying — log separately for investigation
    res.json({ received: true })
  }
})

async function handleCheckoutCompleted(session) {
  // Fulfillment logic goes here
}

async function handlePaymentFailed(intent) {
  // Payment failure logic goes here
}

export default router
