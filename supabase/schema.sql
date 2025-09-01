-- Extensions
create extension if not exists pgcrypto;

-- Templates table (optional for future features)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  content jsonb not null,
  category text,
  is_premium boolean default false,
  usage_count integer default 0,
  created_at timestamptz default now()
);

-- Readmes table
create table if not exists public.readmes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  title text,
  content text not null,
  metadata jsonb,
  seo_score integer,
  github_url text,
  template_id uuid references public.templates(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_readmes_github_url on public.readmes (github_url);

-- Analytics events
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  event_type text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.readmes enable row level security;
alter table public.analytics enable row level security;
alter table public.templates enable row level security;

-- Policies: Users can see their own readmes/analytics; templates are readable by all
do $$ begin
  create policy read_own_readmes on public.readmes
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy insert_own_readmes on public.readmes
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy update_own_readmes on public.readmes
    for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy read_own_analytics on public.analytics
    for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy insert_own_analytics on public.analytics
    for insert with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy read_templates on public.templates
    for select using (true);
exception when duplicate_object then null; end $$;
