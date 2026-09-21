-- Migration 010: Make the public Custom Alloy quote page editable from Admin CMS.
begin;

insert into public.cms_singletons (key, content)
values (
  'customAlloy',
  jsonb_build_object(
    'heroTitle', 'CUSTOM ALLOY',
    'breadcrumbLabel', 'CUSTOM ALLOY',
    'heroImage', '',
    'sectionLabel', '// ENGINEERING SPECIFICATIONS',
    'heading', 'Request a Custom Alloy Quote',
    'introduction', 'Define your required metallurgical composition. Our technical team will review your specifications and return a formal analysis and quotation.',
    'metallurgicalHeading', 'Metallurgical Specification',
    'notesLabel', 'Additional Notes / Specific Requirements',
    'notesPlaceholder', 'Any packaging requirements, delivery timelines, etc.',
    'uploadLabel', 'Upload Specification / Custom Requirement (Optional)',
    'uploadPrompt', 'Drag & drop or click to upload your specification sheet, RFQ, or custom requirement document',
    'uploadHint', 'PDF, DOC, DOCX — Max 10MB',
    'submitButton', 'Submit Request',
    'successTitle', 'Request Submitted Successfully',
    'successMessage', 'Thank you for your request. Our metallurgy team will review your specifications and get back to you with a quotation shortly.',
    'successButton', 'Submit Another Request',
    'packagingOptions', jsonb_build_array(
      jsonb_build_object('value', 'Wooden Pallet (Strapped Ingots)', 'label', 'Wooden Pallet — Strapped Ingots (Standard)'),
      jsonb_build_object('value', 'Jumbo Bag / FIBC', 'label', 'Jumbo Bag / FIBC (Bulk Granules, Oxide, Powder)'),
      jsonb_build_object('value', 'HDPE Drum', 'label', 'HDPE Drum (Oxide, Powder, Small Parts)'),
      jsonb_build_object('value', 'Loose / Bulk', 'label', 'Loose / Bulk (Large Volume Orders)'),
      jsonb_build_object('value', 'Custom / As Discussed', 'label', 'Custom / As Per Requirement')
    ),
    'alloyElements', jsonb_build_array(
      jsonb_build_object('key', 'antimony', 'name', 'Antimony (Sb)', 'defaultVal', '0.001% max'),
      jsonb_build_object('key', 'arsenic', 'name', 'Arsenic (As)', 'defaultVal', '0.001% max'),
      jsonb_build_object('key', 'tin', 'name', 'Tin (Sn)', 'defaultVal', '0.001% max'),
      jsonb_build_object('key', 'copper', 'name', 'Copper (Cu)', 'defaultVal', '0.001% max'),
      jsonb_build_object('key', 'bismuth', 'name', 'Bismuth (Bi)', 'defaultVal', '0.015% max'),
      jsonb_build_object('key', 'silver', 'name', 'Silver (Ag)', 'defaultVal', '0.003% max'),
      jsonb_build_object('key', 'iron', 'name', 'Iron (Fe)', 'defaultVal', '0.001% max'),
      jsonb_build_object('key', 'lead', 'name', 'Lead (Pb)', 'defaultVal', '99.970% min')
    )
  )
)
on conflict (key) do nothing;

commit;
