-- Migration 014: Remove unpublished ESG navigation links and obsolete homepage overview stats.
begin;

update public.cms_singletons
set content = jsonb_set(
  coalesce(content, '{}'::jsonb),
  '{esgLinks}',
  '[
    {
      "to":"/sustainability?tab=environment",
      "label":"Environment & Climate",
      "previewImage":"/plant/Plant Pic 02.jpeg",
      "previewEyebrow":"ZERO LIQUID DISCHARGE",
      "previewText":"Minimizing our environmental footprint through advanced recycling."
    }
  ]'::jsonb,
  true
)
where key = 'siteNavigation';

update public.cms_singletons
set content = coalesce(content, '{}'::jsonb) - 'overviewStats'
where key = 'homePage';

commit;
