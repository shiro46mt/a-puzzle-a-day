const version = '20230525'
var CACHE_NAME = 'A-Puzzle-A-Day';
var urlsToCache = [
    'index.html',
    'style.css',
    'main.css',
    'style.js',
    'main.js',
    'solve.js',
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches
            .match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});
