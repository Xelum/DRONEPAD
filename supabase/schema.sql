-- DRONEPAD INVESTOR HUB
-- Schema già eseguito sul progetto Supabase.

create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'VC',
  stage text not null default 'Research',
  priority text not null default 'Media',
  contact_name text,
  contact_role text,
  contact_email text,
  contact_phone text,
  website text,
  thesis text,
  source text,
  last_contact date,
  next_follow_up date,
  next_action text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.investor_activities (
  id uuid primary key default gen_random_uuid(),
  investor_id uuid not null references public.investors(id) on delete cascade,
  activity_date date not null default current_date,
  activity_type text not null default 'Ricerca',
  title text not null,
  details text,
  next_action text,
  next_follow_up date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists investors_set_updated_at on public.investors;
create trigger investors_set_updated_at before update on public.investors
for each row execute function public.set_updated_at();

drop trigger if exists investor_activities_set_updated_at on public.investor_activities;
create trigger investor_activities_set_updated_at before update on public.investor_activities
for each row execute function public.set_updated_at();

create index if not exists investor_activities_investor_idx on public.investor_activities(investor_id);
create index if not exists investors_stage_idx on public.investors(stage);
create index if not exists investors_next_follow_up_idx on public.investors(next_follow_up);

alter table public.investors enable row level security;
alter table public.investor_activities enable row level security;

grant select, insert, update, delete on public.investors to authenticated;
grant select, insert, update, delete on public.investor_activities to authenticated;

drop policy if exists "Authenticated users can read investors" on public.investors;
create policy "Authenticated users can read investors" on public.investors for select to authenticated using (true);

drop policy if exists "Authenticated users can insert investors" on public.investors;
create policy "Authenticated users can insert investors" on public.investors for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update investors" on public.investors;
create policy "Authenticated users can update investors" on public.investors for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete investors" on public.investors;
create policy "Authenticated users can delete investors" on public.investors for delete to authenticated using (true);

drop policy if exists "Authenticated users can read activities" on public.investor_activities;
create policy "Authenticated users can read activities" on public.investor_activities for select to authenticated using (true);

drop policy if exists "Authenticated users can insert activities" on public.investor_activities;
create policy "Authenticated users can insert activities" on public.investor_activities for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update activities" on public.investor_activities;
create policy "Authenticated users can update activities" on public.investor_activities for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete activities" on public.investor_activities;
create policy "Authenticated users can delete activities" on public.investor_activities for delete to authenticated using (true);
