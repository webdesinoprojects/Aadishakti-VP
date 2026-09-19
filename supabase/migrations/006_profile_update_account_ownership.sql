-- Migration 006: Scope profile-update requests to the authenticated portal account.
begin;

alter table public.profile_update_requests
  add column portal_account_id uuid references public.portal_accounts(id) on delete cascade;

create index profile_update_requests_account_created_idx
  on public.profile_update_requests(portal_account_id, created_at desc);

commit;
