// Global error handler — must be registered LAST in server/index.js
// Usage: app.use(errorHandler)

export const errorHandler = (err, req, res, next) => {
  // Log full error internally
  console.error(`[ERROR] ${req.method} ${req.path}`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : '[hidden in production]',
    userId: req.auth?.userId || 'anonymous',
    ip: req.ip,
  })

  // Mongoose validation error (just in case it's used in the future)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message),
    })
  }

  // Mongoose/MongoDB duplicate key error
  if (err.code === 11000) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'record'
    return res.status(409).json({ error: `${field} already exists` })
  }

  // JWT / Clerk auth errors
  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Generic — never expose internals in production
  const statusCode = err.status || err.statusCode || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong. Please try again.'
    : err.message

  res.status(statusCode).json({ error: message })
}
