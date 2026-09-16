import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getSupabaseAdminClient, isSupabaseEnabled, throwOnSupabaseError } from "../../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../../middleware/adminAuth.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../auth/adminPermissions.js";

const router = express.Router();
router.use(requireAdmin, requirePermission(ADMIN_PERMISSIONS.DASHBOARD_READ));

const dataDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../data");

const readJsonArray = async (fileName) => {
  try {
    const value = JSON.parse(await fs.readFile(path.join(dataDirectory, fileName), "utf8"));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const getLegacySummary = async () => {
  const [enquiries, applications, news, jobs, profileUpdates, reconciliations] = await Promise.all([
    readJsonArray("enquiries.json"),
    readJsonArray("applications.json"),
    readJsonArray("news.json"),
    readJsonArray("careers.json"),
    readJsonArray("profile_requests.json"),
    readJsonArray("soas.json"),
  ]);

  return {
    enquiries: enquiries.length,
    newEnquiries: enquiries.filter((item) => String(item.status || "new").toLowerCase() === "new").length,
    applications: applications.length,
    publishedNews: news.filter((item) => ["published", "active"].includes(String(item.status).toLowerCase())).length,
    openJobs: jobs.filter((item) => ["published", "active", "open"].includes(String(item.status).toLowerCase())).length,
    mediaAssets: 0,
    publishedPages: 0,
    pendingRegistrations: 0,
    pendingProfileUpdates: profileUpdates.filter((item) => String(item.status || "pending").toLowerCase() === "pending").length,
    pendingReconciliations: reconciliations.filter((item) => ["pending", "pending_verification"].includes(String(item.status || "pending").toLowerCase())).length,
  };
};

const count = async (table, applyFilters) => {
  let query = getSupabaseAdminClient().from(table).select("id", { count: "exact", head: true });
  if (applyFilters) query = applyFilters(query);
  const { count: total, error } = await query;
  throwOnSupabaseError(error, `count ${table}`);
  return total || 0;
};

router.get("/summary", asyncHandler(async (_req, res) => {
  if (!isSupabaseEnabled()) {
    res.json({ data: await getLegacySummary() });
    return;
  }

  const [enquiries, newEnquiries, applications, news, jobs, media, pages, registrations, profileUpdates, reconciliations] = await Promise.all([
    count("enquiries"),
    count("enquiries", (query) => query.eq("status", "new")),
    count("job_applications"),
    count("news_posts", (query) => query.eq("status", "published")),
    count("job_postings", (query) => query.eq("status", "published")),
    count("media_assets"),
    count("cms_pages", (query) => query.eq("status", "published")),
    count("partner_registrations", (query) => query.eq("status", "pending")),
    count("profile_update_requests", (query) => query.eq("status", "pending")),
    count("reconciliations", (query) => query.eq("status", "pending_verification")),
  ]);
  res.json({ data: {
    enquiries,
    newEnquiries,
    applications,
    publishedNews: news,
    openJobs: jobs,
    mediaAssets: media,
    publishedPages: pages,
    pendingRegistrations: registrations,
    pendingProfileUpdates: profileUpdates,
    pendingReconciliations: reconciliations,
  } });
}));

export default router;
