create table if not exists public.scholarships (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  provider_type text not null,
  description text,
  source_url text not null,
  application_url text,
  status text not null default 'unknown',
  last_verified_at date,
  academic_year text,
  benefit_summary text,
  estimated_total_value_php integer not null default 0,
  application_open_date date,
  deadline date,
  min_gpa numeric(4,2),
  allowed_genders text[],
  allowed_strands text[],
  allowed_courses text[],
  allowed_year_levels text[],
  allowed_regions text[],
  preferred_regions text[],
  preferred_income_bracket integer,
  preferred_courses text[],
  estimated_effort_hours integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.scholarship_required_documents (
  scholarship_id uuid not null references public.scholarships(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete restrict,
  is_required boolean not null default true,
  notes text,
  primary key (scholarship_id, document_id)
);

alter table public.scholarships enable row level security;
alter table public.documents enable row level security;
alter table public.scholarship_required_documents enable row level security;

create policy "Public catalog read: scholarships"
  on public.scholarships for select
  using (true);

create policy "Public catalog read: documents"
  on public.documents for select
  using (true);

create policy "Public catalog read: scholarship required documents"
  on public.scholarship_required_documents for select
  using (true);
