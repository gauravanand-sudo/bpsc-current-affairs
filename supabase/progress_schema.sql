create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.study_set_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  set_name text not null,
  marked_card_ids integer[] not null default '{}',
  categories text[] not null default '{}',
  cards_completed integer not null default 0,
  started_at timestamptz not null default timezone('utc', now()),
  last_read_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, month, set_name)
);

create table if not exists public.quiz_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  month text not null,
  set_name text not null,
  title text,
  latest_score numeric(8,2) not null default 0,
  max_score integer not null default 0,
  percentage numeric(8,2) not null default 0,
  qualified boolean not null default false,
  time_taken integer,
  attempts_count integer not null default 1,
  best_score numeric(8,2) not null default 0,
  best_percentage numeric(8,2) not null default 0,
  first_attempted_at timestamptz not null default timezone('utc', now()),
  last_attempted_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, month, set_name)
);

alter table public.quiz_progress add column if not exists latest_attempt_answers jsonb;
alter table public.quiz_progress add column if not exists best_attempt_answers jsonb;
alter table public.quiz_progress add column if not exists best_time_taken integer;

alter table public.profiles enable row level security;
alter table public.study_set_progress enable row level security;
alter table public.quiz_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_upsert_own" on public.profiles;
create policy "profiles_upsert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "study_progress_select_own" on public.study_set_progress;
create policy "study_progress_select_own"
  on public.study_set_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "study_progress_upsert_own" on public.study_set_progress;
create policy "study_progress_upsert_own"
  on public.study_set_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "study_progress_update_own" on public.study_set_progress;
create policy "study_progress_update_own"
  on public.study_set_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "study_progress_delete_own" on public.study_set_progress;
create policy "study_progress_delete_own"
  on public.study_set_progress for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_progress_select_own" on public.quiz_progress;
create policy "quiz_progress_select_own"
  on public.quiz_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "quiz_progress_upsert_own" on public.quiz_progress;
create policy "quiz_progress_upsert_own"
  on public.quiz_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "quiz_progress_update_own" on public.quiz_progress;
create policy "quiz_progress_update_own"
  on public.quiz_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    email = excluded.email,
    updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();
