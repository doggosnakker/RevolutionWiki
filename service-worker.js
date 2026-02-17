var cacheName = 'pwa-nomesito';
var filesToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/images/icon.ico',
    '/images/inglese.png',
    '/images/industria.png',
    '/images/americana.png',
    '/images/francese.png',
    'data/home.json',
    'data/revolutions.json',
    'revoluzione.html',
    'preferiti.html',
    'menu_32dp_EEEEEE_FILL0_wght400_GRAD0_opsz40.png',
    '/script.js'

]; 

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});

