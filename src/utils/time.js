// Returns "Monday=0 ... Sunday=6" based on the local date.
// JS Date.getDay() returns 0=Sunday so we shift.
export const todayIndex = () => {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
};

// ─────────────────────────────────────────────────────────────────────────
// Modèle calendaire daté (clé "YYYY-MM-DD" en heure locale, sans décalage UTC).
// ─────────────────────────────────────────────────────────────────────────

// Date locale -> "YYYY-MM-DD".
export const isoDate = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
export const todayISO = () => isoDate(new Date());

// Index jour de semaine (Lundi=0 … Dimanche=6) à partir d'une date ISO.
export const weekdayIndex = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  const wd = new Date(y, m - 1, d).getDay(); // 0=Dimanche
  return wd === 0 ? 6 : wd - 1;
};

// Décale une date ISO de n jours.
export const addDaysISO = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  return isoDate(new Date(y, m - 1, d + n));
};

// Lundi (ISO) de la semaine contenant la date donnée.
export const startOfWeekISO = (iso = todayISO()) => addDaysISO(iso, -weekdayIndex(iso));

// Tableau des 7 dates ISO (Lun…Dim) de la semaine contenant `anchorISO`.
export const weekDatesFrom = (anchorISO = todayISO()) => {
  const monday = startOfWeekISO(anchorISO);
  return Array.from({ length: 7 }, (_, i) => addDaysISO(monday, i));
};

// Libellé court "4 juin".
export const dayMonthLabel = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

// Libellé de plage de semaine "2 – 8 juin".
export const weekRangeLabel = (anchorISO = todayISO()) => {
  const dates = weekDatesFrom(anchorISO);
  return `${dayMonthLabel(dates[0])} – ${dayMonthLabel(dates[6])}`;
};

// "HH:MM" -> total minutes since midnight.
export const toMin = (hm) => {
  const [h, m] = hm.split(":").map(Number);
  return h * 60 + m;
};

// Total minutes since midnight -> "HH:MM" (clamped to 24h).
export const fromMin = (m) => {
  const hours = Math.floor(m / 60) % 24;
  const mins = m % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
};

// Format seconds as "M:SS" or "H:MM:SS".
export const formatTime = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// Compute the age in full years from a birthdate string (YYYY-MM-DD).
export const calcAge = (birthDate) => {
  if (!birthDate) return "";
  const d = new Date(birthDate);
  const t = new Date();
  let a = t.getFullYear() - d.getFullYear();
  const m = t.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < d.getDate())) a--;
  return a;
};

// Returns true if two time windows [aStart, aEnd) and [bStart, bEnd) overlap.
export const overlaps = (aStart, aEnd, bStart, bEnd) => {
  return toMin(aStart) < toMin(bEnd) && toMin(bStart) < toMin(aEnd);
};

// Find tasks in `taskList` that conflict with `candidateStart`/`candidateEnd`.
// `excludeId` lets us ignore a specific task (e.g. when editing).
export const findConflicts = (taskList, candidateStart, candidateEnd, excludeId = null) => {
  return taskList.filter(
    (t) => t.id !== excludeId && overlaps(t.start, t.end, candidateStart, candidateEnd),
  );
};

// Shift all tasks whose start is at or after `fromMinTime` by `shiftMin` minutes.
export const cascadeShift = (taskList, fromMinTime, shiftMin) => {
  return taskList.map((t) => {
    if (toMin(t.start) >= fromMinTime) {
      return {
        ...t,
        start: fromMin(toMin(t.start) + shiftMin),
        end: fromMin(toMin(t.end) + shiftMin),
      };
    }
    return t;
  });
};

// Returns true if cascading would push any task past midnight.
export const cascadeWouldOverflow = (taskList, fromMinTime, shiftMin) => {
  return taskList.some(
    (t) => toMin(t.start) >= fromMinTime && toMin(t.end) + shiftMin > 24 * 60,
  );
};

// Returns the list of overlapping pairs found in a task list.
export const detectExistingConflicts = (tasks) => {
  const conflicts = [];
  const sorted = [...tasks].sort((a, b) => toMin(a.start) - toMin(b.start));
  for (let i = 0; i < sorted.length; i++) {
    for (let j = i + 1; j < sorted.length; j++) {
      if (overlaps(sorted[i].start, sorted[i].end, sorted[j].start, sorted[j].end)) {
        conflicts.push({ taskA: sorted[i], taskB: sorted[j] });
      }
    }
  }
  return conflicts;
};

// Today as a unique string key (YYYY-MM-DD) used to prevent double-validation.
export const todayDateKey = (date = new Date()) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};
