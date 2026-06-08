import { createClient } from "@supabase/supabase-js";

const url     = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Pas de throw : l'app peut tourner en mode dégradé sans backend
  // (utile en dev local sans .env). Les services échouent gracieusement.
  // eslint-disable-next-line no-console
  console.warn("[tempo] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY manquants.");
}

export const supabaseUrl = url || "http://localhost";
export const supabaseAnonKey = anonKey || "anon";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    storageKey: "tempo.auth",
  },
});

export const hasSupabase = Boolean(url && anonKey);
