import { useAuth, useUser } from '@clerk/react'

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const BASE_URL = isLocal ? '' : (import.meta.env.VITE_API_URL || '')

// Central fetch wrapper with auth + security
async function apiFetch(endpoint, options = {}, getToken, userContext) {
  const url = `${BASE_URL}${endpoint}`

  // Support local passcode-based secret admin bypass token ONLY on admin routes
  const isAdminRoute = endpoint.startsWith('/api/admin')
  const bypassToken = isAdminRoute && typeof window !== 'undefined' ? localStorage.getItem('admin_bypass_token') : null
  const token = bypassToken || (getToken ? await getToken() : null)

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(userContext && {
        'x-user-email': userContext.email,
        'x-user-name': userContext.fullName,
        'x-user-id': userContext.id
      }),
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  // Handle HTTP errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Hook for use in React components
export function useApi() {
  const { getToken } = useAuth()
  const { user } = useUser()

  const userContext = user ? {
    email: user.primaryEmailAddress?.emailAddress,
    fullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.primaryEmailAddress?.emailAddress,
    id: user.id
  } : null

  return {
    get: (endpoint) => apiFetch(endpoint, { method: 'GET' }, getToken, userContext),
    post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }, getToken, userContext),
    put: (endpoint, body) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body) }, getToken, userContext),
    patch: (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, getToken, userContext),
    delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }, getToken, userContext),
  }
}

// For use outside React components (e.g. public endpoints)
export const publicApi = {
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }, null),
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }, null),
}
