import path from "path";
import express from "express";
import multer from "multer";
import { isSupabaseEnabled } from "../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { createPortalAuth } from "../../middleware/portalAuth.js";
import { createRateLimit } from "../../middleware/rateLimit.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { badRequest } from "../../shared/errors.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  createLogisticsOrder,
  getPublicTracking,
  listLogisticsOrders,
  listProfileUpdates,
  listReconciliations,
  listRegistrations,
  reviewProfileUpdate,
  reviewReconciliation,
  reviewRegistration,
  submitPartnerRegistration,
  submitProfileUpdate,
  submitReconciliation,
  updateLogisticsOrder,
} from "./operationsService.js";

export const adminOperationsRoutes = express.Router();
export const publicRegistrationRoutes = express.Router();
export const portalOperationsRoutes = express.Router();
export const logisticsCompatibilityRoutes = express.Router();
export const publicTrackingRoutes = express.Router();

const useSupabaseOrContinue = (_req, _res, next) => {
  if (!isSupabaseEnabled()) return next("router");
  next();
};
const adminId = (req) => req.admin.id || req.admin.sub;

const documentExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx"]);
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, callback) => {
    const allowed = documentExtensions.has(path.extname(file.originalname).toLowerCase());
    callback(allowed ? null : badRequest("Unsupported document type."), allowed);
  },
});
const registrationLimit = createRateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  keyPrefix: "partner-registration",
  code: "REGISTRATION_RATE_LIMITED",
  message: "Too many registration attempts. Please wait and try again.",
});

publicRegistrationRoutes.use(useSupabaseOrContinue);
publicRegistrationRoutes.post(
  "/vendor",
  registrationLimit,
  documentUpload.fields([
    { name: "msmeDoc", maxCount: 1 },
    { name: "bankDoc", maxCount: 1 },
    { name: "qualityDoc", maxCount: 1 },
  ]),
  asyncHandler(async (req, res) => {
    const registration = await submitPartnerRegistration(req.body || {}, req.files || {});
    res.status(201).json({ success: true, applicationReference: registration.applicationReference });
  }),
);

adminOperationsRoutes.use(useSupabaseOrContinue, requireAdmin);
adminOperationsRoutes.get(
  "/registrations",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_READ),
  asyncHandler(async (req, res) => res.json(await listRegistrations(req.query))),
);
adminOperationsRoutes.patch(
  "/registrations/:id/review",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_WRITE),
  asyncHandler(async (req, res) => {
    const item = await reviewRegistration(req.params.id, req.body || {}, adminId(req));
    await recordAudit({ req, action: "operations.registration.reviewed", resourceType: "partner_registration", resourceId: item.id, metadata: { status: item.status, assignedId: item.assignedId } });
    res.json(item);
  }),
);
adminOperationsRoutes.get(
  "/profile-updates",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_READ),
  asyncHandler(async (req, res) => res.json(await listProfileUpdates(req.query))),
);
adminOperationsRoutes.patch(
  "/profile-updates/:id/review",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_WRITE),
  asyncHandler(async (req, res) => {
    const item = await reviewProfileUpdate(req.params.id, req.body || {}, adminId(req));
    await recordAudit({ req, action: "operations.profile_update.reviewed", resourceType: "profile_update_request", resourceId: item.id, metadata: { status: item.status, cisWritePerformed: false } });
    res.json(item);
  }),
);
adminOperationsRoutes.get(
  "/reconciliations",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_READ),
  asyncHandler(async (req, res) => res.json(await listReconciliations(req.query))),
);
adminOperationsRoutes.patch(
  "/reconciliations/:id/review",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_WRITE),
  asyncHandler(async (req, res) => {
    const item = await reviewReconciliation(req.params.id, req.body || {}, adminId(req));
    await recordAudit({ req, action: "operations.reconciliation.reviewed", resourceType: "reconciliation", resourceId: item.id, metadata: { status: item.status, locked: item.isLocked } });
    res.json(item);
  }),
);

const { requirePortalSession } = createPortalAuth();
portalOperationsRoutes.use(useSupabaseOrContinue, requirePortalSession);
portalOperationsRoutes.post(
  "/profile-updates",
  asyncHandler(async (req, res) => {
    const item = await submitProfileUpdate(req.body || {}, req.portalAccount);
    res.status(201).json({ data: item });
  }),
);
portalOperationsRoutes.post(
  "/reconciliations",
  documentUpload.single("document"),
  asyncHandler(async (req, res) => {
    const item = await submitReconciliation(req.body || {}, req.file, req.portalAccount);
    res.status(201).json({ data: item });
  }),
);

logisticsCompatibilityRoutes.use(useSupabaseOrContinue, requireAdmin, requirePermission(ADMIN_PERMISSIONS.OPERATIONS_READ));
logisticsCompatibilityRoutes.get(
  "/",
  asyncHandler(async (_req, res) => res.json(await listLogisticsOrders())),
);
logisticsCompatibilityRoutes.post(
  "/create",
  requirePermission(ADMIN_PERMISSIONS.OPERATIONS_WRITE),
  asyncHandler(async (req, res) => {
    const order = await createLogisticsOrder(req.body || {}, adminId(req));
    await recordAudit({ req, action: "operations.logistics.created", resourceType: "logistics_order", resourceId: order.id });
    res.status(201).json({ success: true, order });
  }),
);
for (const operation of ["chat", "review-pod"]) {
  logisticsCompatibilityRoutes.post(
    `/:id/${operation}`,
    requirePermission(ADMIN_PERMISSIONS.OPERATIONS_WRITE),
    asyncHandler(async (req, res) => {
      const order = await updateLogisticsOrder(req.params.id, operation, req.body || {}, adminId(req));
      await recordAudit({ req, action: `operations.logistics.${operation}`, resourceType: "logistics_order", resourceId: order.id });
      res.json({ success: true, order });
    }),
  );
}

publicTrackingRoutes.use(useSupabaseOrContinue);
publicTrackingRoutes.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.json(await getPublicTracking(req.params.id));
  }),
);

