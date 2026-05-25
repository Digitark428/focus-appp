# Tempo. — Intégration Backend Supabase

## Fichiers livrés

```
sql/tempo_schema.sql              ← à coller dans Supabase SQL Editor
.env.example                      ← à dupliquer en .env (local) + Vercel
src/lib/supabaseClient.js         ← NEW
src/services/auth.js              ← NEW
src/services/profile.js           ← NEW
src/services/userData.js          ← NEW
src/context/FocusContext.jsx      ← REPLACE (version patchée)
src/FocusApp.jsx                  ← REPLACE (gate authReady)
```

## Étapes d'intégration

### 1. Installer la dépendance
```bash
npm i @supabase/supabase-js
```

### 2. Créer le projet Supabase
- Dashboard Supabase → New Project
- Project Settings → API → copier `Project URL` et `anon public key`

### 3. Variables d'environnement
- Local : créer `.env` à la racine à partir de `.env.example`
- Vercel : Project → Settings → Environment Variables
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 4. Schéma SQL
- Supabase Dashboard → SQL Editor → coller `sql/tempo_schema.sql` → Run
- Vérifier : Database → Tables → `profiles`, `user_data`, `tasks`, `task_templates`, `day_metrics`, `user_settings`
- Vérifier : Storage → bucket `avatars` (public)
- Vérifier : Authentication → Policies (RLS activé sur toutes les tables)

### 5. Auth settings
- Authentication → Providers → Email : activer
- Authentication → URL Configuration → Site URL = ton domaine Vercel
- (optionnel) désactiver la confirmation email pour les tests : Authentication → Email Auth → "Confirm email" OFF

### 6. Remplacer les fichiers
Copier les fichiers livrés aux mêmes chemins relatifs.

### 7. Build & deploy
```bash
npm run build
```
Push → Vercel redeploie automatiquement.

## Ce qui change côté UX

| Avant                       | Après                                 |
|-----------------------------|---------------------------------------|
| Comptes locaux (localStorage) | Comptes Supabase Auth (email+pwd)  |
| Session locale              | Session JWT persistante (auto-refresh)|
| Données partagées navigateur | Données privées par `auth.uid()`     |
| Photo profil en base64      | Upload Storage `avatars/<uid>/...`    |
| "Mot de passe oublié" no-op | Email Supabase réel                   |

## Ce qui ne change pas

- UI / branding / dashboard / planning / stats / timers
- Architecture des composants
- Signatures des handlers exposés par `useFocus()` (`handleSignup`, `handleLogin`, `handleLogout`, `handleForgotPassword`, `changePassword`, `handlePhotoUpload`)
- Forme de l'objet `user` (firstName, lastName, email, photo, trialStart, isSubscribed, …)

## Sécurité

- RLS activé sur **toutes** les tables.
- Chaque policy filtre via `auth.uid()` → un utilisateur ne peut lire/écrire que ses propres lignes.
- Bucket `avatars` : lecture publique (pour afficher les photos), upload/update/delete uniquement dans `<auth.uid()>/...`.
- L'`anon key` est publique par design (côté client) — la sécurité est garantie par RLS, pas par la clé.

## Notes

- Le snapshot applicatif (tâches, planning, completions, metrics, templates, thème) est sauvegardé en **JSONB unique** dans `user_data`. C'est intentionnel : aucun refactor des composants, sync atomique, debouncée à 800 ms.
- Les tables normalisées (`tasks`, `task_templates`, `day_metrics`, `user_settings`) sont créées pour permettre une migration progressive vers un modèle relationnel sans nouveau script SQL.
- Si `VITE_SUPABASE_URL` est absent, l'app log un warning et tourne en mode dégradé (utile en dev). Aucun crash.
- `handleBetaBypass` est conservé tel quel mais **ne crée plus de session Supabase** : à retirer du SignupScreen avant la mise en prod si tu ne veux pas d'accès anonyme.

## Vérifications post-déploiement

1. Créer un compte → vérifier la création de lignes dans `profiles` et `user_data`.
2. Se déconnecter / reconnecter → session restaurée, données présentes.
3. Ajouter une tâche → recharger la page → la tâche est toujours là.
4. Upload photo profil → vérifier le bucket `avatars` (chemin `<uid>/avatar_*.jpg`).
5. Créer un 2e compte → confirmer qu'il ne voit pas les données du 1er.
