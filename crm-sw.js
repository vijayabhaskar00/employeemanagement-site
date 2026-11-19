// Brands CRM device alerts. Firebase Cloud Messaging delivers a data-only push
// ({ title, body, link }, sent by the crmActivityCreated / crmReminders functions);
// this shows it and opens the brand when tapped. No caching: the app stays online-only.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  let d = {};
  try { const p = e.data ? e.data.json() : {}; d = p.data || p; } catch { /* not JSON: show the default */ }
  e.waitUntil(self.registration.showNotification(d.title || 'Brands CRM', {
    body: d.body || '',
    icon: 'logo.jpg',
    badge: 'logo.jpg',
    tag: d.link || undefined, // one alert per brand: a newer one replaces the older
    renotify: !!d.link,
    data: { link: d.link || 'https://stpayrollinvoices.web.app/#/crm' },
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const link = e.notification.data?.link || 'https://stpayrollinvoices.web.app/#/crm';
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const open = wins.find(w => new URL(w.url).origin === new URL(link).origin);
    if (open) { await open.focus(); return open.navigate(link).catch(() => self.clients.openWindow(link)); }
    return self.clients.openWindow(link);
  })());
});
