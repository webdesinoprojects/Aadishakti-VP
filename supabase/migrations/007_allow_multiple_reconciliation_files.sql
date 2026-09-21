-- Migration 007: Allow multiple statement files for one partner and quarter.
begin;

alter table public.reconciliations
  drop constraint if exists reconciliations_partner_id_quarter_key;

create index if not exists reconciliations_partner_quarter_created_idx
  on public.reconciliations(partner_id, partner_role, quarter, created_at desc);

commit;
