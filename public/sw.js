// sw.js
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received');
  console.log(`[Service Worker] Push data: "${event.data ? event.data.text() : 'no payload'}"`);

  let data = {};
  try {
    data = event.data.json(); // If you're sending JSON
  } catch (e) {
    data = { title: 'Default Title', body: event.data.text() };
  }

  const title = data.title || 'Notification Title';
  const options = {
    body: data.body || 'Default body',
    icon: '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
