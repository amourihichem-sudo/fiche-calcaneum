// Fiche Calcanéum – fonctionnement hors ligne
// Changer VERSION à chaque mise à jour des fichiers pour que les téléphones la récupèrent.
const VERSION = "fiche-calcaneum-v1";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return; // les envois vers Google ne passent pas par le cache
  e.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req, { ignoreSearch: true }).then(cached => {
        const network = fetch(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
