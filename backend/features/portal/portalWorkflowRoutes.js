import path from "path";
import express from "express";
import multer from "multer";
import { createPortalAuth } from "../../middleware/portalAuth.js";
import { asyncHandler } from "../../shared/asyncHandler.js";
import { badRequest } from "../../shared/errors.js";
import {
  createSupportTicket,
  getVendorPerformance,
  listCustomerRequests,
  listPartnerDocuments,
  listPartnerLogistics,
  listReceipts,
  listSupportTickets,
  listVendorQuotations,
  listVendorRfqs,
  addPartnerLogisticsMessage,
  replyToSupportTicket,
  submitCustomerRequest,
  submitPartnerDocument,
  submitReceipt,
  submitVendorQuotation,
  submitVendorPod,
  updateVendorLogisticsStage,
} from "./portalWorkflowService.js";

const extensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf", ".doc", ".docx", ".xls", ".xlsx"]);
const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, callback) => {
    const allowed = extensions.has(path.extname(file.originalname).toLowerCase());
    callback(allowed ? null : badRequest("Unsupported document type."), allowed);
  },
});

const buildRouter = (role) => {
  const router = express.Router();
  const { requirePortalRole } = createPortalAuth();
  router.use(requirePortalRole(role));
  router.get("/documents", asyncHandler(async (req, res) => res.json(await listPartnerDocuments(req.portalAccount))));
  router.post("/documents", documentUpload.single("document"), asyncHandler(async (req, res) => res.status(201).json(await submitPartnerDocument(req.portalAccount, req.body || {}, req.file))));
  router.get("/receipts", asyncHandler(async (req, res) => res.json(await listReceipts(req.portalAccount))));
  router.post("/receipts", documentUpload.single("document"), asyncHandler(async (req, res) => res.status(201).json(await submitReceipt(req.portalAccount, req.body || {}, req.file))));
  router.get("/logistics", asyncHandler(async (req, res) => res.json(await listPartnerLogistics(req.portalAccount))));
  router.post("/logistics/:id/messages", asyncHandler(async (req, res) => res.status(201).json(await addPartnerLogisticsMessage(req.portalAccount, req.params.id, req.body || {}))));
  router.get("/support", asyncHandler(async (req, res) => res.json(await listSupportTickets(req.portalAccount))));
  router.post("/support", asyncHandler(async (req, res) => res.status(201).json(await createSupportTicket(req.portalAccount, req.body || {}))));
  router.post("/support/:id/messages", asyncHandler(async (req, res) => res.status(201).json(await replyToSupportTicket(req.portalAccount, req.params.id, req.body || {}))));
  return router;
};

export const vendorWorkflowRoutes = buildRouter("vendor");
vendorWorkflowRoutes.get("/rfqs", asyncHandler(async (req, res) => res.json(await listVendorRfqs(req.portalAccount))));
vendorWorkflowRoutes.get("/quotations", asyncHandler(async (req, res) => res.json(await listVendorQuotations(req.portalAccount))));
vendorWorkflowRoutes.post("/rfqs/:assignmentId/quotation", documentUpload.single("document"), asyncHandler(async (req, res) => res.status(201).json(await submitVendorQuotation(req.portalAccount, req.params.assignmentId, req.body || {}, req.file))));
vendorWorkflowRoutes.get("/performance", asyncHandler(async (req, res) => res.json(await getVendorPerformance(req.portalAccount))));
vendorWorkflowRoutes.post("/logistics/:id/stages", documentUpload.array("proofs", 3), asyncHandler(async (req, res) => res.json(await updateVendorLogisticsStage(req.portalAccount, req.params.id, req.body || {}, req.files || []))));
vendorWorkflowRoutes.post("/logistics/:id/pod", documentUpload.single("document"), asyncHandler(async (req, res) => res.json(await submitVendorPod(req.portalAccount, req.params.id, req.file))));

export const customerWorkflowRoutes = buildRouter("customer");
customerWorkflowRoutes.get("/requests", asyncHandler(async (req, res) => res.json(await listCustomerRequests(req.portalAccount, req.query.type))));
customerWorkflowRoutes.post("/requests", documentUpload.single("document"), asyncHandler(async (req, res) => res.status(201).json(await submitCustomerRequest(req.portalAccount, req.body || {}, req.file))));
