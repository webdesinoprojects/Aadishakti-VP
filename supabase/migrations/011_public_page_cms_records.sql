-- Migration 011: Register structured CMS records for the public site shell and page editors.
begin;

insert into public.cms_singletons (key, content)
values
  ('home', jsonb_build_object('heroSlides', jsonb_build_array())),
  ('siteNavigation', '{}'::jsonb),
  ('sustainabilityPage', '{}'::jsonb),
  ('investorsPage', '{}'::jsonb),
  ('sourcingPage', '{}'::jsonb),
  ('mediaPage', '{}'::jsonb),
  ('galleryPage', '{}'::jsonb),
  ('careersPage', '{}'::jsonb),
  ('aboutPage', '{}'::jsonb),
  ('contactPage', '{}'::jsonb),
  ('footerContent', '{}'::jsonb),
  ('pageHeroImages', '{}'::jsonb),
  ('homePage', '{}'::jsonb),
  ('businessesPage', '{}'::jsonb)
on conflict (key) do nothing;

commit;
