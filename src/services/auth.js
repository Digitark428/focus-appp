import { supabase } from "../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────
// Auth service — wrapper fin autour de Supabase Auth.
// Renvoie systématiquement { data, error } pour conserver une API stable
// vis-à-vis des handlers du FocusContext.
// ─────────────────────────────────────────────────────────────────────────

export async function signUp({ email, password, firstName, lastName, birthDate }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
      },
    },
  });
  return { data, error };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session || null, error };
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user || null, error };
}

export function onAuthChange(cb) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => cb(session));
  return () => data?.subscription?.unsubscribe?.();
}

export async function resetPasswordForEmail(email) {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  return { error };
}

// Change le mot de passe de l'utilisateur connecté.
// Supabase ne propose pas la vérification du mot de passe actuel
// côté serveur — on la fait en local via une tentative de signIn.
export async function changePassword({ email, current, next }) {
  const { error: signErr } = await supabase.auth.signInWithPassword({
    email,
    password: current,
  });
  if (signErr) return { error: { message: "Mot de passe actuel incorrect." } };

  const { error } = await supabase.auth.updateUser({ password: next });
  return { error };
}

export async function updateAuthEmail(email) {
  const { error } = await supabase.auth.updateUser({ email });
  return { error };
}
