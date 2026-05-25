// Tempo — Notifications service
// Wraps Service Worker registration, permission flow, and schedule push.

const SW_PATH = "/sw.js";

let swRegistration = null;
let registerPromise = null;

export function notificationsSupported() {
  return (
    typeof window !== "undefined"
    && "Notification" in window
    && "serviceWorker" in navigator
  );
}

export function notificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  return Notification.permission; // "default" | "granted" | "denied"
}

export async function registerServiceWorker() {
  if (!notificationsSupported()) return null;
  if (swRegistration) return swRegistration;
  if (registerPromise) return registerPromise;
  registerPromise = navigator.serviceWorker
    .register(SW_PATH, { scope: "/" })
    .then(async (reg) => {
      swRegistration = reg;
      // Wait until active so postMessage targets a real worker.
      if (!reg.active) {
        await new Promise((resolve) => {
          const sw = reg.installing || reg.waiting;
          if (!sw) return resolve();
          sw.addEventListener("statechange", () => {
            if (sw.state === "activated") resolve();
          });
        });
      }
      return reg;
    })
    .catch((err) => {
      console.warn("[Tempo] SW registration failed:", err);
      return null;
    });
  return registerPromise;
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const r = await Notification.requestPermission();
    return r;
  } catch {
    return "denied";
  }
}

// Push a fresh schedule to the SW. `items` = [{ id, at, title, body, tag, kind }]
export async function scheduleNotifications(items) {
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;
  const reg = await registerServiceWorker();
  const target = reg?.active || navigator.serviceWorker.controller;
  if (!target) return;
  target.postMessage({ type: "SCHEDULE_NOTIFICATIONS", items });
}

export async function cancelScheduledNotifications() {
  if (!notificationsSupported()) return;
  const reg = await registerServiceWorker();
  const target = reg?.active || navigator.serviceWorker.controller;
  if (!target) return;
  target.postMessage({ type: "CANCEL_NOTIFICATIONS" });
}

// Optional helper for testing or instant alerts.
export async function showNow(title, body, kind = "tempo") {
  if (!notificationsSupported()) return;
  if (Notification.permission !== "granted") return;
  const reg = await registerServiceWorker();
  const target = reg?.active || navigator.serviceWorker.controller;
  if (!target) return;
  target.postMessage({ type: "SHOW_NOW", title, body, kind });
}
