-- Migration 009: make the complete public product catalog CMS-managed.
begin;

alter table public.products
  add column if not exists packaging text not null default '';

-- Reuse the two legacy seed rows instead of creating duplicate products.
update public.products
set slug = 'pure-lead-ingots'
where slug = 'pure-lead'
  and not exists (select 1 from public.products where slug = 'pure-lead-ingots');

update public.products
set slug = 'lead-antimony-alloys'
where slug = 'lead-alloy'
  and not exists (select 1 from public.products where slug = 'lead-antimony-alloys');

update public.products set status = 'archived'
where slug = 'pure-lead' and exists (select 1 from public.products where slug = 'pure-lead-ingots');
update public.products set status = 'archived'
where slug = 'lead-alloy' and exists (select 1 from public.products where slug = 'lead-antimony-alloys');

insert into public.products
  (slug, name, code, purity, description, packaging, specifications, features, image_url, status, sort_order)
values
  (
    'pure-lead-ingots', 'Refined / Pure Lead Ingots', 'IS 27 : 1992 / BS 334 : 1982', '99.97% – 99.985% Pb',
    'Aadishakti manufactures Refined Lead Ingots utilising high-temperature secondary refining kettles. Ideal for battery cell grids, acid-storage structures, radiation shields, and high-pressure extrusion sheaths.',
    'Bound with steel bands into 42 ingots per striped bundle (approx 1,000 Kg).',
    '[{"parameter":"Lead (Pb)","value":"99.970% min"},{"parameter":"Antimony (Sb)","value":"0.001% max"},{"parameter":"Arsenic (As)","value":"0.001% max"},{"parameter":"Tin (Sn)","value":"0.001% max"},{"parameter":"Copper (Cu)","value":"0.001% max"},{"parameter":"Dimensions","value":"Custom / Approx 25kg Ingots"}]'::jsonb,
    '["Lead Acid Batteries","Power Cables","Radiation Shielding","Chemical Plant Equipment"]'::jsonb,
    '/product-pure-lead.png', 'published', 1
  ),
  (
    'lead-antimony-alloys', 'Lead Antimony Alloys', 'CUSTOM COMPONENT SPEC', 'Antimony: 1.5% to 12.0% Sb',
    'Compounded alloys utilising hard antimonial components to enhance tensile strength and grid hardness of soft pure lead. Primarily manufactured for automotive grid plates and wheel ballast counterweights.',
    'Heavy-duty metallurgical bundles strapped with carbon steel bands.',
    '[{"parameter":"Antimonial Grade 2.5%","value":"2.3% – 2.7% Sb"},{"parameter":"Antimonial Grade 3.0%","value":"2.8% – 3.2% Sb"},{"parameter":"Antimonial Grade 4.5%","value":"4.2% – 4.8% Sb"},{"parameter":"Lead (Pb) Balance","value":"Remaining %"},{"parameter":"Dimensions","value":"Custom / Approx 25kg Ingots"}]'::jsonb,
    '["Automotive Battery Grids","Wheel Weights","Ammunition","Heavy Machinery Ballast"]'::jsonb,
    '/product-lead-alloy.jpg', 'published', 2
  ),
  (
    'red-lead-oxide', 'Red Lead Oxide', 'Pb₃O₄ / BATTERY & GLASS GRADE', 'Formula: Pb₃O₄ | Soft Orange-Red Powder',
    'Fine orange-red lead oxide powder produced from high-purity ingots. Advanced cyclone baghouse filtration ensures exceptional chemical consistency for backup power batteries and crystal glass flux.',
    '25 Kg double-layer Polyethylene bags within woven HDPE outer sacks.',
    '[{"parameter":"Lead Dioxide (PbO₂)","value":"25% – 34%"},{"parameter":"Free Metallic Lead","value":"0.05% max"},{"parameter":"Moisture Content","value":"0.1% max"},{"parameter":"Dimensions / Mesh","value":"300 Mesh / 10-15 µm"}]'::jsonb,
    '["Tubular Battery Positive Plates","Crystal Glass Manufacturing","Anti-corrosive Paints","Ceramic Glazes"]'::jsonb,
    '/product-red-lead.jpg', 'published', 3
  ),
  (
    'grey-lead-oxide', 'Grey Lead Oxide', '2PbO·Pb / LEAD SUB-OXIDE', 'Formula: 2PbO·Pb | Grey Monoxide Powder',
    'Electrochemical sub-monoxide powder manufactured by dry ball mill process. Essential active plate chemical forming negative electrodes inside automotive battery cell grids.',
    'Hermetically sealed 25 Kg net Polyethylene bags within woven HDPE outer sacks.',
    '[{"parameter":"Free Metallic Lead (Pb)","value":"28% – 32%"},{"parameter":"Lead Monoxide (PbO)","value":"68% – 72%"},{"parameter":"Apparent Density","value":"1.2 – 1.4 g/cc"},{"parameter":"Dimensions / Mesh","value":"300 Mesh / 10-15 µm"}]'::jsonb,
    '["Automotive Battery Negative Plates","Industrial Battery Grids","Pigments","Glass Manufacturing"]'::jsonb,
    '/product-grey-oxide.jpg', 'published', 4
  ),
  (
    'lead-sheet-plate', 'Lead Sheet & Lead Plate', 'RADIATION SHIELDING & INDUSTRIAL', '99.97% Pb / Alloy Options Available',
    'Highly malleable lead sheets and thick lead plates designed for acoustic insulation, medical radiation shielding, chemical tank linings, and roofing applications.',
    'Rolled on wooden cores or flat-packed on heavy duty pallets depending on thickness.',
    '[{"parameter":"Purity","value":"99.97% min Pb"},{"parameter":"Sheet Dimensions","value":"Thickness: 0.5mm - 10mm"},{"parameter":"Plate Dimensions","value":"Thickness: 10mm - 50mm"},{"parameter":"Customization","value":"Cut-to-size available"}]'::jsonb,
    '["X-Ray / MRI Room Shielding","Acoustic Soundproofing","Acid Tank Lining","Roofing and Flashing"]'::jsonb,
    '/plant/14 (1).jpg', 'published', 5
  ),
  (
    'lead-balls-anodes', 'Lead Balls & Lead Anodes', 'MILLING & ELECTROWINNING', 'Pure / Alloy Variants',
    'Precision-cast lead balls used in fine chemical grinding ball mills, alongside high-performance extruded/cast lead anodes for electroplating and electrowinning cells.',
    'Drums for lead balls; strapped wooden crates for anodes.',
    '[{"parameter":"Ball Dimensions","value":"12mm to 50mm Diameter"},{"parameter":"Anode Dimensions","value":"Custom Lengths & Profiles"},{"parameter":"Alloys Available","value":"Tin, Silver, Antimony"}]'::jsonb,
    '["Electroplating","Metal Refining","Milling Processes","Corrosion Protection"]'::jsonb,
    '/plant/Plant Pic 02.jpeg', 'published', 6
  ),
  (
    'alloy-dust', 'Alloy Dust (Customised Product)', 'SPECIALTY LEAD DUST', 'As per Client Specification',
    'Customised lead alloy dust tailored for specialized chemical reactions, powder metallurgy, and proprietary industrial friction formulations. Engineered to precise particle size distributions.',
    'Sealed nitrogen-purged UN-rated steel drums or bulk bags.',
    '[{"parameter":"Particle Size","value":"Custom (10 µm to 500 µm)"},{"parameter":"Composition","value":"Custom Alloy Formula"},{"parameter":"Dimensions / Mesh","value":"As per client requirement"}]'::jsonb,
    '["Specialty Chemicals","Friction Materials","Powder Metallurgy","Nuclear Shielding Putty"]'::jsonb,
    '/office/WhatsApp Image 2026-03-11 at 16.03.15.jpeg', 'published', 7
  ),
  (
    'plastic-granules', 'Plastic Granules', 'PP COPOLYMER GRANULES', 'High Impact Battery Grade',
    'Recycled and compounded Polypropylene (PP) copolymer granules derived from battery casings. Extruded and pelletized for high-impact strength, suitable for molding new battery containers and automotive components.',
    '25 Kg bags or 1 MT Jumbo Bags.',
    '[{"parameter":"Melt Flow Index (MFI)","value":"2.0 - 5.0 g/10min"},{"parameter":"Impact Strength","value":"High / Customisable"},{"parameter":"Dimensions","value":"Standard Pellet Size (3mm)"},{"parameter":"Color","value":"Black / Grey / Custom"}]'::jsonb,
    '["Battery Containers","Automotive Plastics","Injection Molding","Industrial Packaging"]'::jsonb,
    '/plant/14 (12).jpg', 'published', 8
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

commit;
