-- Enums
create type public.risk_level as enum ('low','medium','high','critical');
create type public.vendor_status as enum ('active','inactive','onboarding','suspended');
create type public.assessment_status as enum ('pending','in_progress','completed','failed');
create type public.doc_status as enum ('pending','processing','processed','failed');
create type public.report_status as enum ('pending','processing','ready','failed');

-- Vendors
create table public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text,
  risk_level public.risk_level not null default 'low',
  risk_score int not null default 0 check (risk_score >= 0 and risk_score <= 100),
  status public.vendor_status not null default 'active',
  email text,
  phone text,
  website text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vendors enable row level security;

create policy "Users can view their own vendors"
  on public.vendors for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own vendors"
  on public.vendors for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own vendors"
  on public.vendors for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own vendors"
  on public.vendors for delete to authenticated
  using (user_id = auth.uid());

-- Vendor Agents assignments
create table public.vendor_agents (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  agent_id text not null,
  created_at timestamptz not null default now()
);

alter table public.vendor_agents enable row level security;

create policy "Access vendor_agents via owned vendors"
  on public.vendor_agents for all to authenticated
  using (exists (select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid()))
  with check (exists (select 1 from public.vendors v where v.id = vendor_id and v.user_id = auth.uid()));

-- Assessments
create table public.assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  title text not null,
  status public.assessment_status not null default 'pending',
  score int default 0 check (score >= 0 and score <= 100),
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.assessments enable row level security;

create policy "Users can view their own assessments"
  on public.assessments for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own assessments"
  on public.assessments for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own assessments"
  on public.assessments for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own assessments"
  on public.assessments for delete to authenticated
  using (user_id = auth.uid());

-- Documents (metadata + storage bucket)
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  name text not null,
  type text,
  status public.doc_status not null default 'pending',
  storage_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "Users can view their own documents"
  on public.documents for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own documents"
  on public.documents for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own documents"
  on public.documents for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own documents"
  on public.documents for delete to authenticated
  using (user_id = auth.uid());

-- Reports
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete set null,
  name text not null,
  template text,
  status public.report_status not null default 'pending',
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can view their own reports"
  on public.reports for select to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own reports"
  on public.reports for insert to authenticated
  with check (user_id = auth.uid());

create policy "Users can update their own reports"
  on public.reports for update to authenticated
  using (user_id = auth.uid());

create policy "Users can delete their own reports"
  on public.reports for delete to authenticated
  using (user_id = auth.uid());

-- Update timestamp trigger
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql set search_path = public;

create trigger update_vendors_updated_at
before update on public.vendors
for each row execute function public.update_updated_at_column();

create trigger update_assessments_updated_at
before update on public.assessments
for each row execute function public.update_updated_at_column();

create trigger update_reports_updated_at
before update on public.reports
for each row execute function public.update_updated_at_column();

-- Storage bucket for documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Storage policies
create policy "Users can view their own files in documents bucket"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can upload their own files in documents bucket"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own files in documents bucket"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own files in documents bucket"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
