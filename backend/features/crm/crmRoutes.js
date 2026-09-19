import path from "path";
import express from "express";
import multer from "multer";
import { isSupabaseEnabled } from "../../infrastructure/supabase/supabaseClients.js";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { createRateLimit } from "../../middleware/rateLimit.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { badRequest } from "../../shared/errors.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  addEnquiryChat,
  assignEnquiry,
  editApplication,
  editEnquiry,
  getApplications,
  getEnquiries,
  getResume,
  removeCrmRow,
  submitApplication,
  submitEnquiry,
} from "./crmService.js";

export const adminCrmRoutes = express.Router();
export const publicCrmRoutes = express.Router();
export const crmLookupRoutes = express.Router();

const useSupabaseOrContinue = (_req, _res, next) => {
  if (!isSupabaseEnabled()) return next("router");
  next();
};

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx"]);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowed = allowedExtensions.has(extension);
    callback(allowed ? null : badRequest("Unsupported attachment type."), allowed);
  },
});

const publicSubmissionLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  keyPrefix: "public-form-submission",
  code: "SUBMISSION_RATE_LIMITED",
  message: "Too many submissions. Please wait and try again.",
});

publicCrmRoutes.use(useSupabaseOrContinue);
publicCrmRoutes.post(
  "/enquiries",
  publicSubmissionLimit,
  upload.single("attachment"),
  asyncHandler(async (req, res) => {
    const enquiry = await submitEnquiry(req.body || {}, req.file);
    res.status(201).json({ success: true, message: "Enquiry submitted successfully!", id: enquiry.id });
  }),
);
publicCrmRoutes.post(
  "/careers",
  publicSubmissionLimit,
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    const application = await submitApplication(req.body || {}, req.file);
    res.status(201).json({ success: true, message: "Application submitted successfully!", id: application.id });
  }),
);

adminCrmRoutes.use(useSupabaseOrContinue, requireAdmin);
adminCrmRoutes.get(
  "/enquiries",
  requirePermission(ADMIN_PERMISSIONS.CRM_READ),
  asyncHandler(async (req, res) => res.json(await getEnquiries(req.query))),
);
adminCrmRoutes.put(
  "/enquiries/:id",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    const item = await editEnquiry(req.params.id, req.body || {});
    await recordAudit({ req, action: "crm.enquiry.updated", resourceType: "enquiry", resourceId: item.id });
    res.json(item);
  }),
);
adminCrmRoutes.delete(
  "/enquiries/:id",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    await removeCrmRow("enquiries", req.params.id, "Enquiry");
    await recordAudit({ req, action: "crm.enquiry.deleted", resourceType: "enquiry", resourceId: req.params.id });
    res.json({ success: true });
  }),
);
adminCrmRoutes.get(
  "/applications",
  requirePermission(ADMIN_PERMISSIONS.CRM_READ),
  asyncHandler(async (req, res) => res.json(await getApplications(req.query))),
);
adminCrmRoutes.put(
  "/applications/:id",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    const item = await editApplication(req.params.id, req.body || {});
    await recordAudit({ req, action: "crm.application.updated", resourceType: "job_application", resourceId: item.id });
    res.json(item);
  }),
);
adminCrmRoutes.delete(
  "/applications/:id",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    await removeCrmRow("job_applications", req.params.id, "Job application");
    await recordAudit({ req, action: "crm.application.deleted", resourceType: "job_application", resourceId: req.params.id });
    res.json({ success: true });
  }),
);
adminCrmRoutes.get(
  "/applications/:id/cv",
  requirePermission(ADMIN_PERMISSIONS.CRM_READ),
  asyncHandler(async (req, res) => {
    const resume = await getResume(req.params.id);
    res.redirect(302, resume.url);
  }),
);

export const enquiryWorkflowRoutes = express.Router();
enquiryWorkflowRoutes.use(useSupabaseOrContinue, requireAdmin);
enquiryWorkflowRoutes.post(
  "/:id/assign",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    const item = await assignEnquiry(req.params.id, req.body || {});
    await recordAudit({ req, action: "crm.enquiry.assigned", resourceType: "enquiry", resourceId: item.id, metadata: { vendorId: item.assignedVendorId } });
    res.json(item);
  }),
);

crmLookupRoutes.get("/vendors", useSupabaseOrContinue, requireAdmin, requirePermission(ADMIN_PERMISSIONS.CRM_READ), (_req, res) => {
  // CIS does not expose an all-vendors directory in the currently supplied contract.
  // Return an honest empty result until a real directory source is approved.
  res.json([]);
});
enquiryWorkflowRoutes.post(
  "/:id/chat",
  requirePermission(ADMIN_PERMISSIONS.CRM_WRITE),
  asyncHandler(async (req, res) => {
    const item = await addEnquiryChat(req.params.id, req.body || {}, req.admin);
    await recordAudit({ req, action: "crm.enquiry.message_added", resourceType: "enquiry", resourceId: item.id });
    res.json(item);
  }),
);
