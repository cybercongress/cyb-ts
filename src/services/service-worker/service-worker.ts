/* eslint-disable import/no-unused-modules */
import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'audio' ||
    request.destination === 'video' ||
    request.destination === 'object' ||
    request.destination === 'font',
  new CacheFirst({ cacheName: 'assets' })
);

registerRoute(
  ({ request }) => request.destination === 'document',
  async ({ event }) => {
    const request = (event as any).request as Request;
    console.log('[Service worker] fecth document', request);

    return new Response('/index.html');
  }
);

registerRoute(
  ({ url }) => url.origin.includes('cybernode.ai'),
  new NetworkFirst({ cacheName: 'api-responses' })
);

function generateCacheKey(request: Request) {
  return request.url + JSON.stringify(request.body);
}
registerRoute(
  ({ request }) => request.method === 'POST',
  async ({ event }) => {
    const request = (event as any).request as Request;
    const cacheKey = generateCacheKey(request);
    const cachedResponse = await caches.match(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const response = await fetch(request);

    const cache = await caches.open('api-responses-post');
    await cache.put(cacheKey, response.clone());

    return response;
  }
);

// registerRoute(
//   () => true,
//   new NetworkFirst({ cacheName: 'api-responses-post' }),
//   'POST'
// );

// const navHandler = createHandlerBoundToURL('/index.html');

// registerRoute(navHandler);
