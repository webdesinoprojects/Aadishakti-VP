-- Migration 013: Apply approved public-site review content and supplied imagery.
begin;

update public.cms_singletons
set content = jsonb_set(
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{heroStats}',
    '[
      {"value":"120000","suffix":"+ MT","label":"Capacity"},
      {"value":"20","suffix":"+","label":"Years of Experience"},
      {"value":"3","suffix":"","label":"Plants"},
      {"value":"4","suffix":"","label":"Certifications"}
    ]'::jsonb,
    true
  ),
  '{clients}',
  '[
    {"name":"Exide Industries","image":"/client-logos/exide.jpg","height":"48px"},
    {"name":"Luminous Power Technologies","image":"/client-logos/luminous.jpg","height":"48px"},
    {"name":"Su-Kam Power Systems","image":"/client-logos/sukam.png","height":"48px"},
    {"name":"HBL Power Systems","image":"/client-logos/hbl.png","height":"48px"},
    {"name":"Okaya Power Group","image":"/client-logos/okaya.png","height":"48px"},
    {"name":"Rocket Electric","image":"/client-logos/rocket.webp","height":"48px"},
    {"name":"Genus Power Infrastructure","image":"/client-logos/genus.webp","height":"48px"},
    {"name":"Livguard Energy","image":"/client-logos/livguard.webp","height":"48px"}
  ]'::jsonb,
  true
)
where key = 'homePage';

update public.cms_singletons
set content = jsonb_set(
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{heroImage}',
    '"/images/review/aadishakti-factory.jpeg"'::jsonb,
    true
  ),
  '{overviewImage}',
  '"/images/review/aadishakti-factory.jpeg"'::jsonb,
  true
)
where key = 'aboutPage';

update public.cms_singletons
set content = coalesce(content, '{}'::jsonb)
  || jsonb_build_object('ABOUT US', '/images/review/aadishakti-factory.jpeg')
where key = 'pageHeroImages';

update public.cms_singletons
set content = (coalesce(content, '{}'::jsonb) - 'xUrl')
  || jsonb_build_object('instagramUrl', 'https://www.instagram.com/')
where key = 'footerContent';

update public.products
set image_url = '/images/review/lead-balls-anodes.jpeg',
    updated_at = timezone('utc', now())
where slug = 'lead-balls-anodes';

update public.products
set image_url = '/images/review/alloy-dust.jpeg',
    updated_at = timezone('utc', now())
where slug = 'alloy-dust';

commit;
