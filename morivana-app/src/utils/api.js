import { useAuth } from '@clerk/clerk-react'

const BASE_URL = import.meta.env.VITE_API_URL || ''

// Central fetch wrapper with auth + security
async function apiFetch(endpoint, options = {}, getToken) {
  const url = `${BASE_URL}${endpoint}`

  // Always get a fresh Clerk token for authenticated requests
  const token = getToken ? await getToken() : null

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
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

  return {
    get: (endpoint) => apiFetch(endpoint, { method: 'GET' }, getToken),
    post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }, getToken),
    patch: (endpoint, body) => apiFetch(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, getToken),
    delete: (endpoint) => apiFetch(endpoint, { method: 'DELETE' }, getToken),
  }
}

// For use outside React components (e.g. public endpoints)
export const publicApi = {
  post: (endpoint, body) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body) }, null),
  get: (endpoint) => apiFetch(endpoint, { method: 'GET' }, null),
}
