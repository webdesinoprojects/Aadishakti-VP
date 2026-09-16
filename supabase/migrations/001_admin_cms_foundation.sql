-- Migration 001: Admin identity, CMS, media, CRM, and audit foundation.
begin;

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  role text not null default 'viewer'
    check (role in ('super_admin', 'content_admin', 'operations_admin', 'viewer')),
  permissions text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  route_path text not null unique,
  title text not null,
  template text not null default 'standard',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sections jsonb not null default '[]'::jsonb check (jsonb_typeof(sections) = 'array'),
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  published_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index cms_pages_status_idx on public.cms_pages(status);
create index cms_pages_published_at_idx on public.cms_pages(published_at desc);

create table public.cms_navigation_items (
  id uuid primary key default gen_random_uuid(),
  menu_key text not null default 'primary',
  parent_id uuid references public.cms_navigation_items(id) on delete cascade,
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  opens_new_tab boolean not null default false,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index cms_navigation_menu_order_idx
  on public.cms_navigation_items(menu_key, sort_order);

create table public.cms_singletons (
  key text primary key,
  content jsonb not null default '{}'::jsonb check (jsonb_typeof(content) = 'object'),
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  imagekit_file_id text not null unique,
  name text not null,
  file_path text not null,
  url text not null,
  thumbnail_url text,
  file_type text not null,
  mime_type text,
  width integer,
  height integer,
  size_bytes bigint check (size_bytes is null or size_bytes >= 0),
  folder text not null default '/aadishakti',
  alt_text text not null default '',
  caption text not null default '',
  tags text[] not null default '{}',
  custom_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index media_assets_created_at_idx on public.media_assets(created_at desc);
create index media_assets_file_type_idx on public.media_assets(file_type);
create index media_assets_tags_idx on public.media_assets using gin(tags);

create table public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  cover_media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  media_id uuid references public.media_assets(id) on delete cascade,
  image_url text not null default '',
  title text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  check (media_id is not null or image_url <> '')
);

create index gallery_items_album_order_idx on public.gallery_items(album_id, sort_order);
create unique index gallery_items_album_media_unique_idx
  on public.gallery_items(album_id, media_id)
  where media_id is not null;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  code text not null default '',
  purity text not null default '',
  description text not null default '',
  specifications jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  image_media_id uuid references public.media_assets(id) on delete set null,
  datasheet_media_id uuid references public.media_assets(id) on delete set null,
  image_url text not null default '',
  datasheet_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  publish_date date,
  content text not null default '',
  featured_media_id uuid references public.media_assets(id) on delete set null,
  featured_image_url text not null default '',
  display_on_home boolean not null default false,
  display_on_news boolean not null default true,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index news_posts_public_idx on public.news_posts(status, publish_date desc);

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default '',
  department text not null default '',
  location text not null default '',
  employment_type text not null default '',
  experience text not null default '',
  salary_range text not null default '',
  description text not null default '',
  requirements jsonb not null default '[]'::jsonb,
  why_work_here text not null default '',
  image_media_id uuid references public.media_assets(id) on delete set null,
  image_url text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'archived')),
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index job_postings_public_idx on public.job_postings(status, created_at desc);

create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  name text not null,
  role text not null,
  bio text not null default '',
  photo_media_id uuid references public.media_assets(id) on delete set null,
  photo_url text not null default '',
  category text not null default '',
  display_order integer not null default 0,
  linkedin_url text not null default '',
  is_visible boolean not null default true,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index team_members_display_idx on public.team_members(is_visible, display_order);

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  full_name text not null,
  work_email text not null,
  phone text not null,
  company_name text not null,
  country text not null default '',
  inquiry_type text not null,
  products text[] not null default '{}',
  materials text[] not null default '{}',
  estimated_quantity text not null default '',
  packaging_requirement text not null default '',
  additional_details text not null default '',
  specification_media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'new',
  notes text not null default '',
  assigned_vendor_id text,
  assigned_vendor_name text,
  chat_history jsonb not null default '[]'::jsonb,
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index enquiries_status_submitted_idx on public.enquiries(status, submitted_at desc);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  full_name text not null,
  email text not null,
  phone text not null,
  role_category text not null,
  experience text not null,
  description text not null default '',
  resume_media_id uuid references public.media_assets(id) on delete set null,
  resume_original_name text not null default '',
  status text not null default 'new',
  notes text not null default '',
  submitted_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index job_applications_status_submitted_idx
  on public.job_applications(status, submitted_at desc);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.admin_profiles(id) on delete set null,
  actor_email text,
  actor_role text,
  action text not null,
  resource_type text not null,
  resource_id text,
  request_id text,
  ip_address inet,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index audit_logs_created_at_idx on public.audit_logs(created_at desc);
create index audit_logs_resource_idx on public.audit_logs(resource_type, resource_id);
create index audit_logs_actor_idx on public.audit_logs(actor_id, created_at desc);

create trigger admin_profiles_set_updated_at before update on public.admin_profiles
for each row execute function public.set_updated_at();
create trigger cms_pages_set_updated_at before update on public.cms_pages
for each row execute function public.set_updated_at();
create trigger cms_navigation_items_set_updated_at before update on public.cms_navigation_items
for each row execute function public.set_updated_at();
create trigger cms_singletons_set_updated_at before update on public.cms_singletons
for each row execute function public.set_updated_at();
create trigger media_assets_set_updated_at before update on public.media_assets
for each row execute function public.set_updated_at();
create trigger gallery_albums_set_updated_at before update on public.gallery_albums
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger news_posts_set_updated_at before update on public.news_posts
for each row execute function public.set_updated_at();
create trigger job_postings_set_updated_at before update on public.job_postings
for each row execute function public.set_updated_at();
create trigger team_members_set_updated_at before update on public.team_members
for each row execute function public.set_updated_at();
create trigger enquiries_set_updated_at before update on public.enquiries
for each row execute function public.set_updated_at();
create trigger job_applications_set_updated_at before update on public.job_applications
for each row execute function public.set_updated_at();

alter table public.admin_profiles enable row level security;
alter table public.cms_pages enable row level security;
alter table public.cms_navigation_items enable row level security;
alter table public.cms_singletons enable row level security;
alter table public.media_assets enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_items enable row level security;
alter table public.products enable row level security;
alter table public.news_posts enable row level security;
alter table public.job_postings enable row level security;
alter table public.team_members enable row level security;
alter table public.enquiries enable row level security;
alter table public.job_applications enable row level security;
alter table public.audit_logs enable row level security;

revoke all on table
  public.admin_profiles,
  public.cms_pages,
  public.cms_navigation_items,
  public.cms_singletons,
  public.media_assets,
  public.gallery_albums,
  public.gallery_items,
  public.products,
  public.news_posts,
  public.job_postings,
  public.team_members,
  public.enquiries,
  public.job_applications,
  public.audit_logs
from anon, authenticated;

grant all on table
  public.admin_profiles,
  public.cms_pages,
  public.cms_navigation_items,
  public.cms_singletons,
  public.media_assets,
  public.gallery_albums,
  public.gallery_items,
  public.products,
  public.news_posts,
  public.job_postings,
  public.team_members,
  public.enquiries,
  public.job_applications,
  public.audit_logs
to service_role;

commit;
