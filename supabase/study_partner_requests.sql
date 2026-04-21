-- BPSC Cosmos Study Partner Matching
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.study_partner_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  exam_target text not null default '72nd BPSC',
  stage text not null default 'Revision',
  district text not null default 'Bihar',
  language text not null default 'Hindi + English',
  gender_preference text not null default 'No preference',
  partner_gender_preference text not null default 'No preference',
  study_mode text not null default 'Accountability + Silent Study',
  daily_hours text not null default '2-3 hrs/day',
  slots text[] not null default '{}',
  weak_subjects text[] not null default '{}',
  strong_subjects text[] not null default '{}',
  bio text not null default '',
  seriousness_score integer not null default 60 check (seriousness_score between 0 and 100),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.study_partner_connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected', 'cancelled')),
  opener text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  responded_at timestamptz,
  unique (requester_id, receiver_id),
  check (requester_id <> receiver_id)
);

create table if not exists public.study_partner_messages (
  id bigint generated always as identity primary key,
  connection_id uuid not null references public.study_partner_connections(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 600),
  created_at timestamptz not null default timezone('utc', now()),
  read_at timestamptz
);

create table if not exists public.study_partner_reports (
  id bigint generated always as identity primary key,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (char_length(reason) between 3 and 300),
  created_at timestamptz not null default timezone('utc', now()),
  unique (reporter_id, reported_user_id)
);

create table if not exists public.study_partner_checkins (
  id bigint generated always as identity primary key,
  connection_id uuid not null references public.study_partner_connections(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  target text not null default '',
  completed boolean not null default false,
  focus_minutes integer not null default 0 check (focus_minutes between 0 and 1440),
  mood text not null default 'steady',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (connection_id, user_id, checkin_date)
);

create index if not exists study_partner_profiles_active_idx
  on public.study_partner_profiles (is_active, updated_at desc);

create index if not exists study_partner_connections_people_idx
  on public.study_partner_connections (requester_id, receiver_id, status);

create index if not exists study_partner_messages_connection_idx
  on public.study_partner_messages (connection_id, created_at);

create index if not exists study_partner_checkins_connection_idx
  on public.study_partner_checkins (connection_id, checkin_date desc);

alter table public.study_partner_profiles enable row level security;
alter table public.study_partner_connections enable row level security;
alter table public.study_partner_messages enable row level security;
alter table public.study_partner_reports enable row level security;
alter table public.study_partner_checkins enable row level security;

drop policy if exists "partner_profiles_read_active" on public.study_partner_profiles;
create policy "partner_profiles_read_active"
  on public.study_partner_profiles for select
  to authenticated
  using (is_active = true or auth.uid() = user_id);

drop policy if exists "partner_profiles_insert_own" on public.study_partner_profiles;
create policy "partner_profiles_insert_own"
  on public.study_partner_profiles for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "partner_profiles_update_own" on public.study_partner_profiles;
create policy "partner_profiles_update_own"
  on public.study_partner_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "partner_connections_read_own" on public.study_partner_connections;
create policy "partner_connections_read_own"
  on public.study_partner_connections for select
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists "partner_connections_insert_own" on public.study_partner_connections;
create policy "partner_connections_insert_own"
  on public.study_partner_connections for insert
  to authenticated
  with check (auth.uid() = requester_id);

drop policy if exists "partner_connections_update_own" on public.study_partner_connections;
create policy "partner_connections_update_own"
  on public.study_partner_connections for update
  to authenticated
  using (auth.uid() = requester_id or auth.uid() = receiver_id)
  with check (auth.uid() = requester_id or auth.uid() = receiver_id);

drop policy if exists "partner_messages_read_accepted_members" on public.study_partner_messages;
create policy "partner_messages_read_accepted_members"
  on public.study_partner_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.study_partner_connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (auth.uid() = c.requester_id or auth.uid() = c.receiver_id)
    )
  );

drop policy if exists "partner_messages_insert_accepted_members" on public.study_partner_messages;
create policy "partner_messages_insert_accepted_members"
  on public.study_partner_messages for insert
  to authenticated
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.study_partner_connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (auth.uid() = c.requester_id or auth.uid() = c.receiver_id)
    )
  );

drop policy if exists "partner_reports_insert_own" on public.study_partner_reports;
create policy "partner_reports_insert_own"
  on public.study_partner_reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

drop policy if exists "partner_reports_read_own" on public.study_partner_reports;
create policy "partner_reports_read_own"
  on public.study_partner_reports for select
  to authenticated
  using (auth.uid() = reporter_id);

drop policy if exists "partner_checkins_read_accepted_members" on public.study_partner_checkins;
create policy "partner_checkins_read_accepted_members"
  on public.study_partner_checkins for select
  to authenticated
  using (
    exists (
      select 1 from public.study_partner_connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (auth.uid() = c.requester_id or auth.uid() = c.receiver_id)
    )
  );

drop policy if exists "partner_checkins_insert_own" on public.study_partner_checkins;
create policy "partner_checkins_insert_own"
  on public.study_partner_checkins for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.study_partner_connections c
      where c.id = connection_id
        and c.status = 'accepted'
        and (auth.uid() = c.requester_id or auth.uid() = c.receiver_id)
    )
  );

drop policy if exists "partner_checkins_update_own" on public.study_partner_checkins;
create policy "partner_checkins_update_own"
  on public.study_partner_checkins for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

do $$
begin
  alter publication supabase_realtime add table public.study_partner_profiles;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.study_partner_connections;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.study_partner_messages;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.study_partner_checkins;
exception when duplicate_object then null;
end $$;

-- Optional cleanup for stale inactive profiles:
-- update public.study_partner_profiles
-- set is_active = false
-- where updated_at < now() - interval '30 days';
