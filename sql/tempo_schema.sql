-- =========================================================================
-- TEMPO. — Schéma Supabase complet
-- À coller dans Supabase SQL Editor (une seule fois).
-- Idempotent : utilise IF NOT EXISTS / DROP POLICY IF EXISTS.
-- =========================================================================

-- =========================================================================
-- 1. EXTENSIONS
-- =========================================================================
create extension if not exists "pgcrypto";

-- =========================================================================
-- 2. TABLE  profiles
--    1 ligne par utilisateur, miroir de auth.users.id
-- =========================================================================
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  first_name    text,
  last_name     text,
  birth_date    date,
  email         text not null,
  city          text default '',
  bio           text default '',
  photo_url     text,
  trial_start   timestamptz not null default now(),
  is_subscribed boolean not null default false,
  subscription_start timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (lower(email));

-- =========================================================================
-- 3. TABLE  user_data
--    État applicatif sérialisé (tâches, planning, stats, completions,
--    metrics, custom templates, paramètres, thème).
--    1 ligne par utilisateur — full snapshot JSONB, upsert simple.
-- =========================================================================
create table if not exists public.user_data (
  user_id               uuid primary key references auth.users(id) on delete cascade,
  week_tasks            jsonb not null default '{}'::jsonb,
  week_floating_tasks   jsonb not null default '{}'::jsonb,
  completions           jsonb not null default '{}'::jsonb,
  floating_completions  jsonb not null default '{}'::jsonb,
  day_metrics           jsonb not null default '{}'::jsonb,
  custom_templates      jsonb not null default '[]'::jsonb,
  custom_theme          text  not null default 'default',
  settings              jsonb not null default '{}'::jsonb,
  updated_at            timestamptz not null default now()
);

-- Migration : ajout idempotent de la colonne pour bases existantes.
alter table public.user_data
  add column if not exists floating_completions jsonb not null default '{}'::jsonb;

-- =========================================================================
-- 4. TABLES NORMALISÉES (optionnel — pour requêtes/analytics futures).
--    L'app courante utilise user_data.jsonb. Ces tables sont créées pour
--    permettre une migration progressive sans refactor immédiat.
-- =========================================================================
create table if not exists public.tasks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  day_index   smallint not null check (day_index between 0 and 6),
  name        text not null,
  start_time  text,            -- "HH:MM"
  end_time    text,            -- "HH:MM"
  category    text,
  subcategory text,
  notes       text,
  color       text,
  icon_key    text,
  status      text not null default 'pending',  -- pending | done | skipped
  is_floating boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists tasks_user_day_idx on public.tasks (user_id, day_index);

create table if not exists public.task_templates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text,
  duration_min int,
  icon_key   text,
  created_at timestamptz not null default now()
);
create index if not exists task_templates_user_idx on public.task_templates (user_id);

create table if not exists public.day_metrics (
  user_id    uuid not null references auth.users(id) on delete cascade,
  day_index  smallint not null check (day_index between 0 and 6),
  metrics    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, day_index)
);

create table if not exists public.user_settings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  theme      text not null default 'default',
  voice_on   boolean not null default true,
  ambient_volume real not null default 0.3,
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =========================================================================
-- 5. STORAGE  bucket "avatars"
-- =========================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- =========================================================================
-- 6. TRIGGER  auto-create profile + user_data on signup
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, first_name, last_name, birth_date)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'birth_date', '')::date
  )
  on conflict (id) do nothing;

  insert into public.user_data (user_id) values (new.id)
  on conflict (user_id) do nothing;

  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- 7. TRIGGER  auto-update updated_at
-- =========================================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_profiles_updated     on public.profiles;
drop trigger if exists trg_user_data_updated    on public.user_data;
drop trigger if exists trg_tasks_updated        on public.tasks;
drop trigger if exists trg_day_metrics_updated  on public.day_metrics;
drop trigger if exists trg_user_settings_updated on public.user_settings;

create trigger trg_profiles_updated     before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger trg_user_data_updated    before update on public.user_data
  for each row execute function public.set_updated_at();
create trigger trg_tasks_updated        before update on public.tasks
  for each row execute function public.set_updated_at();
create trigger trg_day_metrics_updated  before update on public.day_metrics
  for each row execute function public.set_updated_at();
create trigger trg_user_settings_updated before update on public.user_settings
  for each row execute function public.set_updated_at();

-- =========================================================================
-- 8. ROW LEVEL SECURITY
-- =========================================================================
alter table public.profiles       enable row level security;
alter table public.user_data      enable row level security;
alter table public.tasks          enable row level security;
alter table public.task_templates enable row level security;
alter table public.day_metrics    enable row level security;
alter table public.user_settings  enable row level security;

-- ---- profiles -----------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- ---- user_data ----------------------------------------------------------
drop policy if exists "user_data_select_own" on public.user_data;
drop policy if exists "user_data_insert_own" on public.user_data;
drop policy if exists "user_data_update_own" on public.user_data;
drop policy if exists "user_data_delete_own" on public.user_data;

create policy "user_data_select_own" on public.user_data
  for select using (auth.uid() = user_id);
create policy "user_data_insert_own" on public.user_data
  for insert with check (auth.uid() = user_id);
create policy "user_data_update_own" on public.user_data
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_data_delete_own" on public.user_data
  for delete using (auth.uid() = user_id);

-- ---- tasks --------------------------------------------------------------
drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert with check (auth.uid() = user_id);
create policy "tasks_update_own" on public.tasks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete using (auth.uid() = user_id);

-- ---- task_templates -----------------------------------------------------
drop policy if exists "templates_select_own" on public.task_templates;
drop policy if exists "templates_insert_own" on public.task_templates;
drop policy if exists "templates_update_own" on public.task_templates;
drop policy if exists "templates_delete_own" on public.task_templates;

create policy "templates_select_own" on public.task_templates
  for select using (auth.uid() = user_id);
create policy "templates_insert_own" on public.task_templates
  for insert with check (auth.uid() = user_id);
create policy "templates_update_own" on public.task_templates
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "templates_delete_own" on public.task_templates
  for delete using (auth.uid() = user_id);

-- ---- day_metrics --------------------------------------------------------
drop policy if exists "day_metrics_select_own" on public.day_metrics;
drop policy if exists "day_metrics_insert_own" on public.day_metrics;
drop policy if exists "day_metrics_update_own" on public.day_metrics;
drop policy if exists "day_metrics_delete_own" on public.day_metrics;

create policy "day_metrics_select_own" on public.day_metrics
  for select using (auth.uid() = user_id);
create policy "day_metrics_insert_own" on public.day_metrics
  for insert with check (auth.uid() = user_id);
create policy "day_metrics_update_own" on public.day_metrics
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "day_metrics_delete_own" on public.day_metrics
  for delete using (auth.uid() = user_id);

-- ---- user_settings ------------------------------------------------------
drop policy if exists "user_settings_select_own" on public.user_settings;
drop policy if exists "user_settings_insert_own" on public.user_settings;
drop policy if exists "user_settings_update_own" on public.user_settings;
drop policy if exists "user_settings_delete_own" on public.user_settings;

create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user_settings_delete_own" on public.user_settings
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- 9. STORAGE policies  (bucket: avatars)
--    Chemin attendu : <user_id>/avatar.<ext>
-- =========================================================================
drop policy if exists "avatars_public_read"  on storage.objects;
drop policy if exists "avatars_insert_own"   on storage.objects;
drop policy if exists "avatars_update_own"   on storage.objects;
drop policy if exists "avatars_delete_own"   on storage.objects;

create policy "avatars_public_read" on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own" on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_update_own" on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_delete_own" on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- =========================================================================
-- FIN
-- =========================================================================
