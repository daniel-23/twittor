//Imports
importScripts('js/sw-utils.js');

const CACHE_STATIC    = 'static-v4';
const CACHE_DYNAMIC   = 'dynamic-v2';
const CACHE_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
	//'/',
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/spiderman.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/wolverine.jpg',
	'img/avatars/hulk.jpg',
	'img/avatars/thor.jpg',
	'js/app.js',
	'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js',
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( CACHE_STATIC )
        .then( cache => {
        	return cache.addAll(APP_SHELL);
        });
    
    const cacheInmutable = caches.open( CACHE_INMUTABLE )
    	.then( cache => cache.addAll(APP_SHELL_INMUTABLE) );

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );

});


self.addEventListener('activate', e => {

    const resp = caches.keys().then( keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== CACHE_DYNAMIC && key.includes('dynamic')) {
                return caches.delete(key);
            }

            if (key !== CACHE_INMUTABLE && key.includes('inmutable')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( resp );
});


self.addEventListener('fetch', e => {

	const respuesta = caches.match( e.request ).then(resp => {
		//console.log('Peticion',e.request.url);
		if (resp) { return resp }
		//console.log('No existe',e.request.url);

		return fetch( e.request ).then( newResp => {
			
			return actualizarCacheDinamico(CACHE_DYNAMIC, e.request, newResp);
		});
	});

    
    e.respondWith( respuesta );
});