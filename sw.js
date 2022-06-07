importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js');

const CACHE_NAME_CORE = 'cache-v1';
const CACHE_FILES_CORE = [
    'src/images/icons/icon-144x144.png',
    'src/css/app.css',
    'src/images/computer.jpg',
    'src/js/app.js',
    'src/js/firebase.js',
    'src/js/db.js',
    'index.html',
    'post.html',
    '/'
];

const CACHE_NAME_DYNAMIC = 'dynamic-v1';

const CACHE_NAME_INMUTABLE = 'inmutable-v1';
const CACHE_FILES_INMUTABLE = [
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.brown-orange.min.css',
    'https://code.getmdl.io/1.3.0/material.min.js',
    'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2',
    'https://fonts.gstatic.com/s/materialicons/v129/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
    'https://fonts.gstatic.com/s/materialicons/v129/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    'https://unpkg.com/dayjs@1.8.21/dayjs.min.js',
    'https://unpkg.com/dayjs@1.8.35/plugin/relativeTime.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js',
    'https://unpkg.com/pwacompat'
];

self.addEventListener('install', (e) => {
    const guardandoCache = caches.open(CACHE_NAME_CORE) // Open or Create
        .then(cache => cache.addAll(CACHE_FILES_CORE))
        .catch(err => console.error(err.message));
    const guardandoCacheInmutable = caches.open(CACHE_NAME_INMUTABLE) // Open or Create
        .then(cache => cache.addAll(CACHE_FILES_INMUTABLE))
        .catch(err => console.error(err.message));
    self.skipWaiting();
    e.waitUntil(Promise.all([guardandoCache, guardandoCacheInmutable]));

    // Nosotros deberiamos agregar al cache nuestros archivos
    // console.info('[SW] Adicionando nuestros archivos al cache...');

    // const wu = new Promise((resolve, reject) => {
    //     try {            
    //         setTimeout(() => {
    //             const adicionandoMisArchivos = '';
    //             const adicionarVariablesDinamicas = '';
    //             console.warn('[SW]: Se instaló correctamente...');
    //             resolve();
    //         }, 1000);
    //         self.skipWaiting();

    //     } catch (error) {
    //         reject(error.message);
    //     }
    // })

    // e.waitUntil(wu);

});
self.addEventListener('activate', (e) => {
    // La documentación nos indica eliminar todos los caches anteriores
    const obtenerCaches = caches.keys()
        .then(allCaches => allCaches.filter(cache => ![CACHE_NAME_CORE, CACHE_NAME_INMUTABLE, CACHE_NAME_DYNAMIC].includes(cache)).filter(cacheName => caches.delete(cacheName)))
        .catch(err => console.error(err.message))

    console.info('[SW]: Cache limpiado exitosamente');
    e.waitUntil(obtenerCaches);
    // e.waitUntil(clients.claim());
});
self.addEventListener('fetch', (e) => {

    if (!(e.request.url.indexOf('http') === 0)) {
        return;
    }
    
    if(e.request.url.includes('firestore.googleapis.com')) {
        return;
    }

    // Primera estrategia: Solo cache
    // const soloCache = caches.match(e.request);
    // e.respondWith(soloCache);

    // Segunda estrategia: Solo red
    // const soloRed = fetch(e.request);
    // e.respondWith(soloRed);

    // Tercer estrategia: Cache pidiendo ayuda a la red
    // const cacheAyudaRed = caches.match(e.request)
    //     .then(page => page || fetch(e.request));
    // e.respondWith(cacheAyudaRed);

    const cacheAyudaRed = caches.match(e.request)
        .then(page => page || fetch(e.request)
            .then(eventRequest => {
                return caches.open(CACHE_NAME_DYNAMIC).then(cache => {                    
                    if (![].concat(CACHE_FILES_CORE, CACHE_FILES_INMUTABLE).indexOf(e.request.url) || eventRequest.type === 'opaque') {
                        cache.put(e.request, eventRequest.clone());
                    }

                    return eventRequest;
                });
            }));
    e.respondWith(cacheAyudaRed);

    // Cuarta estrategia: Red pidiendo ayuda al cache
    // OK = 200, 201, 301
    // ERROR = 400, 401, 500

    // const redAyudaCache = fetch(e.request)
    //     .then(page => page)
    //     .catch(murioInternet => caches.match(e.request));
    // e.respondWith(redAyudaCache);

    // Estrategia final: Caché luego red
    // const cacheLuegoRed = caches.open(CACHE_NAME_DYNAMIC)
    //     .then(cache => {
    //         return fetch(e.request)
    //             .then(response => {
    //                 if(![].concat(CACHE_FILES_CORE, CACHE_FILES_INMUTABLE).indexOf(e.request.url)) {
    //                     cache.put(e.request, response.clone());
    //                 }
    //                 return response;
    //             })
    //     });
    // e.respondWith(cacheLuegoRed);
});
self.addEventListener('sync', (e) => {
    console.log(e);
});
self.addEventListener('push', (e) => {
    console.error(e);
});