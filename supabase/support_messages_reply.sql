-- Run this in Supabase SQL Editor to add reply support

alter table public.support_messages
  add column if not exists reply_to_id bigint references public.support_messages(id) on delete set null,
  add column if not exists reply_to_text text,
  add column if not exists reply_to_username text;
