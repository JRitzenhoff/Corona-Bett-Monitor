// 'use strict';

// NOTE: File based heavily off of 
//  https://codelabs.developers.google.com/codelabs/your-first-pwapp/#4
const CACHE_NAME = 'static-cache-v1';

const FILES_TO_CACHE = [
    '/offline.html',

];

self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');

    // Precache static resources here.
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    // The skiWaiting() allows the server-worker to take control immediately
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate');

    // Remove previous cached data from disk.
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    // Allows the service-worker to take control immediately (at offline event)
    self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
    console.log('[ServiceWorker] Fetch', evt.request.url);

    // Fetch event handler here.
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
      }
      evt.respondWith(
          fetch(evt.request)
              .catch(() => {
                return caches.open(CACHE_NAME)
                    .then((cache) => {
                      return cache.match('offline.html');
                    });
              })
      );

      evt.respondWith();
});
