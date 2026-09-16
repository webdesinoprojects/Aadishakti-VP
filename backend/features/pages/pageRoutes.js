import express from "express";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  createPage,
  getPage,
  getPages,
  removePage,
  resolvePublicPage,
  updatePage,
} from "./pageService.js";

export const publicPageRoutes = express.Router();
export const adminPageRoutes = express.Router();

publicPageRoutes.get(
  "/resolve",
  asyncHandler(async (req, res) => {
    const page = await resolvePublicPage({
      slug: req.query.slug ? String(req.query.slug) : undefined,
      routePath: req.query.path ? String(req.query.path) : undefined,
    });
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({ data: page });
  }),
);

adminPageRoutes.use(requireAdmin);

adminPageRoutes.get(
  "/",
  requirePermission(ADMIN_PERMISSIONS.CMS_READ),
  asyncHandler(async (req, res) => res.json(await getPages(req.query))),
);

adminPageRoutes.get(
  "/:id",
  requirePermission(ADMIN_PERMISSIONS.CMS_READ),
  asyncHandler(async (req, res) => res.json({ data: await getPage(req.params.id) })),
);

adminPageRoutes.post(
  "/",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const page = await createPage(req.body || {}, req.admin.id || req.admin.sub);
    await recordAudit({
      req,
      action: "cms.page.created",
      resourceType: "cms_page",
      resourceId: page.id,
    });
    res.status(201).json({ data: page });
  }),
);

adminPageRoutes.patch(
  "/:id",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    const page = await updatePage(req.params.id, req.body || {}, req.admin.id || req.admin.sub);
    await recordAudit({
      req,
      action: "cms.page.updated",
      resourceType: "cms_page",
      resourceId: page.id,
      metadata: { status: page.status },
    });
    res.json({ data: page });
  }),
);

adminPageRoutes.delete(
  "/:id",
  requirePermission(ADMIN_PERMISSIONS.CMS_WRITE),
  asyncHandler(async (req, res) => {
    await removePage(req.params.id);
    await recordAudit({
      req,
      action: "cms.page.deleted",
      resourceType: "cms_page",
      resourceId: req.params.id,
    });
    res.status(204).end();
  }),
);

