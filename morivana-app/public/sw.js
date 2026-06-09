const CACHE_NAME = 'morivana-assets-v1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/models/morivana_pouch_fixed_draco.glb',
  '/draco/draco_decoder.js',
  '/draco/draco_decoder.wasm',
  '/draco/draco_wasm_wrapper.js',
  '/morivana-sip.jpeg',
  '/Moringa%20Leaves%20Overhead.webp',
  '/morivana-scoop.webp',
  '/morivana-jar.jpeg',
  '/Morning%20Light%20.webp',
  '/morivana-ingredients.webp',
  '/morivana-powder.jpeg',
  '/packaging_highres.webp',
  '/icon-bag.png',
  '/icon-gear-3d.png',
  '/icon-pin-3d.png',
  '/icon-mail-3d.png',
  '/icon-phone-3d.png',
  '/icon-shield-3d.png',
  '/avatar-male.png',
  '/avatar-female.png',
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

  // Do not intercept or cache Clerk requests or API endpoints
  if (
    url.hostname.includes('clerk') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('/.well-known/')
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate for index/assets)
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
            .catch(() => {}) // fallback silently if offline
        }
        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse
        }

        // Cache Vite bundles and other static files dynamically
        const isAsset = url.pathname.startsWith('/assets/')
        const isImage = /\.(png|jpe?g|gif|svg|webp|avif)$/i.test(url.pathname)
        const isFont = /\.(woff2?|eot|ttf|otf)$/i.test(url.pathname)
        const isModel = url.pathname.endsWith('.glb') || url.pathname.endsWith('.gltf')

        if (isAsset || isImage || isFont || isModel) {
          const responseToCache = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return networkResponse
      }).catch((err) => {
        // SPA offline fallback: serve /index.html if we are fetching a document page
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html')
        }
        throw err
      })
    })
  )
})
