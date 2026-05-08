// Bumping the cache name forces the activate handler to delete the old cache
// (which held a stale index.html pointing at obsolete hashed bundles).
const CACHE_NAME = 'premed-election-v2';

// Only precache truly static files. NEVER precache index.html — it must always
// come from the network so users pick up new bundle hashes after a deploy.
const PRECACHE_URLS = [
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        console.log('[SW] Some precache resources failed; continuing.');
      })
    )
  );
  // Activate this SW immediately, replacing any older one.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Wipe every old cache (not just ours) — the previous SW version had a
    // broken cache-first strategy on index.html that 404s after a redeploy.
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );

    await self.clients.claim();

    // Force-reload every open tab so users with a stale HTML re-fetch the
    // current index.html (and its current bundle hash) over the network.
    // Runs once per SW activation — not a loop.
    const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windowClients) {
      try {
        await client.navigate(client.url);
      } catch (_) {
        // Older browsers may not support client.navigate; fall back to a postMessage
        // that the page can listen for if it wants to.
        try { client.postMessage({ type: 'SW_FORCE_RELOAD' }); } catch (_) {}
      }
    }
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass SW entirely for non-GET, API, websockets, and cross-origin backends
  if (
    req.method !== 'GET' ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/socket.io') ||
    url.hostname.includes('onrender.com')
  ) {
    return;
  }

  // Network-first for HTML navigations so new deploys are picked up immediately.
  // index.html references hashed bundles; serving stale HTML breaks deploys.
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers.get('accept') || '').includes('text/html');

  if (isNavigation) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Cache-first for hashed assets (immutable by hash) and other static files.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type !== 'error') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(
          () =>
            new Response('Offline - cached version not available', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({ 'Content-Type': 'text/plain' })
            })
        );
    })
  );
});

// Push notifications
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      for (let i = 0; i < windows.length; i++) {
        if (windows[i].location.pathname === new URL(urlToOpen, self.location).pathname) {
          return windows[i].focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
