import express from "express";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { listAuditLogs } from "./auditService.js";

const router = express.Router();

router.use(requireAdmin, requirePermission(ADMIN_PERMISSIONS.AUDIT_READ));

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const logs = await listAuditLogs({
      limit: Number.parseInt(req.query.limit, 10) || 100,
      action: req.query.action,
      resourceType: req.query.resourceType,
    });
    res.json({ data: logs, count: logs.length });
  }),
);

export default router;

