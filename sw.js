// Odaklan! Service Worker - Push Notification Support for iOS/Android/Desktop
// Version 2 - Smarter caching with stale-while-revalidate strategy
const CACHE_VERSION = 2;
const CACHE_NAME = `odaklan-v${CACHE_VERSION}`;

// Resources to cache (relative paths for GitHub Pages subdirectory support)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/sounds/rain.mp3',
  './assets/sounds/cafe.mp3',
  './assets/sounds/complete.mp3',
  './assets/sounds/break-end.mp3',
  './assets/sounds/fireplace.mp3'
];

// Notification icon constants
const NOTIFICATION_ICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="%230f172a"/><circle cx="256" cy="256" r="180" fill="none" stroke="%2300B7C6" stroke-width="20"/><text x="256" y="290" font-size="180" font-family="Arial" font-weight="bold" text-anchor="middle" fill="%2300B7C6">O!</text></svg>';
const NOTIFICATION_BADGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="45" fill="%2300B7C6"/><text x="48" y="62" font-size="40" text-anchor="middle" fill="white">O</text></svg>';

// Install event - cache resources and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Convert relative URLs to absolute URLs for caching
        const absoluteUrls = urlsToCache.map(url => {
          // Remove leading './' and create absolute URL relative to service worker location
          const cleanUrl = url.startsWith('./') ? url.substring(2) : url;
          return new URL(cleanUrl, self.location.href).href;
        });
        return cache.addAll(absoluteUrls);
      })
      .then(() => self.skipWaiting()) // Activate new SW immediately
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any cache that doesn't match current version
          if (cacheName.startsWith('odaklan-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim all clients so the new SW takes effect immediately
      return self.clients.claim();
    }).then(() => {
      // Notify all clients about the update
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Fetch event - Stale-While-Revalidate strategy for HTML, Cache-First for assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // For HTML pages: Network-first with cache fallback (ensures fresh content)
  if (request.mode === 'navigate' || request.destination === 'document' || 
      url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback to cache when offline
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }
  
  // For assets (sounds, manifest, etc.): Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Start network fetch in background to update cache
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, but we might have cache
        return cachedResponse;
      });
      
      // Return cached response immediately, or wait for network
      return cachedResponse || fetchPromise;
    })
  );
});

// Push notification event - receive and show notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Odaklan bildirimi',
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_BADGE,
    vibrate: [200, 100, 200],
    tag: 'odaklan-notification',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Aç' },
      { action: 'close', title: 'Kapat' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Odaklan!', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes('index.html') && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          // Use relative path for GitHub Pages compatibility
          return clients.openWindow('./');
        }
      })
  );
});

// Message event - for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: NOTIFICATION_ICON,
      badge: NOTIFICATION_BADGE,
      vibrate: [200, 100, 200],
      tag: tag || 'odaklan-notification',
      requireInteraction: true
    });
  }
});
