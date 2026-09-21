-- An accepted vendor quotation may start one Aadishakti-managed logistics order.
-- Manual logistics orders remain possible with a null source_quotation_id.
begin;

alter table public.logistics_orders
  add column source_quotation_id uuid unique
  references public.vendor_quotations(id) on delete restrict;

commit;
