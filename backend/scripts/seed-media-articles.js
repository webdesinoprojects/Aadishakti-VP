import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  getSupabaseAdminClient,
  isSupabaseEnabled,
  throwOnSupabaseError,
} from "../infrastructure/supabase/supabaseClients.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const articles = [
  {
    slug: "closing-the-loop-secondary-lead-circular-economy",
    title: "Closing the Loop: How Secondary Lead Supports a Circular Battery Economy",
    category: "blogs",
    status: "published",
    publishDate: "2026-09-18",
    featuredImage: "/gallery/plants/Mundra/Rotary_1.jpeg",
    content: `Lead-acid batteries are one of the world's most established examples of circular material use. When spent batteries are collected and processed responsibly, their lead content can return to productive use instead of becoming waste.

At a modern recycling facility, incoming material moves through controlled preparation, separation, smelting and refining stages. Process discipline, trained teams and quality checks are essential at every step because the value of recycled lead depends on consistent chemistry and dependable performance.

Secondary lead helps manufacturers reduce dependence on newly mined raw material while keeping an important industrial metal in circulation. For buyers, the practical priorities remain traceability, specification control and a supplier that can match recovered material to the intended application.

A circular battery economy is therefore more than recycling alone. It is a connected system of responsible collection, safe processing, verified quality and reliable delivery—each stage helping recovered lead begin another useful life.`,
  },
  {
    slug: "aadishakti-highlights-integrated-mundra-recycling-operations",
    title: "Aadishakti Highlights Integrated Recycling Operations at Mundra",
    category: "news",
    status: "published",
    publishDate: "2026-09-21",
    featuredImage: "/gallery/plants/Mundra/Plant_Pic_02.jpeg",
    content: `Aadishakti Group is highlighting its integrated lead-recycling operations at the Mundra facility, where material handling, smelting and production activities are coordinated within a focused industrial setup.

The facility supports the Group's emphasis on operational discipline, product consistency and responsible resource recovery. Teams across production, quality and logistics work together to move material through each stage while maintaining clear process controls.

The Mundra operation forms an important part of Aadishakti's broader commitment to serving industrial customers with dependable recycled-lead products and responsive commercial support.

Customers and partners can contact the Aadishakti team for product specifications, sourcing discussions and supply enquiries.`,
  },
];

const seedSupabase = async () => {
  const rows = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    status: article.status,
    publish_date: article.publishDate,
    content: article.content,
    featured_image_url: article.featuredImage,
    display_on_home: false,
    display_on_news: true,
  }));
  const { data, error } = await getSupabaseAdminClient()
    .from("news_posts")
    .upsert(rows, { onConflict: "slug" })
    .select("slug,title,category,status,featured_image_url");
  throwOnSupabaseError(error, "seed media articles");
  return data || [];
};

const seedJson = async () => {
  const target = path.resolve(__dirname, "../data/news.json");
  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(target, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const now = new Date().toISOString();
  const bySlug = new Map(existing.map((item) => [item.slug, item]));
  articles.forEach((article) => {
    const current = bySlug.get(article.slug);
    bySlug.set(article.slug, {
      ...current,
      id: current?.id || article.slug,
      ...article,
      status: "Published",
      displayOnHome: false,
      displayOnNews: true,
      createdAt: current?.createdAt || now,
      updatedAt: now,
    });
  });
  const seeded = [...bySlug.values()];
  await fs.writeFile(target, `${JSON.stringify(seeded, null, 2)}\n`);
  return seeded.filter((item) => articles.some((article) => article.slug === item.slug));
};

const seeded = isSupabaseEnabled() ? await seedSupabase() : await seedJson();
console.log(`Seeded ${seeded.length} media articles.`);
seeded.forEach((article) => console.log(`- ${article.category}: ${article.title}`));
