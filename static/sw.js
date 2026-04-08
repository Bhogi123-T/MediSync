self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (event) => {
  // Pass-through fetch for MVP
  event.respondWith(fetch(event.request));
});
