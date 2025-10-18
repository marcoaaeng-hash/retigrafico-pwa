
const CACHE_NAME = 'retigrafico-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-512.png',
  './icon-192.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => (k!==CACHE_NAME ? caches.delete(k) : null)))));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
