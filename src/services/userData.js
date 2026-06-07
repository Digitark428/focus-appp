import { supabase } from "../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────
// user_data service — snapshot JSONB du state applicatif.
// Une seule ligne par utilisateur ; upsert atomique.
// La forme exacte des objets reste celle utilisée par FocusContext,
// pour éviter toute transformation côté composants.
// ─────────────────────────────────────────────────────────────────────────

const SHAPE = {
  weekTasks:           {},
  weekFloatingTasks:   {},
  completions:         {},
  floatingCompletions: {},
  dayMetrics:          {},
  customTemplates:     [],
  customTheme:         "default",
  settings:            {},
};

const dbToApp = (row) => {
  if (!row) return { ...SHAPE };
  return {
    weekTasks:           row.week_tasks            || {},
    weekFloatingTasks:   row.week_floating_tasks   || {},
    completions:         row.completions           || {},
    floatingCompletions: row.floating_completions  || {},
    dayMetrics:          row.day_metrics           || {},
    customTemplates:     row.custom_templates      || [],
    customTheme:         row.custom_theme          || "default",
    settings:            row.settings              || {},
  };
};

const appToDb = (s) => ({
  week_tasks:            s.weekTasks           ?? {},
  week_floating_tasks:   s.weekFloatingTasks   ?? {},
  completions:           s.completions         ?? {},
  floating_completions:  s.floatingCompletions ?? {},
  day_metrics:           s.dayMetrics          ?? {},
  custom_templates:      s.customTemplates     ?? [],
  custom_theme:          s.customTheme         ?? "default",
  settings:              s.settings            ?? {},
});

// ─────────────────────────────────────────────────────────────────────────
// Intégrité : un snapshot est "vide" si aucune donnée utilisateur réelle.
// Sert de garde-fou : on ne doit JAMAIS écraser un cloud non-vide par du vide
// tant que l'hydratation n'est pas terminée.
// ─────────────────────────────────────────────────────────────────────────
const hasEntries = (obj) =>
  obj && typeof obj === "object" &&
  Object.values(obj).some((v) =>
    Array.isArray(v) ? v.length > 0 : v && typeof v === "object" && Object.keys(v).length > 0,
  );

export function isSnapshotEmpty(s) {
  if (!s) return true;
  return !(
    hasEntries(s.weekTasks) ||
    hasEntries(s.weekFloatingTasks) ||
    hasEntries(s.completions) ||
    hasEntries(s.floatingCompletions) ||
    hasEntries(s.dayMetrics) ||
    (Array.isArray(s.customTemplates) && s.customTemplates.length > 0)
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Cache local (localStorage) — filet de sécurité synchrone & instantané.
// Survit au rechargement, aux coupures réseau et à la fermeture d'onglet
// avant la fin du debounce. Clé par utilisateur.
// ─────────────────────────────────────────────────────────────────────────
const LOCAL_KEY = (uid) => `tempo.userdata.${uid}`;

export function readLocalSnapshot(uid) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY(uid));
    if (!raw) return null;
    return { ...SHAPE, ...JSON.parse(raw) };
  } catch { return null; }
}

export function writeLocalSnapshot(uid, snapshot) {
  try { localStorage.setItem(LOCAL_KEY(uid), JSON.stringify(appToAppShape(snapshot))); } catch { /* quota */ }
}

export function clearLocalSnapshot(uid) {
  try { localStorage.removeItem(LOCAL_KEY(uid)); } catch { /* noop */ }
}

// Normalise le snapshot applicatif (sans dépendre du nommage DB).
const appToAppShape = (s) => ({
  weekTasks:           s.weekTasks           ?? {},
  weekFloatingTasks:   s.weekFloatingTasks   ?? {},
  completions:         s.completions         ?? {},
  floatingCompletions: s.floatingCompletions ?? {},
  dayMetrics:          s.dayMetrics          ?? {},
  customTemplates:     s.customTemplates     ?? [],
  customTheme:         s.customTheme         ?? "default",
  settings:            s.settings            ?? {},
});

export async function fetchUserData(userId) {
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return { snapshot: dbToApp(data), error, raw: data };
}

// Upsert avec 1 retry automatique en cas d'erreur réseau transitoire.
export async function saveUserData(userId, snapshot) {
  const payload = { user_id: userId, ...appToDb(snapshot) };
  let { error } = await supabase
    .from("user_data")
    .upsert(payload, { onConflict: "user_id" });
  if (error) {
    await new Promise((r) => setTimeout(r, 1200));
    ({ error } = await supabase
      .from("user_data")
      .upsert(payload, { onConflict: "user_id" }));
  }
  return { error };
}

export { SHAPE as USER_DATA_SHAPE };
