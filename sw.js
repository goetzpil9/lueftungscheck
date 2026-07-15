// ─────────────────────────────────────────────────────────────
// Lüftungscheck – Service Worker
// Strategie:
//   App Shell (HTML, Icons)  → Cache First  (funktioniert offline)
//   Google Fonts             → Cache First  (nach erstem Laden)
//   Wetter-APIs               → Network First → Fallback auf Cache
// ─────────────────────────────────────────────────────────────

const VERSION       = 'v1.0.0';
const CACHE_SHELL   = `lueften-shell-${VERSION}`;
const CACHE_FONTS   = `lueften-fonts-${VERSION}`;
const CACHE_WEATHER = `lueften-weather-${VERSION}`;

// App Shell – wird beim Install gecacht.
// Relative Pfade, damit es unabhängig vom Unterordner funktioniert
// (wichtig für GitHub Pages: https://name.github.io/repo/)
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// ── INSTALL: Shell cachen ─────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_SHELL)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: Alte Caches löschen ────────────────────────────
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_SHELL, CACHE_FONTS, CACHE_WEATHER];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !currentCaches.includes(k))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: Request-Routing ────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Google Fonts → Cache First
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(request, CACHE_FONTS));
    return;
  }

  // Wetter-APIs (Open-Meteo, Nominatim) → Network First
  if (url.hostname.includes('open-meteo.com') ||
      url.hostname.includes('nominatim.openstreetmap.org')) {
    event.respondWith(networkFirst(request, CACHE_WEATHER, 60 * 60)); // 1h TTL
    return;
  }

  // Gleicher Origin (App Shell: HTML, JSON, Icons) → Cache First
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request, CACHE_SHELL));
    return;
  }

  // Alles andere → Network mit Cache-Fallback
  event.respondWith(networkFirst(request, CACHE_SHELL, 24 * 60 * 60));
});

// ── STRATEGIEN ────────────────────────────────────────────────

/**
 * Cache First – ideal für statische Assets.
 * Gibt gecachte Version zurück, lädt bei Miss aus dem Netz.
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline – kein Cache verfügbar.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}

/**
 * Network First – ideal für API-Daten.
 * Versucht Netz zuerst, fällt auf Cache zurück wenn offline.
 * ttlSeconds: maximales Alter des Cache-Eintrags in Sekunden.
 */
async function networkFirst(request, cacheName, ttlSeconds = 3600) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) {
      const headers = new Headers(response.headers);
      headers.append('sw-cache-date', Date.now().toString());
      const cloned = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
      cache.put(request, cloned);
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      const cacheDate = parseInt(cached.headers.get('sw-cache-date') || '0');
      const age = (Date.now() - cacheDate) / 1000;
      if (age < ttlSeconds) return cached;
    }
    return new Response(
      JSON.stringify({ error: 'offline', message: 'Keine Internetverbindung.' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
