import express from "express";
import { getSupabaseAdminClient, throwOnSupabaseError } from "../../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../../middleware/adminAuth.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../auth/adminPermissions.js";

const router = express.Router();
router.use(requireAdmin, requirePermission(ADMIN_PERMISSIONS.DASHBOARD_READ));

const count = async (table, applyFilters) => {
  let query = getSupabaseAdminClient().from(table).select("id", { count: "exact", head: true });
  if (applyFilters) query = applyFilters(query);
  const { count: total, error } = await query;
  throwOnSupabaseError(error, `count ${table}`);
  return total || 0;
};

router.get("/summary", asyncHandler(async (_req, res) => {
  const [enquiries, newEnquiries, applications, news, jobs, media, pages] = await Promise.all([
    count("enquiries"),
    count("enquiries", (query) => query.eq("status", "new")),
    count("job_applications"),
    count("news_posts", (query) => query.eq("status", "published")),
    count("job_postings", (query) => query.eq("status", "published")),
    count("media_assets"),
    count("cms_pages", (query) => query.eq("status", "published")),
  ]);
  res.json({ data: { enquiries, newEnquiries, applications, publishedNews: news, openJobs: jobs, mediaAssets: media, publishedPages: pages } });
}));

export default router;
