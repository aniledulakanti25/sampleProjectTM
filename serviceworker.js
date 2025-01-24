// const CACHE_NAME = "task-manager-cache-v1";
// const urlsToCache = [
//   "/",
//   "/index.html",
//   "/css/style.css",
//   "/js/script.js",
//   "/manifest.json",
//   "/icons/icon-192x192.png",
//   "/icons/icon-512x512.png",
//   "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
//   "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
//   "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js",
//   "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js",
// ];

// // Install event: Cache static assets Application Shell
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Opened cache...");
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // Activate event: Clean up old caches
// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) =>
//       Promise.all(
//         cacheNames.map((cacheName) => {
//           if (!cacheWhitelist.includes(cacheName)) {
//             console.log("Deleting old cache:", cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       )
//     )
//   );
// });

// // Fetch event: Serve requests from cache, fallback to network
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return cached resource if found
//       if (response) {
//         return response;
//       }
//       // Fallback to network
//       return fetch(event.request)
//         .then((networkResponse) => {
//           // Cache the new response if it's a valid request
//           if (event.request.method === "GET") {
//             return caches.open(CACHE_NAME).then((cache) => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           }
//           return networkResponse;
//         })
//         .catch(() => {
//           // Handle offline fallback for navigation requests
//           if (event.request.mode === "navigate") {
//             return caches.match("/offline.html");
//           }
//         });
//     })
//   );
// });

// Cache Names
const CACHE_NAME = 'task-manager-cache-v1';
const DYNAMIC_CACHE_NAME = 'task-manager-dynamic-v1';
const OFFLINE_URL = '/offline.html';

// Files to Cache (Static Assets)
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/style.css',
  '/js/script.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install Event: Cache Static Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  //self.skipWaiting();
});

// Activate Event: Clear Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  //self.clients.claim();
});

// Fetch Event: Cache Dynamic Content and Handle Offline Requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not found in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Check if the response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response so we can cache it
          const responseToCache = response.clone();

          // Dynamically cache the request
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response; // Return the network response
        })
        .catch(() => {
          // Serve offline page for navigation requests when network is unavailable
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// self.addEventListener('push', (event) => {
//   const data = event.data ? event.data.json() : {};
//   console.log('Push received:', data);

//   const options = {
//     body: data.body || 'You have a new notification!',
//     icon: '/icons/icon-192x192.png',
//     badge: '/icons/icon-512x512.png',
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title || 'Task Manager', options)
//   );
// });

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(
//     clients.openWindow('/index.html') // Open the app page
//   );
// });

