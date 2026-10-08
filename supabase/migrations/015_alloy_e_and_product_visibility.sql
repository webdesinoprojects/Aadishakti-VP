-- Migration 015: publish Alloy E, refresh product imagery, hide the draft lead-balls product,
-- and expose the two existing business pages in the Company dropdown.
begin;

insert into public.cms_singletons (key, content)
values (
  'alloyEPage',
  jsonb_build_object(
    'eyebrow', '// TECHNICAL DATA SHEET',
    'heading', 'Lead Alloy E Sheath',
    'introduction', jsonb_build_array(
      'Aadishakti is one of the largest secondary lead manufacturers, recognized globally for its commitment to quality, advanced technology, and customer satisfaction. We manufacture customized lead-based alloys for a wide range of industrial applications.',
      'Our Lead Alloy E Sheath is produced in compliance with internationally recognized specifications or according to customer-specific requirements. These alloys are supplied primarily to power cable manufacturers for cable sheathing applications, ensuring superior quality, consistency, and reliable performance.',
      'At Aadishakti, we are committed to delivering world-class products through continuous innovation, stringent quality control, and customer-focused solutions. Our dedication to excellence has established us as a trusted partner for customers across domestic and international markets. With an annual manufacturing capacity of 1,20,000 MT, Aadishakti is well-equipped to meet the growing demand for high-quality lead alloys with reliable and timely deliveries.'
    ),
    'standardHeading', 'Lead Alloy E (Sheath)',
    'standardText', 'Our Lead Alloy E complies with the internationally recognized EN 12548 standard and is widely used for high-voltage and extra-high-voltage power cable sheathing.',
    'compositionHeading', 'Typical Chemical Composition',
    'composition', jsonb_build_array(
      jsonb_build_object(
        'materialNumber', 'PB021K',
        'ag', '0.005',
        'as', '0.001',
        'bi', '0.03',
        'cd', '0.001',
        'cu', '0.003',
        'ni', '0.001',
        'te', '0.002',
        'zn', '0.0005',
        'sb', '0.15–0.25',
        'sn', '0.35–0.45',
        'pb', 'Balance'
      )
    ),
    'mechanicalHeading', 'Mechanical Properties',
    'grainHeading', 'Microscopic Analysis of Alloy E Grain Size and Grain Structure',
    'grainText', 'Lead Alloy E is engineered with a fine grain microstructure to deliver excellent corrosion resistance, improved melt fluidity, superior mechanical properties, and enhanced durability for high-performance electrical cable sheathing applications.',
    'grainImage', '',
    'packagingHeading', 'Packaging',
    'packagingText', 'Each bundle consists of 42 pieces of Lead Alloy E ingots, securely strapped using high-strength ISI-grade plastic strapping, ensuring excellent load stability, safe handling, and damage-free transportation.',
    'packagingBullets', jsonb_build_array(
      'Strapping: ISI-grade high-tensile plastic strapping',
      'Packaging type: Export-worthy, pallet-free bundled packing',
      'Identification: Color-coded ingots and bundle marking as per customer requirements'
    ),
    'packagingImage', '',
    'certificationsHeading', 'Certifications',
    'certifications', jsonb_build_array('ISO 9001:2015', 'ISO 14001:2015', 'ISO 45001:2018'),
    'addressHeading', 'Head Office Address',
    'address', '30, Third Floor, Shivaji Marg, Block C, Adjacent to Jaguar AMP Motors, Moti Nagar, New Delhi, India — 110015',
    'website', 'https://www.aadishakti.com'
  )
)
on conflict (key) do update set
  content = excluded.content,
  updated_at = timezone('utc', now());

insert into public.products
  (slug, name, code, purity, description, packaging, specifications, features, image_url, status, sort_order)
values (
  'alloy-e-sheath',
  'Lead Alloy E Sheath',
  'EN 12548 / POWER CABLE SHEATHING',
  'PB021K / Customer-Specific Alloy',
  'A customised lead-based Alloy E engineered for high-voltage and extra-high-voltage power cable sheathing, with controlled chemistry, consistent grain structure, and dependable delivery performance.',
  '42 pieces per export-worthy, pallet-free bundle with high-strength ISI-grade plastic strapping and colour-coded identification tags.',
  '[{"parameter":"Standard","value":"EN 12548"},{"parameter":"Material Number","value":"PB021K"},{"parameter":"Primary Application","value":"Power Cable Sheathing"},{"parameter":"Lead (Pb)","value":"Balance"}]'::jsonb,
  '["Power Cable Sheathing","High-Voltage Cable Systems","Extra-High-Voltage Cable Systems"]'::jsonb,
  '/images/products/alloy-e-sheath.jpeg',
  'published',
  6
)
on conflict (slug) do update set
  name = excluded.name,
  code = excluded.code,
  purity = excluded.purity,
  description = excluded.description,
  packaging = excluded.packaging,
  specifications = excluded.specifications,
  features = excluded.features,
  image_url = excluded.image_url,
  status = excluded.status,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now());

update public.products
set
  image_url = '/images/products/plastic-granules.jpeg',
  sort_order = 9,
  updated_at = timezone('utc', now())
where slug = 'plastic-granules';

update public.products
set
  status = 'draft',
  sort_order = 7,
  updated_at = timezone('utc', now())
where slug = 'lead-balls-anodes';

update public.products
set
  sort_order = 8,
  updated_at = timezone('utc', now())
where slug = 'alloy-dust';

update public.cms_singletons
set content = jsonb_set(
  coalesce(content, '{}'::jsonb),
  '{companyLinks}',
  '[
    {"to":"/about","label":"About Us","sub":false},
    {"to":"/businesses","label":"Businesses","sub":false},
    {"to":"/businesses?plant=mundra","label":"AGRPL — Mundra Plant","sub":true},
    {"to":"/businesses?plant=roorkee","label":"AMRPL — Roorkee Plant","sub":true},
    {"to":"/businesses?plant=pipe-coil","label":"AADISHAKTI METAL WORLD LLP","sub":true},
    {"to":"/businesses?plant=oxide","label":"AADISHAKTI METALS","sub":true}
  ]'::jsonb,
  true
), updated_at = timezone('utc', now())
where key = 'siteNavigation';

commit;
