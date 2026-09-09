const CACHE_PREFIX = 'ansi-certified-';
const CACHE = `${CACHE_PREFIX}v1`;
const ROOT = new URL('./', self.location.href).pathname;
const OFFLINE = `${ROOT}offline.html`;
const CORE = [
  ROOT,
  OFFLINE,
  `${ROOT}manifest.webmanifest`,
  `${ROOT}icon.svg`,
  `${ROOT}boss-fictional.webp`,
  `${ROOT}icons/icon-192.png`,
  `${ROOT}icons/icon-512.png`,
  `${ROOT}icons/icon-maskable-512.png`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(async () => (await caches.match(event.request)) || (await caches.match(OFFLINE))),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          void caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    }),
  );
});
