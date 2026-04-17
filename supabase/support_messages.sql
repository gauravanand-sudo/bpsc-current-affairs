-- Run this in Supabase SQL Editor

create table if not exists public.support_messages (
  id          bigserial primary key,
  text        text not null check (char_length(text) <= 500),
  username    text not null default 'Aspirant',
  created_at  timestamptz not null default now()
);

-- Only keep last 200 messages (auto-cleanup old ones)
create or replace function public.trim_support_messages()
returns trigger language plpgsql as $$
begin
  delete from public.support_messages
  where id not in (
    select id from public.support_messages
    order by created_at desc
    limit 200
  );
  return null;
end;
$$;

drop trigger if exists trim_support_messages_trigger on public.support_messages;
create trigger trim_support_messages_trigger
  after insert on public.support_messages
  for each statement execute function public.trim_support_messages();

-- Allow anyone to read and insert (anonymous chat)
alter table public.support_messages enable row level security;

create policy "Anyone can read messages"
  on public.support_messages for select
  using (true);

create policy "Anyone can insert messages"
  on public.support_messages for insert
  with check (char_length(text) > 0 and char_length(text) <= 500);

-- Enable Realtime on this table
alter publication supabase_realtime add table public.support_messages;
