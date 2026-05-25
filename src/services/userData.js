import { supabase } from "../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────
// user_data service — snapshot JSONB du state applicatif.
// Une seule ligne par utilisateur ; upsert atomique.
// La forme exacte des objets reste celle utilisée par FocusContext,
// pour éviter toute transformation côté composants.
// ─────────────────────────────────────────────────────────────────────────

const SHAPE = {
  weekTasks:          {},
  weekFloatingTasks:  {},
  completions:        {},
  dayMetrics:         {},
  customTemplates:    [],
  customTheme:        "default",
  settings:           {},
};

const dbToApp = (row) => {
  if (!row) return { ...SHAPE };
  return {
    weekTasks:         row.week_tasks          || {},
    weekFloatingTasks: row.week_floating_tasks || {},
    completions:       row.completions         || {},
    dayMetrics:        row.day_metrics         || {},
    customTemplates:   row.custom_templates    || [],
    customTheme:       row.custom_theme        || "default",
    settings:          row.settings            || {},
  };
};

const appToDb = (s) => ({
  week_tasks:          s.weekTasks          ?? {},
  week_floating_tasks: s.weekFloatingTasks  ?? {},
  completions:         s.completions        ?? {},
  day_metrics:         s.dayMetrics         ?? {},
  custom_templates:    s.customTemplates    ?? [],
  custom_theme:        s.customTheme        ?? "default",
  settings:            s.settings           ?? {},
});

export async function fetchUserData(userId) {
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return { snapshot: dbToApp(data), error };
}

export async function saveUserData(userId, snapshot) {
  const payload = { user_id: userId, ...appToDb(snapshot) };
  const { error } = await supabase
    .from("user_data")
    .upsert(payload, { onConflict: "user_id" });
  return { error };
}

export { SHAPE as USER_DATA_SHAPE };
