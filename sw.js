self.addEventListener('install', (e) => { // Nos permite instalar el service worker cuando el usuario recien entra a nuestra app por primera vez
    console.info('[SW] Install ...');
});
self.addEventListener('activate', (e) => { // Cuando el navegador internamente actualiza el service worker si lo tiene, si no lo tiene lo crea como si fuera la primera vez
    console.info('[SW] Activate ...');
});
self.addEventListener('fetch', (e) => { // Permite capturar las peticiones a nuestras API´S
    console.info('[SW] Fetch ...');
});