import { supabase } from "../lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────
// Profile service — table `profiles` + bucket `avatars`.
// ─────────────────────────────────────────────────────────────────────────

export async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return { profile: data, error };
}

export async function upsertProfile(userId, patch) {
  const payload = { id: userId, ...patch };
  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .maybeSingle();
  return { profile: data, error };
}

export async function updateProfile(userId, patch) {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select()
    .maybeSingle();
  return { profile: data, error };
}

// ─────────────────────────────────────────────────────────────────────────
// Upload photo de profil dans le bucket `avatars`.
// Chemin : <user_id>/avatar_<timestamp>.<ext>  (compatible policies RLS).
// Renvoie l'URL publique et la persiste dans profiles.photo_url.
// ─────────────────────────────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/avatar_${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (upErr) return { url: null, error: upErr };

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const url = pub?.publicUrl || null;

  if (url) {
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ photo_url: url })
      .eq("id", userId);
    if (profErr) return { url, error: profErr };
  }
  return { url, error: null };
}
