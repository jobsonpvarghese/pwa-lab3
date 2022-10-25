// cache name
const cacheName = "cacheAssets-v-alpha-1.0"

// network with cache fallback
self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request)
    })
  )
})

// cache assets
const baseURL = "https://jobsonpvarghese.github.io/pwa-lab3/"

const cacheAssets = [
  baseURL,
  `${baseURL}index.html`,
  `${baseURL}main.js`,
  `${baseURL}manifest.json`,
  `${baseURL}service-worker.js`,
  `${baseURL}style.css`,
  `${baseURL}assets/musical-note.png`,
  `${baseURL}assets/musical-note(192x192).png`
] // Add all the files that you want to cache

// install event
self.addEventListener("install", function (event) {
  self.skipWaiting()
  caches
    .open(cacheName)
    .then(function (cache) {
      console.log("[Service Worker] Installing...")
      return cache.addAll(cacheAssets)
    })
    .catch(err => {
      console.log("something went wrong", err)
    })
})

// activate event
self.addEventListener("activate", function (event) {
  console.log("[Service worker] activated", event)
  event.waitUntil(clients.claim())
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(cacheNames.filter(cache => cache !== cacheName).map(cacheName => caches.delete(cacheName)))
    })
  )
})
