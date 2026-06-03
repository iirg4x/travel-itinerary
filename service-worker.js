/* Switzerland Itinerary — Service Worker
   Strategy:
   - App shell (HTML, manifest, icons, Google Fonts): cache-first, prefetched on install.
   - Live data (Open-Meteo, open.er-api.com, jsdelivr currency-api): network-first,
     fall back to cached copy if offline so the UI still shows a number.
   - Everything else (third-party links etc.): pass-through.
   Bump SHELL_CACHE version when you change the HTML/CSS/JS to force clients to refresh.
*/
const SHELL_CACHE = 'swiss-shell-v24';
const RUNTIME_CACHE = 'swiss-runtime-v1';

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './AI_JSON_GUIDE.md',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap'
];

const LIVE_HOSTS = [
  'api.open-meteo.com',
  'open.er-api.com',
  'cdn.jsdelivr.net'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache =>
      // Use addAll but tolerate single-asset failures (cross-origin font CSS can occasionally 5xx)
      Promise.all(SHELL_ASSETS.map(url =>
        cache.add(new Request(url, { cache: 'reload' })).catch(() => null)
      ))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Live data: network-first, runtime-cache fallback
  if (LIVE_HOSTS.includes(url.hostname)) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Cross-origin Google Fonts files: cache-first (they're versioned)
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'fonts.googleapis.com') {
    event.respondWith(cacheFirst(req, RUNTIME_CACHE));
    return;
  }

  // Same-origin app shell: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, SHELL_CACHE));
    return;
  }
  // Everything else: just pass through
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    // Last resort: try the navigation fallback to index.html
    if (req.mode === 'navigate') {
      const fallback = await caches.match('./index.html');
      if (fallback) return fallback;
    }
    throw e;
  }
}

async function networkFirst(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw e;
  }
}

// Listen for explicit "skip waiting" from the page (used by the update banner)
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});
