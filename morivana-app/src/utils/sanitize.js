// Prevent stored XSS in displayed user content
export function sanitizeDisplay(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .slice(0, 1000) // cap length
}

// Sanitize before sending to API
export function sanitizeInput(str) {
  if (typeof str !== 'string') return ''
  return str.trim().slice(0, 500)
}
