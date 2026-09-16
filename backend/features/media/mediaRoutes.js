import express from "express";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  createUploadAuthentication,
  editMediaAsset,
  getMediaAssets,
  registerMediaAsset,
  removeMediaAsset,
} from "./mediaService.js";

const router = express.Router();
router.use(requireAdmin);

router.get(
  "/",
  requirePermission(ADMIN_PERMISSIONS.MEDIA_READ),
  asyncHandler(async (req, res) => res.json(await getMediaAssets(req.query))),
);

router.get(
  "/upload-auth",
  requirePermission(ADMIN_PERMISSIONS.MEDIA_WRITE),
  (_req, res) => res.json({ data: createUploadAuthentication() }),
);

router.post(
  "/",
  requirePermission(ADMIN_PERMISSIONS.MEDIA_WRITE),
  asyncHandler(async (req, res) => {
    const asset = await registerMediaAsset(req.body || {}, req.admin.id || req.admin.sub);
    await recordAudit({
      req,
      action: "media.asset.created",
      resourceType: "media_asset",
      resourceId: asset.id,
      metadata: { imagekitFileId: asset.imagekit_file_id, fileType: asset.file_type },
    });
    res.status(201).json({ data: asset });
  }),
);

router.patch(
  "/:id",
  requirePermission(ADMIN_PERMISSIONS.MEDIA_WRITE),
  asyncHandler(async (req, res) => {
    const asset = await editMediaAsset(req.params.id, req.body || {});
    await recordAudit({
      req,
      action: "media.asset.updated",
      resourceType: "media_asset",
      resourceId: asset.id,
    });
    res.json({ data: asset });
  }),
);

router.delete(
  "/:id",
  requirePermission(ADMIN_PERMISSIONS.MEDIA_WRITE),
  asyncHandler(async (req, res) => {
    const asset = await removeMediaAsset(req.params.id);
    await recordAudit({
      req,
      action: "media.asset.deleted",
      resourceType: "media_asset",
      resourceId: asset.id,
      metadata: { imagekitFileId: asset.imagekit_file_id },
    });
    res.status(204).end();
  }),
);

export default router;

