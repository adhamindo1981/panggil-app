/**
 * Push Notification Helper for Web Push API
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch (err) {
    console.warn('Service worker registration failed:', err);
    return null;
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return await Notification.requestPermission();
}

export function triggerLocalNotification(orderNumber: string, customerName?: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const title = `Pesanan Siap! / طلبك جاهز #${orderNumber}`;
    const body = customerName
      ? `Halo ${customerName}, pesanan Anda sudah siap diambil di kasir!`
      : `Pesanan #${orderNumber} sudah siap diambil di kasir. Silakan menuju counter.`;

    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: 'order-ready',
      });
    } catch {
      navigator.serviceWorker?.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'order-ready',
        });
      });
    }
  }
}
