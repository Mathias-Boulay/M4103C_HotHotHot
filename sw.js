let CACHE = 'Super-Hot';

// Lors de l'installation de Super-Hot.
self.addEventListener('install', function(evt) {
    evt.waitUntil(caches.open(CACHE).then(function (cache) {
        cache.addAll([
            "./index.html",
            "./assets/images/safari-pinned-tab.svg",
            "./assets/images/apple-touch-icon.png",
            "./assets/images/favicon.ico",
            "./assets/images/favicon-16x16.png",
            "./assets/images/favicon-32x32.png",
            "./assets/images/mstile-150x150.png",
            "./assets/images/android-chrome-192x192.png",
            "./assets/images/android-chrome-512x512.png",
            "./browserconfig.xml",
            "./sw.js",
        ]);
    }));
});

//Lors du fetch, on prend les données issues du cache, puis on update le cash avec les données du serveur
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromCache(evt.request));
    evt.waitUntil(
        update(evt.request).then(refresh)
    );
});

function fromCache(request) {
    console.log('match cache request');
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request);
    });
}

function update(request) {
    console.log('update cache');
    return caches.open(CACHE).then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}

function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            var message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}