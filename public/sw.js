importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(clients.claim()));

self.addEventListener("fetch", (event) => {
	event.respondWith(async () => {
    if (event.request.url.includes('/comet-pages/')) {
        return fetch(event.request);
    }

    await scramjet.loadConfig();

    if (scramjet.route(event)) {
      return scramjet.fetch(event);
    }

    return fetch(event.request);
  });
});