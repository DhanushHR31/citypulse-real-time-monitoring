// This is a dummy service worker to satisfy 404 errors.
// It effectively does nothing and claims clients to ensure strict online behavior.
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Pass through all requests to network
    event.respondWith(fetch(event.request));
});
