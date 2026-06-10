import { z } from 'zod'

// Generic validation middleware factory
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })
    next()
  } catch (err) {
    const errors = err.errors?.map(e => ({ field: e.path.join('.'), message: e.message }))
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const waitlistSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').max(254),
    name: z.string().min(1).max(100).optional(),
    country: z.enum(['IN', 'CA']).optional(),
    region: z.string().optional(),
    source: z.string().optional(),
    confirm_email: z.string().optional(),
    turnstileToken: z.string().optional(),
  }),
})

export const orderSchema = z.object({
  body: z.object({
    productId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(10),
    shippingAddress: z.object({
      line1: z.string().min(1).max(200),
      line2: z.string().max(200).optional(),
      city: z.string().min(1).max(100),
      state: z.string().min(1).max(100),
      postalCode: z.string().min(1).max(20),
      country: z.enum(['IN', 'CA']),
    }),
  }),
})

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email().max(254),
    message: z.string().min(10).max(2000),
  }),
})
