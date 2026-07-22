// Subí este número cada vez que cambies el contenido de la app: es lo que
// hace que el navegador detecte el service worker como "nuevo" y refresque
// la caché en vez de seguir sirviendo la versión vieja para siempre.
const CACHE_NAME = "vital40-cache-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./exercises.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estrategia "red primero": si hay conexión, siempre trae la versión más
// nueva y actualiza la caché. Si no hay conexión, sirve la última copia
// guardada. Así los cambios se ven al instante en vez de quedar pegados
// a la primera versión instalada.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
