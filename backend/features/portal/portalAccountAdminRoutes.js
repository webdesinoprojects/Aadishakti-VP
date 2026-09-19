import express from "express";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  createPortalAccount,
  listPortalAccounts,
  resetPortalAccountPassword,
  updatePortalAccount,
} from "./portalAccountAdminService.js";

const router = express.Router();
const adminId = (req) => req.admin.id || req.admin.sub;

router.use(requireAdmin);

router.get("/accounts", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (req, res) => {
  res.json(await listPortalAccounts(req.query));
}));

router.post("/accounts", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => {
  const result = await createPortalAccount(req.body || {}, adminId(req));
  await recordAudit({ req, action: "portal.account.created", resourceType: "portal_account", resourceId: result.account.id, metadata: { role: result.account.role, companies: result.account.mappings.map((item) => item.companyCode) } });
  res.status(201).json(result);
}));

router.patch("/accounts/:id", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => {
  const account = await updatePortalAccount(req.params.id, req.body || {}, adminId(req));
  await recordAudit({ req, action: "portal.account.updated", resourceType: "portal_account", resourceId: account.id, metadata: { status: account.status } });
  res.json(account);
}));

router.post("/accounts/:id/reset-password", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => {
  const result = await resetPortalAccountPassword(req.params.id, req.body || {}, adminId(req));
  await recordAudit({ req, action: "portal.account.password_reset", resourceType: "portal_account", resourceId: result.account.id });
  res.json(result);
}));

export default router;
