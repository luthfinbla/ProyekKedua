import CONFIG from '../config';

export async function requestNotificationPermission() {
  const status = await Notification.requestPermission();
  if (status !== 'granted') throw new Error('Izin notifikasi ditolak');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return new Uint8Array([...raw].map((char) => char.charCodeAt(0)));
}

export async function subscribeUserToPush() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  });

  const subscriptionJSON = subscription.toJSON();

  await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      endpoint: subscriptionJSON.endpoint,
      keys: {
        auth: subscriptionJSON.keys.auth,
        p256dh: subscriptionJSON.keys.p256dh,
      },
    }),
  });

  console.log('✅ Berhasil subscribe notifikasi ke server');
}