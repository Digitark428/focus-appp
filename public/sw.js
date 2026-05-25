// Tempo — Service Worker
// Handles local scheduled notifications via setTimeout while the SW is alive.
// Falls back to receiving SHOW_NOTIFICATION messages from the client when the
// SW is woken up by a fetch/postMessage. iOS keeps the SW alive briefly after
// each page interaction; for hard-killed PWAs, a Web Push backend is required.

const SW_VERSION = "tempo-sw-v1";
const ICON = "/tempo-logo.png";
const BADGE = "/favicon.svg";

// In-memory schedule (cleared on SW termination, re-pushed by the client on each load).
const timeouts = new Map();

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "SCHEDULE_NOTIFICATIONS") {
    // Replace the full schedule for this client.
    cancelAll();
    const items = Array.isArray(data.items) ? data.items : [];
    const now = Date.now();
    items.forEach((item) => {
      if (!item || !item.id || !item.at || !item.title) return;
      const delay = item.at - now;
      if (delay < 0 || delay > 24 * 60 * 60 * 1000) return; // skip past + >24h
      const t = setTimeout(() => {
        self.registration.showNotification(item.title, {
          body: item.body || "",
          icon: ICON,
          badge: BADGE,
          tag: item.tag || item.id,
          renotify: true,
          data: { url: item.url || "/", kind: item.kind || "tempo" },
          silent: false,
        });
        timeouts.delete(item.id);
      }, delay);
      timeouts.set(item.id, t);
    });
  }

  if (data.type === "CANCEL_NOTIFICATIONS") {
    cancelAll();
  }

  if (data.type === "SHOW_NOW") {
    self.registration.showNotification(data.title || "Tempo.", {
      body: data.body || "",
      icon: ICON,
      badge: BADGE,
      tag: data.tag || "tempo-now",
      renotify: true,
      data: { url: "/", kind: data.kind || "tempo" },
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existing = all.find((c) => "focus" in c);
    if (existing) {
      await existing.focus();
      try { existing.postMessage({ type: "NOTIFICATION_CLICK", url: targetUrl }); } catch {}
    } else if (self.clients.openWindow) {
      await self.clients.openWindow(targetUrl);
    }
  })());
});

function cancelAll() {
  for (const t of timeouts.values()) clearTimeout(t);
  timeouts.clear();
}
