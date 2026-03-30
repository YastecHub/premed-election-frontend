const CACHE_NAME = 'premed-election-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Continue even if some resources fail to cache
        console.log('Some resources could not be cached');
      });
    })
  );
  self.skipWaiting();
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
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', (event) => {
  // Don't cache POST, PUT, DELETE requests
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        // Cache successful GET responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // Return offline page or cached response
        return new Response('Offline - cached version not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'PreMed Election';
  const options = {
    body: data.body || 'Check the voting platform',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'election-notification',
    requireInteraction: data.requireInteraction || false,
    data: {
      url: data.url || '/',
      ...data
    }
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      // Check if window already exists
      for (let i = 0; i < windows.length; i++) {
        if (windows[i].location.pathname === new URL(urlToOpen, self.location).pathname) {
          return windows[i].focus();
        }
      }
      // Open new window if not found
      return clients.openWindow(urlToOpen);
    })
  );
});
