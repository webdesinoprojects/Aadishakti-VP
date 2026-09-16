import express from "express";
import { requireAdmin, requirePermission } from "../../../middleware/adminAuth.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { recordAudit } from "../../audit/auditService.js";
import { ADMIN_PERMISSIONS } from "../auth/adminPermissions.js";
import { createAdminUser, listAdminUsers, updateAdminUser } from "./adminUserService.js";

const router = express.Router();
router.use(requireAdmin, requirePermission(ADMIN_PERMISSIONS.SETTINGS_WRITE));

router.get("/", asyncHandler(async (_req, res) => res.json({ data: await listAdminUsers() })));
router.post("/", asyncHandler(async (req, res) => {
  const user = await createAdminUser(req.body || {});
  await recordAudit({ req, action: "admin.user.created", resourceType: "admin_profile", resourceId: user.id, metadata: { role: user.role } });
  res.status(201).json({ data: user });
}));
router.patch("/:id", asyncHandler(async (req, res) => {
  const user = await updateAdminUser(req.params.id, req.body || {}, req.admin.id || req.admin.sub);
  await recordAudit({ req, action: "admin.user.updated", resourceType: "admin_profile", resourceId: user.id, metadata: { role: user.role, isActive: user.is_active } });
  res.json({ data: user });
}));

export default router;

