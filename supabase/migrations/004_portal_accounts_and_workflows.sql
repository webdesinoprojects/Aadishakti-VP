-- Migration 004: Individual partner logins, multi-company CIS mappings, and portal workflows.
begin;

create table public.portal_accounts (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('vendor', 'customer')),
  login_id text not null,
  password_hash text not null,
  display_name text not null,
  email text not null default '',
  status text not null default 'active' check (status in ('active', 'inactive', 'locked')),
  must_change_password boolean not null default true,
  failed_login_attempts integer not null default 0 check (failed_login_attempts >= 0),
  locked_until timestamptz,
  last_login_at timestamptz,
  created_by uuid references public.admin_profiles(id) on delete set null,
  updated_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create unique index portal_accounts_login_id_unique_idx on public.portal_accounts(lower(login_id));
create index portal_accounts_role_status_idx on public.portal_accounts(role, status);

create table public.portal_account_companies (
  id uuid primary key default gen_random_uuid(),
  portal_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  company_code text not null check (company_code in ('AGRPL', 'AM', 'AMRPL')),
  sap_card_code text not null,
  company_label text not null default '',
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (portal_account_id, company_code)
);
create unique index portal_account_companies_one_primary_idx on public.portal_account_companies(portal_account_id) where is_primary;
create index portal_account_companies_card_idx on public.portal_account_companies(company_code, sap_card_code);

alter table public.partner_registrations add column portal_account_id uuid references public.portal_accounts(id) on delete set null;

create table public.partner_documents (
  id uuid primary key default gen_random_uuid(),
  portal_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  document_type text not null,
  title text not null,
  document_number text not null default '',
  media_id uuid not null references public.media_assets(id) on delete restrict,
  issued_on date,
  expires_on date,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  review_note text not null default '',
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index partner_documents_account_created_idx on public.partner_documents(portal_account_id, created_at desc);
create index partner_documents_status_idx on public.partner_documents(status, created_at desc);

create table public.portal_support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_reference text not null unique default ('TKT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  portal_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  subject text not null,
  category text not null default 'general',
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table public.portal_support_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.portal_support_tickets(id) on delete cascade,
  sender_type text not null check (sender_type in ('partner', 'admin')),
  sender_id text not null,
  message text not null,
  media_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);
create index portal_support_tickets_account_idx on public.portal_support_tickets(portal_account_id, updated_at desc);
create index portal_support_messages_ticket_idx on public.portal_support_messages(ticket_id, created_at);

create table public.rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_reference text not null unique default ('RFQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  title text not null,
  description text not null default '',
  product text not null default '',
  quantity numeric,
  unit text not null default '',
  company_code text check (company_code is null or company_code in ('AGRPL', 'AM', 'AMRPL')),
  response_due_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'closed', 'cancelled')),
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table public.rfq_assignments (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  vendor_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  status text not null default 'invited' check (status in ('invited', 'viewed', 'responded', 'declined', 'awarded', 'not_awarded')),
  viewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (rfq_id, vendor_account_id)
);
create table public.vendor_quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_reference text not null unique default ('QUO-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  rfq_assignment_id uuid not null unique references public.rfq_assignments(id) on delete cascade,
  unit_price numeric not null check (unit_price >= 0),
  tax_rate numeric check (tax_rate is null or tax_rate >= 0),
  lead_time_days integer check (lead_time_days is null or lead_time_days >= 0),
  validity_date date,
  remarks text not null default '',
  media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn')),
  submitted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index rfq_assignments_vendor_idx on public.rfq_assignments(vendor_account_id, created_at desc);
create index vendor_quotations_status_idx on public.vendor_quotations(status, created_at desc);

create table public.portal_receipts (
  id uuid primary key default gen_random_uuid(),
  portal_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  payment_reference text not null,
  payment_type text not null default 'payment',
  media_id uuid not null references public.media_assets(id) on delete restrict,
  amount numeric check (amount is null or amount >= 0),
  paid_on date,
  notes text not null default '',
  status text not null default 'submitted' check (status in ('submitted', 'verified', 'rejected')),
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index portal_receipts_account_idx on public.portal_receipts(portal_account_id, created_at desc);

create table public.customer_requests (
  id uuid primary key default gen_random_uuid(),
  request_reference text not null unique default ('CSR-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  portal_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  request_type text not null check (request_type in ('return', 'quality_claim', 'sustainability_report', 'coa', 'document')),
  related_reference text not null default '',
  subject text not null,
  description text not null default '',
  media_id uuid references public.media_assets(id) on delete set null,
  status text not null default 'submitted' check (status in ('submitted', 'in_review', 'approved', 'rejected', 'fulfilled', 'closed')),
  review_note text not null default '',
  fulfilled_media_id uuid references public.media_assets(id) on delete set null,
  reviewed_by uuid references public.admin_profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create index customer_requests_account_type_idx on public.customer_requests(portal_account_id, request_type, created_at desc);

create table public.vendor_performance_snapshots (
  id uuid primary key default gen_random_uuid(),
  vendor_account_id uuid not null references public.portal_accounts(id) on delete cascade,
  period_label text not null,
  quality_score numeric check (quality_score is null or quality_score between 0 and 100),
  on_time_delivery_score numeric check (on_time_delivery_score is null or on_time_delivery_score between 0 and 100),
  response_score numeric check (response_score is null or response_score between 0 and 100),
  overall_score numeric check (overall_score is null or overall_score between 0 and 100),
  notes text not null default '',
  created_by uuid references public.admin_profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  unique (vendor_account_id, period_label)
);

create trigger portal_accounts_set_updated_at before update on public.portal_accounts for each row execute function public.set_updated_at();
create trigger portal_account_companies_set_updated_at before update on public.portal_account_companies for each row execute function public.set_updated_at();
create trigger partner_documents_set_updated_at before update on public.partner_documents for each row execute function public.set_updated_at();
create trigger portal_support_tickets_set_updated_at before update on public.portal_support_tickets for each row execute function public.set_updated_at();
create trigger rfqs_set_updated_at before update on public.rfqs for each row execute function public.set_updated_at();
create trigger rfq_assignments_set_updated_at before update on public.rfq_assignments for each row execute function public.set_updated_at();
create trigger vendor_quotations_set_updated_at before update on public.vendor_quotations for each row execute function public.set_updated_at();
create trigger portal_receipts_set_updated_at before update on public.portal_receipts for each row execute function public.set_updated_at();
create trigger customer_requests_set_updated_at before update on public.customer_requests for each row execute function public.set_updated_at();

alter table public.portal_accounts enable row level security;
alter table public.portal_account_companies enable row level security;
alter table public.partner_documents enable row level security;
alter table public.portal_support_tickets enable row level security;
alter table public.portal_support_messages enable row level security;
alter table public.rfqs enable row level security;
alter table public.rfq_assignments enable row level security;
alter table public.vendor_quotations enable row level security;
alter table public.portal_receipts enable row level security;
alter table public.customer_requests enable row level security;
alter table public.vendor_performance_snapshots enable row level security;

revoke all on table public.portal_accounts, public.portal_account_companies, public.partner_documents,
  public.portal_support_tickets, public.portal_support_messages, public.rfqs, public.rfq_assignments,
  public.vendor_quotations, public.portal_receipts, public.customer_requests, public.vendor_performance_snapshots
from anon, authenticated;
grant all on table public.portal_accounts, public.portal_account_companies, public.partner_documents,
  public.portal_support_tickets, public.portal_support_messages, public.rfqs, public.rfq_assignments,
  public.vendor_quotations, public.portal_receipts, public.customer_requests, public.vendor_performance_snapshots
to service_role;

commit;
