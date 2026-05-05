-- TourKit (Supabase) schema + RLS
-- Run in Supabase SQL Editor (or as a migration).

create extension if not exists "pgcrypto";

-- Projects table
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  domain text not null,
  script_key text unique not null default gen_random_uuid()::text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tours table
create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  name text default 'Default Tour',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Steps table
create table if not exists steps (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid references tours(id) on delete cascade,
  selector text not null,
  title text,
  message text not null,
  position text default 'bottom', -- top | bottom | left | right
  step_order integer not null,
  created_at timestamptz default now()
);

-- Analytics events (ingested server-side via service role)
create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  event_type text not null, -- tour_started | tour_completed | tour_skipped | step_viewed
  step_order integer,
  session_id text,
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_script_key_idx on projects(script_key);
create index if not exists tours_project_id_idx on tours(project_id);
create index if not exists steps_tour_id_order_idx on steps(tour_id, step_order);
create index if not exists analytics_events_project_id_created_at_idx on analytics_events(project_id, created_at desc);

-- Row Level Security
alter table projects enable row level security;
alter table tours enable row level security;
alter table steps enable row level security;
alter table analytics_events enable row level security;

-- Projects: owners can do everything
drop policy if exists "Users own their projects" on projects;
create policy "Users own their projects" on projects
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Tours: owners via project ownership
drop policy if exists "Users own their tours" on tours;
create policy "Users own their tours" on tours
  for all
  using (
    project_id in (select id from projects where user_id = auth.uid())
  )
  with check (
    project_id in (select id from projects where user_id = auth.uid())
  );

-- Steps: owners via project ownership
drop policy if exists "Users own their steps" on steps;
create policy "Users own their steps" on steps
  for all
  using (
    tour_id in (
      select t.id
      from tours t
      join projects p on p.id = t.project_id
      where p.user_id = auth.uid()
    )
  )
  with check (
    tour_id in (
      select t.id
      from tours t
      join projects p on p.id = t.project_id
      where p.user_id = auth.uid()
    )
  );

-- Analytics: owners can read their analytics; inserts come from server (service role bypasses RLS)
drop policy if exists "Users can read analytics events" on analytics_events;
create policy "Users can read analytics events" on analytics_events
  for select
  using (
    project_id in (select id from projects where user_id = auth.uid())
  );

