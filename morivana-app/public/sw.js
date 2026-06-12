const CACHE_NAME = 'morivana-assets-v2'

// Only pre-cache the minimal app shell — JS/HTML built by Vite.
// Images, 3D models, and fonts are now served via jsDelivr CDN and
// are NOT pre-cached here (service workers cannot cache cross-origin
// responses unless the server sends CORS headers with proper scope).
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/logo.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only intercept HTTP/S GET requests
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return
  }

  // ── CRITICAL: Let ALL cross-origin requests pass through untouched ──
  // The SW must not intercept CDN (jsDelivr), Google Fonts, analytics,
  // Clerk, Stripe, geolocation APIs, or any other external domain.
  // Cross-origin fetch through the SW is subject to connect-src CSP,
  // which causes widespread blocking. Let the browser handle them directly.
  if (url.hostname !== self.location.hostname) {
    return
  }

  // Do not intercept API endpoints or Clerk well-known routes
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/.well-known/')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Stale-while-revalidate for HTML and JS bundles
        if (
          url.pathname === '/' ||
          url.pathname === '/index.html' ||
          url.pathname.startsWith('/assets/')
        ) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse)
                })
              }
            })
            .catch(() => {}) // fail silently when offline
        }
        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse
        }

        // Only cache same-origin Vite bundles and SVG assets
        const isAsset = url.pathname.startsWith('/assets/')
        const isSVG = url.pathname.endsWith('.svg')

        if (isAsset || isSVG) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return networkResponse
      }).catch(() => {
        // SPA offline fallback: serve /index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html')
        }
      })
    })
  )
})
