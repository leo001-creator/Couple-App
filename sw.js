const cacheName = 'pora-app-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Įdiegimo metu į cache'ą įtraukiame nurodytus resursus
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Užklausoms: jei yra cache, grąžinti, jei ne – eiti į tinklą
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      return cachedRes || fetch(event.request);
    })
  );
});
