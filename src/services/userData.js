import { supabase, supabaseUrl, supabaseAnonKey } from "../lib/supabaseClient";
import { weekDatesFrom } from "../utils/time";

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

// Forme stockée : { v: 2, data: <snapshot>, updatedAt: <ms epoch> }
// (back-compat avec l'ancienne forme V12 sans wrapper : updatedAt = 0 → cloud gagne)
export function readLocalSnapshot(uid) {
  try {
    const raw = localStorage.getItem(LOCAL_KEY(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.data && typeof parsed.updatedAt === "number") {
      return { data: { ...SHAPE, ...parsed.data }, updatedAt: parsed.updatedAt };
    }
    // Ancienne forme : objet snapshot brut.
    return { data: { ...SHAPE, ...parsed }, updatedAt: 0 };
  } catch { return null; }
}

export function writeLocalSnapshot(uid, snapshot) {
  try {
    const payload = { v: 2, data: appToAppShape(snapshot), updatedAt: Date.now() };
    localStorage.setItem(LOCAL_KEY(uid), JSON.stringify(payload));
  } catch { /* quota */ }
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
// Erreurs systématiquement logguées avec préfixe `[tempo-sync]` pour
// diagnostic via la console navigateur.
export async function saveUserData(userId, snapshot) {
  const payload = { user_id: userId, ...appToDb(snapshot) };
  // eslint-disable-next-line no-console
  console.debug("[tempo-sync] upsert →", { userId, keys: Object.keys(snapshot.weekTasks || {}) });
  let { error } = await supabase
    .from("user_data")
    .upsert(payload, { onConflict: "user_id" });
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("[tempo-sync] upsert ÉCHEC (1/2)", error);
    await new Promise((r) => setTimeout(r, 1200));
    ({ error } = await supabase
      .from("user_data")
      .upsert(payload, { onConflict: "user_id" }));
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[tempo-sync] upsert ÉCHEC DÉFINITIF", error);
    }
  } else {
    // eslint-disable-next-line no-console
    console.debug("[tempo-sync] upsert OK");
  }
  return { error };
}

// Garantit l'existence de la ligne user_data pour cet utilisateur.
// Utile si le trigger `handle_new_user` n'a pas tourné (compte créé
// avant que le SQL ne soit appliqué côté Supabase, ou trigger désactivé).
// Sans cette ligne, une UPDATE RLS pourrait être rejetée.
export async function ensureUserDataRow(userId) {
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("[tempo-sync] ensureUserDataRow ÉCHEC", error);
  }
  return { error };
}

// ─────────────────────────────────────────────────────────────────────────
// Flush SYNCHRONE à la fermeture de l'onglet (pagehide / visibilitychange) :
// utilise fetch keepalive pour garantir l'envoi vers Supabase même si le
// navigateur est en train de décharger la page. Évite la perte d'une édition
// faite juste avant la fermeture (cas typique : reset day puis fermeture
// immédiate, < 800 ms — le debounce n'avait pas encore tiré).
//
// L'access_token doit être passé par l'appelant (capturé via onAuthChange)
// pour rester 100 % synchrone : pas d'await ici.
// ─────────────────────────────────────────────────────────────────────────
export function flushSaveBeacon(userId, accessToken, snapshot) {
  if (!userId || !accessToken) return false;
  try {
    const body = JSON.stringify({ user_id: userId, ...appToDb(snapshot) });
    fetch(`${supabaseUrl}/rest/v1/user_data?on_conflict=user_id`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body,
    }).catch(() => {});
    return true;
  } catch { return false; }
}

export { SHAPE as USER_DATA_SHAPE };

// ─────────────────────────────────────────────────────────────────────────
// MIGRATION v1 → v2 : passage du modèle indexé par jour de semaine (0–6) au
// modèle calendaire daté ("YYYY-MM-DD").
//
// Les anciennes données n'avaient AUCUNE notion de semaine réelle : "mercredi"
// était partagé entre toutes les semaines (d'où les tâches qui "réapparaissent").
// La seule interprétation cohérente : rattacher chaque jour de semaine N à la
// date réelle de ce jour dans la SEMAINE COURANTE au moment de la migration.
// Le plan existant de l'utilisateur est ainsi préservé pour la semaine en cours ;
// les semaines suivantes démarrent proprement vides.
//
// Idempotent : ne transforme que les clés numériques 0–6. Les clés déjà datées
// (contenant "-") sont laissées intactes → ré-exécution sans effet.
// ─────────────────────────────────────────────────────────────────────────
const isLegacyKeyed = (obj) =>
  !!obj && typeof obj === "object" &&
  Object.keys(obj).length > 0 &&
  Object.keys(obj).every((k) => /^[0-6]$/.test(k));

export function isLegacySnapshot(s) {
  if (!s) return false;
  return (
    isLegacyKeyed(s.weekTasks) ||
    isLegacyKeyed(s.weekFloatingTasks) ||
    isLegacyKeyed(s.completions) ||
    isLegacyKeyed(s.floatingCompletions) ||
    isLegacyKeyed(s.dayMetrics)
  );
}

export function migrateSnapshot(snapshot) {
  if (!isLegacySnapshot(snapshot)) return snapshot;
  const dates = weekDatesFrom(); // Lun…Dim de la semaine courante
  const remap = (obj) => {
    if (!isLegacyKeyed(obj)) return obj || {};
    const out = {};
    Object.entries(obj).forEach(([k, v]) => {
      const idx = Number(k);
      if (idx >= 0 && idx <= 6) out[dates[idx]] = v;
    });
    return out;
  };
  return {
    ...snapshot,
    weekTasks:           remap(snapshot.weekTasks),
    weekFloatingTasks:   remap(snapshot.weekFloatingTasks),
    completions:         remap(snapshot.completions),
    floatingCompletions: remap(snapshot.floatingCompletions),
    dayMetrics:          remap(snapshot.dayMetrics),
  };
}
