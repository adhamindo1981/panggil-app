// Service Worker for "Panggil / نداء" Web Push Notifications & Background Alerts

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = { orderNumber: '', customerName: '', cafeName: 'Panggil' };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    data.orderNumber = event.data ? event.data.text() : '';
  }

  const title = `Pesanan Siap! / طلبك جاهز ${data.orderNumber ? '#' + data.orderNumber : ''}`;
  const options = {
    body: data.customerName 
      ? `Halo ${data.customerName}, pesanan Anda sudah siap diambil di kasir!` 
      : `Pesanan #${data.orderNumber || ''} sudah siap diambil di kasir.`,
    icon: '/icons/pager-alert.png',
    badge: '/icons/badge.png',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'order-ready',
    requireInteraction: true,
    data: {
      url: self.location.origin,
    },
    actions: [
      { action: 'open', title: 'Buka Pager / عرض البيجر' },
      { action: 'dismiss', title: 'Tutup / إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data?.url || '/');
      }
    })
  );
});
