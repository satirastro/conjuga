/* Çevrimdışı çalışma: dosyalar ilk açılışta saklanır, sonra internetsiz açılır.
   Uygulamayı güncellediğinde SURUM'u artır (örn. v2) ki telefon yeni dosyaları alsın. */
const SURUM = 'antrenman-takip-v1';
const DOSYALAR = ['./', 'index.html', 'program.js', 'diyagram.js', 'hareketler.js', 'manifest.webmanifest', 'ikon-192.png', 'ikon-512.png', 'ikon-180.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(DOSYALAR)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('antrenman-takip-') && x !== SURUM).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(hit => {
      const ag = fetch(r).then(res => {
        if (res && res.ok) { const kopya = res.clone(); caches.open(SURUM).then(c => c.put(r, kopya)); }
        return res;
      }).catch(() => hit || (r.mode === 'navigate' ? caches.match('index.html') : undefined));
      return hit || ag;   // önce saklanan, arkada güncelle
    })
  );
});
