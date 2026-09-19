-- Migration 003: Preserve approved CMS singleton sections that are represented as JSON arrays.
begin;

alter table public.cms_singletons
  drop constraint cms_singletons_content_check;

alter table public.cms_singletons
  add constraint cms_singletons_content_check
  check (jsonb_typeof(content) in ('object', 'array'));

commit;
