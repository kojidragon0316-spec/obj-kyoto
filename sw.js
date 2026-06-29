const CACHE_NAME = 'obj-shift-v2';
const CACHE_FILES = [
  '/obj-kyoto/shift.html',
  '/obj-kyoto/staff.html',
  '/obj-kyoto/manifest.json',
  '/obj-kyoto/icon-192.png',
  '/obj-kyoto/icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// ネットワーク優先、失敗時はキャッシュを返す
self.addEventListener('fetch', function(e) {
  e.respondWith(
    fetch(e.request)
      .then(function(res) {
        // 成功したらキャッシュも更新
        var resClone = res.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(function() {
        return caches.match(e.request);
      })
  );
});
