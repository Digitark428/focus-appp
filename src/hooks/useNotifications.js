import { useEffect, useRef } from "react";
import { useFocus } from "../context/FocusContext";
import {
  notificationsSupported, notificationPermission,
  scheduleNotifications, cancelScheduledNotifications,
} from "../services/notifications";
import { toMin } from "../utils/time";

const MORNING_QUOTES = [
  "Une nouvelle journée commence — prends-en le contrôle.",
  "Chaque tâche accomplie te rapproche de tes objectifs.",
  "Aujourd'hui est une page blanche, écris quelque chose de bien.",
  "L'énergie du matin pose le rythme du reste de la journée.",
  "Avance d'un pas — peu importe la taille du pas.",
  "Ta concentration est ton super-pouvoir aujourd'hui.",
];

function pickMorningQuote(dateKey) {
  // Stable pick per day so the quote doesn't change at every reschedule.
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0;
  return MORNING_QUOTES[h % MORNING_QUOTES.length];
}

function dateAtTime(baseDate, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

// Build a flat list of notifications for today based on the current task list.
function buildSchedule({ tasks, completions, todayDate, userFirstName }) {
  if (!tasks?.length) return [];
  const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
  const items = [];
  const dateKey = `${todayDate.getFullYear()}-${todayDate.getMonth()}-${todayDate.getDate()}`;
  const firstUpcoming = sorted.find((t) => !(completions || {})[t.id]);

  // Morning notif — 10 min before first task.
  if (firstUpcoming) {
    const firstStart = dateAtTime(todayDate, firstUpcoming.start);
    const morningAt = firstStart - 10 * 60 * 1000;
    const name = userFirstName ? `, ${userFirstName}` : "";
    items.push({
      id: `morning-${dateKey}`,
      at: morningAt,
      title: `Bonjour${name} ☀️`,
      body: pickMorningQuote(dateKey),
      tag: "tempo-morning",
      kind: "morning",
    });
  }

  // Per-task notifications.
  sorted.forEach((t, idx) => {
    if ((completions || {})[t.id]) return;
    const startMs = dateAtTime(todayDate, t.start);
    const endMs = dateAtTime(todayDate, t.end);
    const duration = endMs - startMs;

    // Start of task.
    items.push({
      id: `start-${t.id}-${dateKey}`,
      at: startMs,
      title: `▶︎ ${t.name}`,
      body: `C'est parti — ${t.start} → ${t.end}`,
      tag: `tempo-start-${t.id}`,
      kind: "start",
    });

    // 2 min before end — only if the task is at least 3 min long.
    if (duration >= 3 * 60 * 1000) {
      items.push({
        id: `warn-${t.id}-${dateKey}`,
        at: endMs - 2 * 60 * 1000,
        title: `⏳ Plus que 2 min`,
        body: `${t.name} se termine bientôt`,
        tag: `tempo-warn-${t.id}`,
        kind: "warn",
      });
    }

    // End of task.
    const next = sorted.slice(idx + 1).find((n) => !(completions || {})[n.id]);
    const endBody = next
      ? `Prochaine tâche : ${next.name} à ${next.start}`
      : "Belle journée — tu as bouclé ta dernière tâche.";
    items.push({
      id: `end-${t.id}-${dateKey}`,
      at: endMs,
      title: `✓ ${t.name} terminée`,
      body: endBody,
      tag: `tempo-end-${t.id}`,
      kind: "end",
    });

    // Upcoming reminder for next task — 5 min before it starts, only if there's
    // a gap (otherwise the start notif covers it).
    if (next) {
      const nextStart = dateAtTime(todayDate, next.start);
      if (nextStart - endMs >= 10 * 60 * 1000) {
        items.push({
          id: `upcoming-${next.id}-${dateKey}`,
          at: nextStart - 5 * 60 * 1000,
          title: `🔔 Dans 5 min`,
          body: `${next.name} démarre à ${next.start}`,
          tag: `tempo-upcoming-${next.id}`,
          kind: "upcoming",
        });
      }
    }
  });

  // Filter past + dedupe by id (keep first).
  const now = Date.now();
  const seen = new Set();
  return items
    .filter((i) => i.at > now + 1000)
    .filter((i) => { if (seen.has(i.id)) return false; seen.add(i.id); return true; })
    .sort((a, b) => a.at - b.at);
}

export function useNotifications() {
  const {
    notificationsEnabled, tasks, dayCompletions, user, selectedDay,
  } = useFocus();
  const lastScheduledRef = useRef("");

  useEffect(() => {
    if (!notificationsSupported()) return;
    if (!notificationsEnabled || notificationPermission() !== "granted") {
      cancelScheduledNotifications();
      lastScheduledRef.current = "";
      return;
    }

    // Only schedule for today's day view; viewing a future/past day doesn't
    // re-arm notifications for that day (they fire only on their real date).
    const today = new Date();
    const todayWeekIdx = (today.getDay() + 6) % 7; // 0 = Monday
    if (selectedDay !== todayWeekIdx) {
      // Don't cancel: notifications for "today" were last scheduled when
      // selectedDay was today. We just skip rescheduling from a different view.
      return;
    }

    const items = buildSchedule({
      tasks,
      completions: dayCompletions,
      todayDate: today,
      userFirstName: user?.firstName,
    });

    const signature = JSON.stringify(items.map((i) => [i.id, i.at]));
    if (signature === lastScheduledRef.current) return;
    lastScheduledRef.current = signature;
    scheduleNotifications(items);
  }, [notificationsEnabled, tasks, dayCompletions, user, selectedDay]);

  // Periodic re-sync: every 5 min, refresh schedule (in case SW was restarted).
  useEffect(() => {
    if (!notificationsEnabled) return undefined;
    const id = setInterval(() => { lastScheduledRef.current = ""; }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [notificationsEnabled]);
}
