import express from "express";
import { isSupabaseEnabled } from "../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  buildPublicCms,
  createGalleryItem,
  createJob,
  createNavigationItem,
  createNews,
  createProduct,
  createTeamMember,
  editGalleryItem,
  editJob,
  editNavigationItem,
  editNews,
  editProduct,
  editTeamMember,
  getCmsSingleton,
  getNavigation,
  listGallery,
  listJobs,
  listNews,
  listProducts,
  listTeam,
  normalizeSingletonKey,
  removeContentRow,
  saveCmsSingleton,
} from "./contentService.js";

export const adminCmsRoutes = express.Router();
export const publicCmsRoutes = express.Router();

const useSupabaseOrContinue = (_req, _res, next) => {
  if (!isSupabaseEnabled()) return next("router");
  next();
};

const adminId = (req) => req.admin.id || req.admin.sub;

const audit = (req, action, resourceType, resourceId, metadata) =>
  recordAudit({ req, action, resourceType, resourceId, metadata });

const registerCrud = ({ path, table, label, list, create, edit }) => {
  adminCmsRoutes.get(
    path,
    requirePermission(ADMIN_PERMISSIONS.CMS_READ),
    asyncHandler(async (req, res) => res.json(await list(req.query))),
  );
  adminCmsRoutes.post(
    path,
    requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
    asyncHandler(async (req, res) => {
      const item = await create(req.body || {}, adminId(req));
      await audit(req, `cms.${table}.created`, table, item.id);
      res.status(201).json(item);
    }),
  );
  adminCmsRoutes.put(
    `${path}/:id`,
    requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
    asyncHandler(async (req, res) => {
      const item = await edit(req.params.id, req.body || {}, adminId(req));
      await audit(req, `cms.${table}.updated`, table, item.id);
      res.json(item);
    }),
  );
  adminCmsRoutes.delete(
    `${path}/:id`,
    requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
    asyncHandler(async (req, res) => {
      await removeContentRow(table, req.params.id, label);
      await audit(req, `cms.${table}.deleted`, table, req.params.id);
      res.json({ success: true });
    }),
  );
};

publicCmsRoutes.use(useSupabaseOrContinue);
publicCmsRoutes.get(
  "/public",
  asyncHandler(async (_req, res) => {
    const cms = await buildPublicCms();
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json(cms);
  }),
);

publicCmsRoutes.get(
  "/navigation/:menuKey",
  asyncHandler(async (req, res) => {
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ data: await getNavigation({ menuKey: req.params.menuKey, publicOnly: true }) });
  }),
);

adminCmsRoutes.use(useSupabaseOrContinue, requireAdmin);

adminCmsRoutes.get(
  "/",
  requirePermission(ADMIN_PERMISSIONS.CMS_READ),
  asyncHandler(async (_req, res) => res.json(await buildPublicCms())),
);

adminCmsRoutes.put(
  "/",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const input = req.body || {};
    const admin = adminId(req);
    const reserved = new Set(["products", "gallery", "news", "team", "jobListings"]);
    await Promise.all(
      Object.entries(input)
        .filter(([key, value]) => !reserved.has(key) && value && typeof value === "object" && !Array.isArray(value))
        .map(([key, value]) => saveCmsSingleton(key, value, admin)),
    );
    await audit(req, "cms.bundle.updated", "cms_bundle", "public");
    res.json({ success: true, cms: await buildPublicCms() });
  }),
);

for (const [path, key, fallback] of [
  ["/hero", "home", { heroSlides: [] }],
  ["/investors", "investors", {}],
]) {
  adminCmsRoutes.get(
    path,
    requirePermission(ADMIN_PERMISSIONS.CMS_READ),
    asyncHandler(async (_req, res) => res.json(await getCmsSingleton(key, fallback))),
  );
  adminCmsRoutes.put(
    path,
    requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
    asyncHandler(async (req, res) => {
      const data = await saveCmsSingleton(key, req.body || {}, adminId(req));
      await audit(req, `cms.${key}.updated`, "cms_singleton", key);
      res.json({ success: true, data });
    }),
  );
}

adminCmsRoutes.get(
  "/singletons/:key",
  requirePermission(ADMIN_PERMISSIONS.CMS_READ),
  asyncHandler(async (req, res) => {
    const key = normalizeSingletonKey(req.params.key);
    res.json({ data: await getCmsSingleton(key, {}) });
  }),
);
adminCmsRoutes.put(
  "/singletons/:key",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const key = normalizeSingletonKey(req.params.key);
    const data = await saveCmsSingleton(key, req.body || {}, adminId(req));
    await audit(req, "cms.singleton.updated", "cms_singleton", key);
    res.json({ data });
  }),
);

adminCmsRoutes.get(
  "/navigation",
  requirePermission(ADMIN_PERMISSIONS.CMS_READ),
  asyncHandler(async (req, res) =>
    res.json({ data: await getNavigation({ menuKey: req.query.menuKey || "primary" }) }),
  ),
);
adminCmsRoutes.post(
  "/navigation",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const item = await createNavigationItem(req.body || {}, adminId(req));
    await audit(req, "cms.navigation.created", "cms_navigation_items", item.id);
    res.status(201).json({ data: item });
  }),
);
adminCmsRoutes.patch(
  "/navigation/:id",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const item = await editNavigationItem(req.params.id, req.body || {}, adminId(req));
    await audit(req, "cms.navigation.updated", "cms_navigation_items", item.id);
    res.json({ data: item });
  }),
);
adminCmsRoutes.delete(
  "/navigation/:id",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    await removeContentRow("cms_navigation_items", req.params.id, "Navigation item");
    await audit(req, "cms.navigation.deleted", "cms_navigation_items", req.params.id);
    res.status(204).end();
  }),
);

registerCrud({
  path: "/products",
  table: "products",
  label: "Product",
  list: () => listProducts(),
  create: createProduct,
  edit: editProduct,
});
registerCrud({
  path: "/gallery",
  table: "gallery_items",
  label: "Gallery item",
  list: (query) => listGallery({ category: query.category }),
  create: createGalleryItem,
  edit: editGalleryItem,
});
registerCrud({
  path: "/news",
  table: "news_posts",
  label: "News item",
  list: (query) => listNews({ status: query.status }),
  create: createNews,
  edit: editNews,
});
registerCrud({
  path: "/careers",
  table: "job_postings",
  label: "Job posting",
  list: (query) => listJobs({ status: query.status }),
  create: createJob,
  edit: editJob,
});
registerCrud({
  path: "/team",
  table: "team_members",
  label: "Team member",
  list: () => listTeam(),
  create: createTeamMember,
  edit: editTeamMember,
});
