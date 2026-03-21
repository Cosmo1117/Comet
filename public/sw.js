importScripts("/scramjet.sync.js");

const { ScramjetServiceWorker } = scramjet;

const sw = new ScramjetServiceWorker();

self.addEventListener("fetch", (event) => {
    if (sw.route(event)) {
        event.respondWith(sw.fetch(event));
    }
});