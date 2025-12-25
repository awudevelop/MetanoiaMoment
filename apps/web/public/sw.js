// =============================================================================
// SERVICE WORKER
// Handles caching, offline support, and background sync for PWA functionality.
// =============================================================================

const CACHE_NAME = 'metanoia-v1'
const SUPPORTED_LOCALES = ['en', 'es']
const DEFAULT_LOCALE = 'en'

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/en/offline',
  '/es/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Get the user's preferred locale from the URL or navigator
function getPreferredLocale(request) {
  const url = new URL(request.url)

  // Check if URL already has a locale
  const pathLocale = url.pathname.split('/')[1]
  if (SUPPORTED_LOCALES.includes(pathLocale)) {
    return pathLocale
  }

  // Check navigator language
  const navLang = self.navigator?.language?.split('-')[0]
  if (navLang && SUPPORTED_LOCALES.includes(navLang)) {
    return navLang
  }

  return DEFAULT_LOCALE
}

function getOfflineUrl(request) {
  const locale = getPreferredLocale(request)
  return `/${locale}/offline`
}

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      // Cache offline page and essential assets
      await cache.addAll(PRECACHE_ASSETS)
      // Activate immediately
      await self.skipWaiting()
    })()
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
      // Take control of all pages immediately
      await self.clients.claim()
    })()
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return

  // Skip API requests (they should always go to network)
  if (url.pathname.startsWith('/api/')) return

  // Skip admin routes (always need fresh data)
  if (url.pathname.includes('/admin')) return

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try network first for HTML
          const networkResponse = await fetch(request)
          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          // Network failed, try cache
          const cachedResponse = await caches.match(request)
          if (cachedResponse) return cachedResponse
          // Return offline page as last resort
          return caches.match(getOfflineUrl(request))
        }
      })()
    )
    return
  }

  // For static assets (images, scripts, styles)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?)$/) ||
    url.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      (async () => {
        // Try cache first for static assets
        const cachedResponse = await caches.match(request)
        if (cachedResponse) return cachedResponse

        try {
          // Fetch from network
          const networkResponse = await fetch(request)
          // Cache successful responses
          if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME)
            cache.put(request, networkResponse.clone())
          }
          return networkResponse
        } catch (error) {
          // Return nothing if both cache and network fail for static assets
          return new Response('', { status: 404 })
        }
      })()
    )
    return
  }

  // Default: network first, cache fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      } catch (error) {
        const cachedResponse = await caches.match(request)
        if (cachedResponse) return cachedResponse
        return new Response('', { status: 404 })
      }
    })()
  )
})

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'close', title: 'Close' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Metanoia Moment', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'close') return

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      })

      // Check if there's already a window open
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }

      // Open new window if none found
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })()
  )
})

// Background sync for offline testimony submissions (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-testimonies') {
    event.waitUntil(syncTestimonies())
  }
})

async function syncTestimonies() {
  // Placeholder for syncing offline submissions
  // This would read from IndexedDB and POST to the server
  console.log('Background sync: syncing testimonies...')
}
