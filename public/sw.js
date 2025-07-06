const CACHE_NAME = 'berbagi-cerita-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './index.bundle.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.css', 
];

// Simpan static assets ke cache saat install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Hapus cache lama saat activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// Push Notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  const title = data.title || 'Notifikasi Baru';
  const options = {
    body: data.body || 'Ada cerita baru di aplikasi!',
    icon: './icons/icon-192.png',
    badge: './icons/badge-72.png', 
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
