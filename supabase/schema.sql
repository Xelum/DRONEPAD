-- DRONEPAD HQ — Operational workspace schema
-- Esegui questo file una sola volta nel SQL Editor del progetto Supabase.
-- IMPORTANTE: nel browser usa soltanto la ANON KEY, mai la SERVICE ROLE KEY.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (project_id,user_id)
);

create or replace function public.is_project_member(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1 from public.project_members pm
    where pm.project_id = pid and pm.user_id = auth.uid()
  ) or exists(
    select 1 from public.projects p
    where p.id = pid and p.owner_id = auth.uid()
  );
$$;

create table if not exists public.investors (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  type text not null default 'VC',
  fit_it text not null default '',
  fit_en text not null default '',
  verification text not null default 'To verify',
  stage text not null default 'Research',
  next_it text not null default '',
  next_en text not null default '',
  source_it text not null default '',
  source_en text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


alter table public.investors add column if not exists priority text not null default 'Media';
alter table public.investors add column if not exists contact_name text not null default '';
alter table public.investors add column if not exists contact_info text not null default '';
alter table public.investors add column if not exists website text not null default '';
alter table public.investors add column if not exists last_contact date;
alter table public.investors add column if not exists next_date date;
alter table public.investors add column if not exists notes_it text not null default '';
alter table public.investors add column if not exists notes_en text not null default '';

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title_it text not null default '',
  title_en text not null default '',
  stream text not null default 'Prototype',
  status text not null default 'Now',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


alter table public.tasks add column if not exists due_date date;
alter table public.tasks add column if not exists owner text not null default '';
alter table public.tasks add column if not exists notes_it text not null default '';
alter table public.tasks add column if not exists notes_en text not null default '';

create table if not exists public.prototype_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item_key integer not null,
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id,item_key)
);


create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  activity_date date not null default current_date,
  category text not null default 'Ricerca',
  entity text not null default '',
  outcome text not null default 'Informazione raccolta',
  title text not null,
  details_it text not null default '',
  details_en text not null default '',
  source_url text not null default '',
  next_action_it text not null default '',
  next_action_en text not null default '',
  next_date date,
  system_event boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  category text not null default 'Data Room',
  status text not null default 'uploaded',
  mime_type text,
  size_bytes bigint not null default 0,
  storage_path text not null,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists investors_project_idx on public.investors(project_id);
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists prototype_items_project_idx on public.prototype_items(project_id);
create index if not exists documents_project_idx on public.documents(project_id);
create index if not exists activity_log_project_idx on public.activity_log(project_id);
create index if not exists activity_log_date_idx on public.activity_log(project_id,activity_date);

-- updated_at triggers
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='projects_set_updated_at') THEN
    CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='investors_set_updated_at') THEN
    CREATE TRIGGER investors_set_updated_at BEFORE UPDATE ON public.investors FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='tasks_set_updated_at') THEN
    CREATE TRIGGER tasks_set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='prototype_set_updated_at') THEN
    CREATE TRIGGER prototype_set_updated_at BEFORE UPDATE ON public.prototype_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='documents_set_updated_at') THEN
    CREATE TRIGGER documents_set_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='activity_log_set_updated_at') THEN
    CREATE TRIGGER activity_log_set_updated_at BEFORE UPDATE ON public.activity_log FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- RLS
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.investors enable row level security;
alter table public.tasks enable row level security;
alter table public.prototype_items enable row level security;
alter table public.documents enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists projects_select on public.projects;
create policy projects_select on public.projects for select to authenticated
using (owner_id=auth.uid() or public.is_project_member(id));

drop policy if exists projects_insert on public.projects;
create policy projects_insert on public.projects for insert to authenticated
with check (owner_id=auth.uid());

drop policy if exists projects_update on public.projects;
create policy projects_update on public.projects for update to authenticated
using (owner_id=auth.uid()) with check (owner_id=auth.uid());

drop policy if exists members_select on public.project_members;
create policy members_select on public.project_members for select to authenticated
using (user_id=auth.uid() or public.is_project_member(project_id));

drop policy if exists members_insert on public.project_members;
create policy members_insert on public.project_members for insert to authenticated
with check (
  user_id=auth.uid() and exists(
    select 1 from public.projects p where p.id=project_id and p.owner_id=auth.uid()
  )
);

drop policy if exists members_update on public.project_members;
create policy members_update on public.project_members for update to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

drop policy if exists investors_all on public.investors;
create policy investors_all on public.investors for all to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

drop policy if exists tasks_all on public.tasks;
create policy tasks_all on public.tasks for all to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

drop policy if exists prototype_all on public.prototype_items;
create policy prototype_all on public.prototype_items for all to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

drop policy if exists documents_all on public.documents;
create policy documents_all on public.documents for all to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

drop policy if exists activity_log_all on public.activity_log;
create policy activity_log_all on public.activity_log for all to authenticated
using (public.is_project_member(project_id)) with check (public.is_project_member(project_id));

-- Private Storage bucket
insert into storage.buckets (id,name,public,file_size_limit)
values ('dronepad-documents','dronepad-documents',false,52428800)
on conflict (id) do update set public=false, file_size_limit=52428800;

drop policy if exists dronepad_storage_select on storage.objects;
create policy dronepad_storage_select on storage.objects for select to authenticated
using (
  bucket_id='dronepad-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
);

drop policy if exists dronepad_storage_insert on storage.objects;
create policy dronepad_storage_insert on storage.objects for insert to authenticated
with check (
  bucket_id='dronepad-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
);

drop policy if exists dronepad_storage_update on storage.objects;
create policy dronepad_storage_update on storage.objects for update to authenticated
using (
  bucket_id='dronepad-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
)
with check (
  bucket_id='dronepad-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
);

drop policy if exists dronepad_storage_delete on storage.objects;
create policy dronepad_storage_delete on storage.objects for delete to authenticated
using (
  bucket_id='dronepad-documents'
  and public.is_project_member(((storage.foldername(name))[1])::uuid)
);
