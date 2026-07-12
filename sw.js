const CACHE_NAME = 'khalik-makana-v1';
const urlsToCache = [
  '/d/',
  '/d/index.html',
  '/d/order.html',
  '/d/track.html',
  '/d/auth.html',
  '/d/profile.html',
  '/d/download.html',
  '/d/css/style.css',
  '/d/js/main.js',
  '/d/js/firebase-config.js',
  '/d/js/firebase-auth.js',
  '/d/js/firebase-db.js',
  '/d/manifest.json',
  '/d/assets/images/logo.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) return response;
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          })
          .catch(() => {
            if (event.request.destination === 'document') {
              return caches.match('/d/index.html');
            }
          });
      })
  );
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'خليك مكانك';
  const options = {
    body: data.body || 'في تحديث جديد!',
    icon: '/d/assets/images/logo.jpg',
    badge: '/d/assets/images/logo.jpg',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/d/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
