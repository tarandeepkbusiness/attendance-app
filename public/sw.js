const CACHE_NAME = 'attendance-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/logo.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Bypass non-GET requests or requests from other origins (except fonts)
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  const isSelfOrigin = url.origin === self.location.origin;
  
  // Handle SPA navigation: route direct document navigations to cached index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If we have a cached response, return it and fetch in the background to update cache (stale-while-revalidate)
      if (cachedResponse) {
        if (isSelfOrigin) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => { /* Silent ignore background sync error */ });
        }
        return cachedResponse;
      }

      // If not cached, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic assets if they match self origin or web fonts
        const isFont = url.host.includes('fonts.googleapis.com') || url.host.includes('fonts.gstatic.com');
        if (
          networkResponse.status === 200 &&
          (isSelfOrigin || isFont) &&
          (event.request.destination === 'style' ||
           event.request.destination === 'script' ||
           event.request.destination === 'image' ||
           event.request.destination === 'font')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Fallback for image requests offline
        if (event.request.destination === 'image') {
          return caches.match('/logo.png');
        }
        throw err;
      });
    })
  );
});
