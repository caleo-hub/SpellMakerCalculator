const CACHE_NAME = "spellmaker-cache-v2";
const urlsToCache = [
  "/index.html",
  "/manifest.json",
  "/privacy.html",
  "/terms.html",
  "/ads.txt",

  // Estilos
  "/assets/css/style.css",

  // Scripts
  "/assets/js/main.js",
  "/assets/js/skillTable.js",
  "/assets/js/spellBuilder.js",
  "/assets/js/spellStats.js",
  "/assets/js/authentication.js",

  // Dados
  "/data/spells.json",

  // Imagens
  "/img/spellmakingaltarcalculatorlogo.png"
];

// Instala e adiciona ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos se houver
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requisições e serve do cache quando possível
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
