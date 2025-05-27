const CACHE_NAME = "spellmaker-cache-v5"; // <--- aumente a versão em cada deploy

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

// Instala e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting()) // <-- ativa imediatamente
  );
});

// Ativação: limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim()) // <-- força controle imediato
  );
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Permite atualização manual via postMessage
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
