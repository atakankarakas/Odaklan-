// Odaklan! Service Worker - Push Notification Support for iOS/Android/Desktop
const CACHE_NAME = 'odaklan-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/sounds/rain.mp3',
  '/assets/sounds/cafe.mp3',
  '/assets/sounds/complete.mp3',
  '/assets/sounds/break-end.mp3',
  '/assets/sounds/fireplace.mp3'
];

// Notification icon constants
const NOTIFICATION_ICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="100" fill="%230f172a"/><circle cx="256" cy="256" r="180" fill="none" stroke="%2300B7C6" stroke-width="20"/><text x="256" y="290" font-size="180" font-family="Arial" font-weight="bold" text-anchor="middle" fill="%2300B7C6">O!</text></svg>';
const NOTIFICATION_BADGE = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><circle cx="48" cy="48" r="45" fill="%2300B7C6"/><text x="48" y="62" font-size="40" text-anchor="middle" fill="white">O</text></svg>';

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
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
          return clients.openWindow('/');
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
