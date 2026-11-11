// Cache per usare l'app anche senza rete (in cantiere).
const CACHE = "preventivi-v2";
const FILES = ["./", "index.html", "style.css", "app.js", "pdf.js", "vendor/jspdf.umd.min.js",
  "fonts/DejaVuSans.ttf", "fonts/DejaVuSans-Bold.ttf", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((x) => x !== CACHE).map((x) => caches.delete(x)))));
  self.clients.claim();
});
// Rete prima (così gli aggiornamenti arrivano subito), cache se offline.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
