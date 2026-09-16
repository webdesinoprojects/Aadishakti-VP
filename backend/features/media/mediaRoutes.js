import express from "express";
import path from "path";
import multer from "multer";
import { env } from "../../config/env.js";
import { isSupabaseEnabled } from "../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { badRequest } from "../../shared/errors.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  createUploadAuthentication,
  editMediaAsset,
  getMediaAssets,
  registerMediaAsset,
  removeMediaAsset,
  uploadMediaBuffer,
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

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, callback) => {
    const allowed = file.mimetype.startsWith("image/") && imageExtensions.has(path.extname(file.originalname).toLowerCase());
    callback(allowed ? null : badRequest("Only JPG, PNG, WEBP, and GIF images are allowed."), allowed);
  },
});

export const mediaCompatibilityRoutes = express.Router();
mediaCompatibilityRoutes.use((_req, _res, next) => {
  if (!isSupabaseEnabled() || !env.imagekit.enabled) return next("router");
  next();
});
mediaCompatibilityRoutes.use(requireAdmin, requirePermission(ADMIN_PERMISSIONS.MEDIA_WRITE));

mediaCompatibilityRoutes.post(
  "/upload",
  imageUpload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw badRequest("No file uploaded.");
    const asset = await uploadMediaBuffer({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      tags: ["admin-upload"],
    });
    await recordAudit({ req, action: "media.asset.uploaded", resourceType: "media_asset", resourceId: asset.id });
    res.json({ success: true, url: asset.url, asset });
  }),
);

mediaCompatibilityRoutes.post(
  "/upload/multiple",
  imageUpload.array("files", 10),
  asyncHandler(async (req, res) => {
    if (!req.files?.length) throw badRequest("No files uploaded.");
    const assets = await Promise.all(req.files.map((file) => uploadMediaBuffer({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      tags: ["admin-upload"],
    })));
    await recordAudit({
      req,
      action: "media.assets.uploaded",
      resourceType: "media_asset",
      metadata: { assetIds: assets.map((asset) => asset.id) },
    });
    res.json({ success: true, urls: assets.map((asset) => asset.url), assets });
  }),
);
