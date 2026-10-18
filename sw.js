const CACHE='kevind-rc-rpm-v45-electric-low-output-color';
const ASSETS=['./','./index.html','./gearing.html','./model-catalog.js','./tutorial.js','./nitro.js','./verified-gearing.json','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kevind-rc-rpm-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const url=new URL(e.request.url);
 if(e.request.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/verified-gearing.json')){
  e.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   try{const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response}
   catch(error){const cached=await cache.match(e.request);if(cached)return cached;throw error}
  })());return;
 }
 e.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  let cached=await cache.match(e.request);
  if(!cached&&e.request.mode==='navigate'&&(/\/(index|gearing)\.html$/.test(url.pathname)))cached=await cache.match(url.origin+url.pathname);
  if(cached)return cached;
  const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response;
 })());
});
