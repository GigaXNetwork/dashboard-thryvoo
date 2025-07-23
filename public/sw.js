self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received');

  if (!event.data) {
    console.warn('[Service Worker] No data in push event');
    return;
  }

  let payload = {};
  try {
    payload = event.data.json();
  } catch (e) {
    console.error('[Service Worker] Failed to parse push data:', e);
  }

  const title = payload.title || 'New Notification';
  const options = {
    body: payload.message || 'You have a new message.',
    icon: '/favicon.png',
    badge: '/favicon.png',
    data: payload.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

