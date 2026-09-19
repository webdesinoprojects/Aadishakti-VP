-- Migration 005: Explicit partner ownership for internal logistics workflows.
begin;

alter table public.logistics_orders
  add column vendor_account_id uuid references public.portal_accounts(id) on delete set null,
  add column customer_account_id uuid references public.portal_accounts(id) on delete set null;

create index logistics_orders_vendor_account_idx on public.logistics_orders(vendor_account_id, created_at desc);
create index logistics_orders_customer_account_idx on public.logistics_orders(customer_account_id, created_at desc);

commit;
