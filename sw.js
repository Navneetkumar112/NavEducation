// Service Worker for PWA functionality
const CACHE_NAME = 'navneet-premium-page-cache-v1';
const urlsToCache = [
  '/',
  '/index.html', // Agar teri main HTML file ka naam index.html hai
  '/manifest.json',
  // Yahan pe apni saari CSS, JS files, aur images add kar
  // jaise: '/style.css', '/script.js', '/image.png',
  'https://cdn.tailwindcss.com', // Tailwind CSS CDN ko bhi cache kar sakte ho
  'https://content-fetcher.web.app/api/file?id=image.png-38a6c79f-d6f4-47de-90dc-f383c822670f', // Teri profile image
  'https://placehold.co/150x150/f0f2f5/000000?text=Clock', // Clock image
  'https://placehold.co/192x192/667eea/ffffff?text=NP', // PWA icon 1
  'https://placehold.co/512x512/667eea/ffffff?text=NP' // PWA icon 2
];

// Install event: Cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serve from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // both the browser and the cache can consume it.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Register the service worker in your main JavaScript file (or directly in HTML script)
// This part is handled by the main HTML file's script block below.

