create extension if not exists "pgcrypto";

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  company text not null default '',
  source text not null default 'apify',
  email_status text,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id text not null,
  status text not null,
  run_id text,
  lead_count integer not null default 0,
  message text,
  created_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists leads_user_created_idx on public.leads (user_id, created_at desc);
create index if not exists leads_user_email_idx on public.leads (user_id, email);
create index if not exists leads_user_company_idx on public.leads (user_id, company);
create index if not exists jobs_user_created_idx on public.jobs (user_id, created_at desc);
create index if not exists campaigns_user_created_idx on public.campaigns (user_id, created_at desc);

alter table public.leads enable row level security;
alter table public.jobs enable row level security;
alter table public.campaigns enable row level security;

create policy "Users can read own leads"
  on public.leads
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own leads"
  on public.leads
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own leads"
  on public.leads
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own leads"
  on public.leads
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read own jobs"
  on public.jobs
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read own campaigns"
  on public.campaigns
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own campaigns"
  on public.campaigns
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own campaigns"
  on public.campaigns
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own campaigns"
  on public.campaigns
  for delete
  to authenticated
  using (auth.uid() = user_id);
