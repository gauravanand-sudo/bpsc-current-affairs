-- Study Partner Board
create table if not exists study_partner_requests (
  id bigint generated always as identity primary key,
  username text not null,
  topic text not null,
  hours text not null,         -- e.g. "2–3 hrs/day"
  medium text not null,        -- "WhatsApp" | "Telegram" | "This chat"
  contact_hint text,           -- optional: @handle or last 4 digits
  created_at timestamptz default now()
);

alter table study_partner_requests enable row level security;

create policy "Anyone can read study partners"
  on study_partner_requests for select using (true);

create policy "Anyone can post as partner seeker"
  on study_partner_requests for insert with check (
    char_length(topic) <= 120 and
    char_length(username) <= 60
  );

-- Realtime
alter publication supabase_realtime add table study_partner_requests;

-- Auto-delete entries older than 24 hours (run this as a cron or call manually)
-- delete from study_partner_requests where created_at < now() - interval '24 hours';
