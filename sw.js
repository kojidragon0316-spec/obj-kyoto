// Service Worker無効化版（即時アンインストール）
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    Promise.all([
      caches.keys().then(function(keys){
        return Promise.all(keys.map(function(k){ return caches.delete(k); }));
      }),
      self.registration.unregister()
    ])
  );
});
// fetchは一切インターセプトしない（常にネットワークから取得）
