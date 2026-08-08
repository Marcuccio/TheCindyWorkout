const CACHE = 'cindy-workout-v9';
const SHELL = [
  './',
  './index.html',
  './performance.html',
  './privacy.html',
  './pages.css',
  './storage.js',
  './scoring.js',
  './install-prompt.css',
  './install-prompt.js',
  './manifest.webmanifest',
  './icon.svg',
  './voice/manifest.json',
  './voice/01-get-ready.mp3',
  './voice/05-go.mp3',
  './voice/08-five-minutes-remaining.mp3',
  './voice/09-two-minutes-remaining.mp3',
  './voice/10-one-minute-remaining.mp3',
  './voice/11-thirty-seconds.mp3',
  './voice/12-countdown-10.mp3',
  './voice/13-countdown-9.mp3',
  './voice/14-countdown-8.mp3',
  './voice/15-countdown-7.mp3',
  './voice/16-countdown-6.mp3',
  './voice/17-countdown-5.mp3',
  './voice/18-countdown-4.mp3',
  './voice/19-countdown-3.mp3',
  './voice/20-countdown-2.mp3',
  './voice/21-countdown-1.mp3',
  './voice/22-workout-paused.mp3',
  './voice/23-go.mp3',
  './voice/times-up.mp3',
  './voice/amazing-work.mp3',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok && event.request.destination !== 'audio') {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
