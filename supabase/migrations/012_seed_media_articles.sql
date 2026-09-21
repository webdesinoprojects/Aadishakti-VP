-- Migration 012: Seed one complete Blog and one complete News article for the public Media UI.
begin;

insert into public.news_posts (
  slug,
  title,
  category,
  status,
  publish_date,
  content,
  featured_image_url,
  display_on_home,
  display_on_news
)
values
  (
    'closing-the-loop-secondary-lead-circular-economy',
    'Closing the Loop: How Secondary Lead Supports a Circular Battery Economy',
    'blogs',
    'published',
    date '2026-09-18',
    E'Lead-acid batteries are one of the world''s most established examples of circular material use. When spent batteries are collected and processed responsibly, their lead content can return to productive use instead of becoming waste.\n\nAt a modern recycling facility, incoming material moves through controlled preparation, separation, smelting and refining stages. Process discipline, trained teams and quality checks are essential at every step because the value of recycled lead depends on consistent chemistry and dependable performance.\n\nSecondary lead helps manufacturers reduce dependence on newly mined raw material while keeping an important industrial metal in circulation. For buyers, the practical priorities remain traceability, specification control and a supplier that can match recovered material to the intended application.\n\nA circular battery economy is therefore more than recycling alone. It is a connected system of responsible collection, safe processing, verified quality and reliable delivery—each stage helping recovered lead begin another useful life.',
    '/gallery/plants/Mundra/Rotary_1.jpeg',
    false,
    true
  ),
  (
    'aadishakti-highlights-integrated-mundra-recycling-operations',
    'Aadishakti Highlights Integrated Recycling Operations at Mundra',
    'news',
    'published',
    date '2026-09-21',
    E'Aadishakti Group is highlighting its integrated lead-recycling operations at the Mundra facility, where material handling, smelting and production activities are coordinated within a focused industrial setup.\n\nThe facility supports the Group''s emphasis on operational discipline, product consistency and responsible resource recovery. Teams across production, quality and logistics work together to move material through each stage while maintaining clear process controls.\n\nThe Mundra operation forms an important part of Aadishakti''s broader commitment to serving industrial customers with dependable recycled-lead products and responsive commercial support.\n\nCustomers and partners can contact the Aadishakti team for product specifications, sourcing discussions and supply enquiries.',
    '/gallery/plants/Mundra/Plant_Pic_02.jpeg',
    false,
    true
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  status = excluded.status,
  publish_date = excluded.publish_date,
  content = excluded.content,
  featured_image_url = excluded.featured_image_url,
  display_on_home = excluded.display_on_home,
  display_on_news = excluded.display_on_news,
  updated_at = timezone('utc', now());

commit;
