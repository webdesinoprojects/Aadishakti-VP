import express from "express";
import { requireAdmin, requirePermission } from "../../middleware/adminAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { ADMIN_PERMISSIONS } from "../admin/auth/adminPermissions.js";
import { recordAudit } from "../audit/auditService.js";
import {
  assignRfq,
  createRfq,
  listAdminCustomerRequests,
  listAdminPartnerDocuments,
  listAdminQuotations,
  listAdminReceipts,
  listAdminRfqs,
  listAdminSupportTickets,
  replyAsAdmin,
  reviewCustomerRequest,
  reviewPartnerDocument,
  reviewQuotation,
  reviewReceipt,
  upsertVendorPerformance,
} from "./portalWorkflowAdminService.js";

const router = express.Router();
const adminId = (req) => req.admin.id || req.admin.sub;
router.use(requireAdmin);
router.get("/documents", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminPartnerDocuments())));
router.patch("/documents/:id", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await reviewPartnerDocument(req.params.id, req.body || {}, adminId(req)))));
router.get("/receipts", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminReceipts())));
router.patch("/receipts/:id", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await reviewReceipt(req.params.id, req.body || {}, adminId(req)))));
router.get("/customer-requests", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminCustomerRequests())));
router.patch("/customer-requests/:id", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await reviewCustomerRequest(req.params.id, req.body || {}, adminId(req)))));
router.get("/support", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminSupportTickets())));
router.post("/support/:id/messages", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.status(201).json(await replyAsAdmin(req.params.id, req.body || {}, adminId(req)))));
router.get("/rfqs", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminRfqs())));
router.post("/rfqs", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => {
  const item = await createRfq(req.body || {}, adminId(req));
  await recordAudit({ req, action: "portal.rfq.created", resourceType: "rfq", resourceId: item.id });
  res.status(201).json(item);
}));
router.post("/rfqs/:id/assign", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await assignRfq(req.params.id, req.body || {}))));
router.get("/quotations", requirePermission(ADMIN_PERMISSIONS.PORTAL_READ), asyncHandler(async (_req, res) => res.json(await listAdminQuotations())));
router.patch("/quotations/:id", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await reviewQuotation(req.params.id, req.body || {}))));
router.post("/performance", requirePermission(ADMIN_PERMISSIONS.PORTAL_WRITE), asyncHandler(async (req, res) => res.json(await upsertVendorPerformance(req.body || {}, adminId(req)))));

export default router;
