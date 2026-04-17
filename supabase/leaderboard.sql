-- Leaderboard function (security definer bypasses RLS on quiz_progress)
create or replace function get_weekly_leaderboard()
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  total_score numeric,
  quizzes_taken bigint,
  best_percentage numeric
)
language sql
security definer
as $$
  select
    qp.user_id,
    p.full_name,
    p.avatar_url,
    sum(qp.best_score)::numeric       as total_score,
    count(*)::bigint                   as quizzes_taken,
    max(qp.best_percentage)::numeric   as best_percentage
  from quiz_progress qp
  join profiles p on p.id = qp.user_id
  where qp.last_attempted_at >= date_trunc('week', now() at time zone 'Asia/Kolkata')
  group by qp.user_id, p.full_name, p.avatar_url
  order by total_score desc
  limit 20;
$$;

create or replace function get_alltime_leaderboard()
returns table (
  user_id uuid,
  full_name text,
  avatar_url text,
  total_score numeric,
  quizzes_taken bigint,
  best_percentage numeric
)
language sql
security definer
as $$
  select
    qp.user_id,
    p.full_name,
    p.avatar_url,
    sum(qp.best_score)::numeric       as total_score,
    count(*)::bigint                   as quizzes_taken,
    max(qp.best_percentage)::numeric   as best_percentage
  from quiz_progress qp
  join profiles p on p.id = qp.user_id
  group by qp.user_id, p.full_name, p.avatar_url
  order by total_score desc
  limit 20;
$$;
