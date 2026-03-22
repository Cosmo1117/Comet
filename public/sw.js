importScripts("/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    
    const bypass = [
        'https://ipapi.co',
    ];
    
    if (bypass.some(domain => url.hostname.includes(domain))) {
        return;
    }

    event.respondWith((async () => {
        await scramjet.loadConfig();
        if (scramjet.route(event)) {
            return scramjet.fetch(event);
        }
        return fetch(event.request);
    })());
});