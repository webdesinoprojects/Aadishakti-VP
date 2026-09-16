import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import "../config/env.js";
import { env } from "../config/env.js";
import { getSupabaseAdminClient } from "../infrastructure/supabase/supabaseClients.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(__dirname, "../data");
const client = getSupabaseAdminClient();
const slugify = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const readJson = async (name, fallback) => {
  try { return JSON.parse(await fs.readFile(path.join(dataDirectory, name), "utf8")); }
  catch (error) { if (error.code === "ENOENT") return fallback; throw error; }
};
const check = (error, operation) => { if (error) throw new Error(`${operation}: ${error.message}`); };

if (!env.supabase.enabled) throw new Error("Set SUPABASE_ENABLED=true before importing data.");

const [cms, products, news, careers, team, enquiries, applications] = await Promise.all([
  readJson("cms.json", {}), readJson("products.json", []), readJson("news.json", []),
  readJson("careers.json", []), readJson("team.json", []), readJson("enquiries.json", []),
  readJson("applications.json", []),
]);

const singletonKeys = ["home", "global", "pageHeroImages", "nav", "importPage", "media"];
const singletonRows = singletonKeys
  .filter((key) => cms[key] && typeof cms[key] === "object")
  .map((key) => ({ key, content: cms[key] }));
if (singletonRows.length) {
  const { error } = await client.from("cms_singletons").upsert(singletonRows, { onConflict: "key" });
  check(error, "Import CMS singletons");
}

const productRows = products.map((item, index) => ({
  slug: slugify(item.id || item.name), name: item.name, code: item.code || "", purity: item.purity || "",
  description: item.description || "", specifications: Array.isArray(item.specifications) ? item.specifications : [],
  features: Array.isArray(item.features) ? item.features : [], image_url: item.image || "",
  datasheet_url: item.datasheet || "", status: "published", sort_order: index,
}));
if (productRows.length) {
  const { error } = await client.from("products").upsert(productRows, { onConflict: "slug" });
  check(error, "Import products");
}

const newsRows = news.map((item) => ({
  slug: slugify(item.slug || `${item.title}-${item.id}`), title: item.title, category: item.category || "",
  status: String(item.status).toLowerCase() === "published" ? "published" : "draft",
  publish_date: item.publishDate ? String(item.publishDate).slice(0, 10) : null, content: item.content || "",
  featured_image_url: item.featuredImage || "", display_on_home: Boolean(item.displayOnHome),
  display_on_news: item.displayOnNews !== false,
}));
if (newsRows.length) {
  const { error } = await client.from("news_posts").upsert(newsRows, { onConflict: "slug" });
  check(error, "Import news");
}

const sourceJobs = [...(cms.careersData?.jobs || []), ...careers];
const jobsBySlug = new Map(sourceJobs.map((item) => [slugify(item.slug || item.id || item.title), item]));
const jobRows = [...jobsBySlug].map(([slug, item]) => ({
  slug, title: item.title, category: item.category || "", department: item.department || item.dept || "",
  location: item.location || "", employment_type: item.type || "", experience: item.experience || item.exp || "",
  salary_range: item.salaryRange || "", description: item.description || item.desc || "",
  requirements: Array.isArray(item.requirements) ? item.requirements : [], why_work_here: item.whyWorkHere || "",
  image_url: item.image || item.img || "", status: ["archived", "closed"].includes(String(item.status).toLowerCase()) ? "archived" : "published",
}));
if (jobRows.length) {
  const { error } = await client.from("job_postings").upsert(jobRows, { onConflict: "slug" });
  check(error, "Import job postings");
}

const teamRows = team.map((item) => ({
  legacy_id: String(item.id), name: item.name, role: item.role, bio: item.bio || "",
  photo_url: item.photo || item.image || "", category: item.category || "",
  display_order: Number(item.displayOrder) || 0, linkedin_url: item.linkedinUrl || "", is_visible: true,
}));
if (teamRows.length) {
  const { error } = await client.from("team_members").upsert(teamRows, { onConflict: "legacy_id" });
  check(error, "Import team members");
}

for (const categoryItem of cms.gallery || []) {
  const category = slugify(categoryItem.category || "general");
  const { data: album, error: albumError } = await client.from("gallery_albums")
    .upsert({ slug: category, title: category.replace(/(^|-)\w/g, (part) => part.replace("-", " ").toUpperCase()), status: "published" }, { onConflict: "slug" })
    .select("id").single();
  check(albumError, `Import gallery album ${category}`);
  const { error } = await client.from("gallery_items").upsert({
    legacy_id: String(categoryItem.id), album_id: album.id, image_url: categoryItem.image || "",
    title: categoryItem.title || "", sort_order: Number(categoryItem.sortOrder) || 0,
  }, { onConflict: "legacy_id" });
  check(error, `Import gallery item ${categoryItem.id}`);
}

if (process.argv.includes("--include-crm")) {
  const enquiryRows = enquiries.map((item) => ({
    legacy_id: String(item.id), full_name: item.fullName, work_email: item.workEmail, phone: item.phone,
    company_name: item.companyName, country: item.country || "", inquiry_type: item.inquiryType,
    products: Array.isArray(item.products) ? item.products : [], materials: Array.isArray(item.materials) ? item.materials : [],
    estimated_quantity: item.estimatedQuantity || "", packaging_requirement: item.packagingRequirement || "",
    additional_details: item.additionalDetails || "", status: String(item.status || "new").toLowerCase(),
    notes: item.notes || "", assigned_vendor_id: item.assignedVendorId || null,
    assigned_vendor_name: item.assignedVendorName || null, chat_history: item.chatHistory || [],
    submitted_at: item.submittedAt || new Date().toISOString(),
  }));
  if (enquiryRows.length) {
    const { error } = await client.from("enquiries").upsert(enquiryRows, { onConflict: "legacy_id" });
    check(error, "Import enquiries");
  }
  const applicationRows = applications.map((item) => ({
    legacy_id: String(item.id), full_name: item.fullName, email: item.email, phone: item.phone,
    role_category: item.roleCategory, experience: item.experience, description: item.description || "",
    resume_original_name: item.resumeOriginalName || "", status: String(item.status || "new").toLowerCase(),
    notes: item.notes || "", submitted_at: item.submittedAt || new Date().toISOString(),
  }));
  if (applicationRows.length) {
    const { error } = await client.from("job_applications").upsert(applicationRows, { onConflict: "legacy_id" });
    check(error, "Import job applications");
  }
}

console.log("Supabase import completed. Add --include-crm to include legacy enquiries and applications.");

