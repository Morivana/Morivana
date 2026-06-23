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

// ─── Public Schemas ───────────────────────────────────────────────────────────

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

// ─── Admin Schemas ────────────────────────────────────────────────────────────

// Admin bypass login
export const adminBypassLoginSchema = z.object({
  body: z.object({
    passcode: z.string().min(1).max(128),
  }),
})

// Admin inventory — create/update product
export const adminInventorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    sku: z.string().min(1).max(50).regex(/^[A-Za-z0-9\-_]+$/, 'SKU must be alphanumeric with hyphens/underscores'),
    price: z.number().min(0).max(1000000),
    stock: z.number().int().min(0).max(1000000),
    currency: z.enum(['INR', 'USD', 'CAD']).optional(),
    priceUSD: z.number().min(0).max(1000000).optional(),
  }),
})

// Admin inventory update — partial (all fields optional)
export const adminInventoryUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    sku: z.string().min(1).max(50).regex(/^[A-Za-z0-9\-_]+$/, 'SKU must be alphanumeric').optional(),
    price: z.number().min(0).max(1000000).optional(),
    stock: z.number().int().min(0).max(1000000).optional(),
    currency: z.enum(['INR', 'USD', 'CAD']).optional(),
    priceUSD: z.number().min(0).max(1000000).optional(),
  }),
})

// Admin order — create
export const adminOrderSchema = z.object({
  body: z.object({
    orderId: z.string().max(50).optional(),
    customer: z.string().max(200).optional(),
    email: z.string().email().max(254).optional(),
    items: z.array(z.object({
      sku: z.string().max(50).optional(),
      name: z.string().max(200).optional(),
      qty: z.number().int().min(1).max(1000).optional(),
      price: z.number().min(0).max(1000000).optional(),
    })).optional(),
    total: z.string().max(50).optional(),
    usd: z.string().max(50).optional(),
    paymentStatus: z.enum(['Pending', 'Settled', 'Failed', 'Refunded']).optional(),
    orderStatus: z.enum(['Processing', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    region: z.string().max(50).optional(),
  }),
})

// Admin order — update (allowlisted fields only)
export const adminOrderUpdateSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['Pending', 'Settled', 'Failed', 'Refunded']).optional(),
    orderStatus: z.enum(['Processing', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    customer: z.string().max(200).optional(),
    email: z.string().email().max(254).optional(),
    total: z.string().max(50).optional(),
    usd: z.string().max(50).optional(),
    method: z.string().max(50).optional(),
  }),
})

// Admin ticket — create
export const adminTicketSchema = z.object({
  body: z.object({
    customer: z.string().max(200).optional(),
    email: z.string().email().max(254).optional(),
    orderId: z.string().max(50).optional(),
    subject: z.string().min(1).max(500),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  }),
})

// Admin ticket — update (allowlisted fields only)
export const adminTicketUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['Open', 'In Progress', 'Resolved', 'Closed']).optional(),
    priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
    subject: z.string().min(1).max(500).optional(),
  }),
})

// Admin ticket reply
export const adminTicketReplySchema = z.object({
  body: z.object({
    sender: z.string().min(1).max(200),
    text: z.string().min(1).max(5000),
  }),
})

// Admin coupon — create
export const adminCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(50).regex(/^[A-Za-z0-9\-_]+$/, 'Code must be alphanumeric'),
    type: z.enum(['Percentage', 'Fixed']),
    value: z.number().min(0).max(100000),
    expiryDate: z.string().max(50).optional(),
    maxUses: z.number().int().min(1).max(1000000).optional(),
    status: z.enum(['Active', 'Paused', 'Expired']).optional(),
  }),
})

// Admin coupon — update (allowlisted fields only)
export const adminCouponUpdateSchema = z.object({
  body: z.object({
    code: z.string().min(1).max(50).regex(/^[A-Za-z0-9\-_]+$/).optional(),
    type: z.enum(['Percentage', 'Fixed']).optional(),
    value: z.number().min(0).max(100000).optional(),
    expiryDate: z.string().max(50).optional(),
    maxUses: z.number().int().min(1).max(1000000).optional(),
    status: z.enum(['Active', 'Paused', 'Expired']).optional(),
    usedCount: z.number().int().min(0).optional(),
  }),
})

// Admin delivery — update
export const adminDeliveryUpdateSchema = z.object({
  body: z.object({
    carrier: z.string().max(100).optional(),
    tracking: z.string().max(100).optional(),
    status: z.enum(['Processing', 'Packed', 'Shipped', 'In transit', 'Out for Delivery', 'Delivered', 'Returned']).optional(),
    date: z.string().max(50).optional(),
  }),
})

// Admin payment — update status
export const adminPaymentUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Settled', 'Failed', 'Refunded']),
  }),
})

// Admin return — update status
export const adminReturnUpdateSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected', 'Refunded', 'Returned']),
  }),
})

// Admin review — update status
export const adminReviewStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Pending', 'Approved', 'Rejected']),
  }),
})

// Admin review — reply
export const adminReviewReplySchema = z.object({
  body: z.object({
    reply: z.string().min(1).max(2000),
  }),
})

// Admin settings — update (allowlisted fields)
export const adminSettingsSchema = z.object({
  body: z.object({
    storeName: z.string().max(200).optional(),
    supportEmail: z.string().email().max(254).optional(),
    phone: z.string().max(30).optional(),
    currency: z.enum(['INR', 'USD', 'CAD']).optional(),
    taxPercent: z.number().min(0).max(100).optional(),
    lowStockThreshold: z.number().int().min(0).max(10000).optional(),
    emailTemplates: z.object({
      orderConfirmation: z.string().max(5000).optional(),
      orderShipped: z.string().max(5000).optional(),
    }).optional(),
    webhooks: z.array(z.object({
      url: z.string().url().max(500),
      events: z.array(z.string().max(100)),
    })).max(10).optional(),
    delhiveryApiKey: z.string().max(200).optional(),
    delhiveryClientName: z.string().max(200).optional(),
    delhiveryPickupLocationName: z.string().max(200).optional(),
    delhiveryMode: z.enum(['staging', 'production']).optional(),
    delhiveryPickupAddress: z.string().max(500).optional(),
    delhiveryPickupCity: z.string().max(100).optional(),
    delhiveryPickupState: z.string().max(100).optional(),
    delhiveryPickupPin: z.string().max(20).optional(),
    delhiveryPickupPhone: z.string().max(20).optional(),
    razorpayKeyId: z.string().max(200).optional(),
    razorpayKeySecret: z.string().max(200).optional(),
    razorpayMode: z.enum(['staging', 'production']).optional(),
    razorpayActive: z.boolean().optional(),
    razorpayWebhookSecret: z.string().max(200).optional(),
  }),
})
