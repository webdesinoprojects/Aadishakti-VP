-- Migration 002: Admin operations queues and logistics records derived from approved UI contracts.
begin;

create table public.partner_registrations (
  id uuid primary key default gen_random_uuid(),
  application_reference text not null unique
    default ('APP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  partner_type text not null default 'vendor' check (partner_type in ('vendor', 'customer')),
  company_name text not null,
  contact_person text not null default '',
  email text not null default '',
  phone text not null default '',
  pan_number text not null,
  gst_number text not null,
  category text not null default '',
  msme_media_id uuid references public.media_assets(id) on delete set null,
  bank_media_id uuid references public.media_assets(id) on delete set null,
  quality_media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  assigned_partner_id text,
  review_note text not null default '',
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index partner_registrations_status_created_idx
  on public.partner_registrations(status, created_at desc);

create table public.profile_update_requests (
  id uuid primary key default gen_random_uuid(),
  request_reference text not null unique
    default ('REQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  partner_id text not null,
  partner_role text not null check (partner_role in ('vendor', 'customer')),
  old_data jsonb not null default '{}'::jsonb check (jsonb_typeof(old_data) = 'object'),
  new_data jsonb not null default '{}'::jsonb check (jsonb_typeof(new_data) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  review_note text not null default '',
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index profile_update_requests_status_created_idx
  on public.profile_update_requests(status, created_at desc);

create table public.reconciliations (
  id uuid primary key default gen_random_uuid(),
  partner_id text not null,
  partner_role text not null check (partner_role in ('vendor', 'customer')),
  quarter text not null,
  document_media_id uuid not null references public.media_assets(id) on delete restrict,
  original_name text not null,
  status text not null default 'pending_verification'
    check (status in ('pending_verification', 'verified', 'rejected')),
  review_note text not null default '',
  verified_by uuid references public.admin_profiles(id) on delete set null,
  verified_at timestamptz,
  is_locked boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (partner_id, quarter)
);

create index reconciliations_status_created_idx
  on public.reconciliations(status, created_at desc);

create table public.logistics_orders (
  id text primary key,
  enquiry_reference text,
  vendor_id text,
  vendor_name text not null default '',
  customer_name text not null default '',
  product text not null default '',
  amount text not null default '',
  status text not null default 'Order Confirmed',
  tracking jsonb not null default '[]'::jsonb check (jsonb_typeof(tracking) = 'array'),
  chat_history jsonb not null default '[]'::jsonb check (jsonb_typeof(chat_history) = 'array'),
  pod_status text not null default 'Awaited',
  pod_image_url text,
  payment_proof_url text,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index logistics_orders_created_idx on public.logistics_orders(created_at desc);
create index logistics_orders_vendor_idx on public.logistics_orders(vendor_id, created_at desc);

create trigger partner_registrations_set_updated_at before update on public.partner_registrations
for each row execute function public.set_updated_at();
create trigger profile_update_requests_set_updated_at before update on public.profile_update_requests
for each row execute function public.set_updated_at();
create trigger reconciliations_set_updated_at before update on public.reconciliations
for each row execute function public.set_updated_at();
create trigger logistics_orders_set_updated_at before update on public.logistics_orders
for each row execute function public.set_updated_at();

alter table public.partner_registrations enable row level security;
alter table public.profile_update_requests enable row level security;
alter table public.reconciliations enable row level security;
alter table public.logistics_orders enable row level security;

revoke all on table
  public.partner_registrations,
  public.profile_update_requests,
  public.reconciliations,
  public.logistics_orders
from anon, authenticated;

grant all on table
  public.partner_registrations,
  public.profile_update_requests,
  public.reconciliations,
  public.logistics_orders
to service_role;

commit;
