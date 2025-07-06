export async function getVapidKey() {
  return 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
}

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

export async function subscribeUserToPush(publicKey) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey),
  });

  const subscriptionJSON = subscription.toJSON(); 

  await fetch(`${CONFIG.BASE_URL}/v1/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
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