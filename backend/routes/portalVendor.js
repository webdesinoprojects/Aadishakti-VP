import express from "express";
import { toSafeCisClientError } from "../integrations/cis/cisErrors.js";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { createPortalAccountService } from "../services/portalAccountService.js";
import { createVendorPortalService, VendorPortalRecordNotFoundError } from "../services/vendorPortalService.js";

export const createPortalVendorRouter = ({
  environment = process.env,
  accountService = createPortalAccountService({ environment }),
  vendorPortalService = createVendorPortalService(),
} = {}) => {
  const router = express.Router();
  const { requirePortalRole } = createPortalAuth({ environment, accountService });

  router.use(requirePortalRole("vendor"));
  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  const listOptions = (req) => ({ page: req.query.page, pageSize: req.query.pageSize, q: req.query.q });

  const listHandler = (method) => async (req, res, next) => {
    try {
      return res.json(await method(req.portalAccount, listOptions(req)));
    } catch (error) {
      return next(error);
    }
  };

  const detailHandler = (method) => async (req, res, next) => {
    if (!/^\d+$/.test(req.params.docEntry) || Number(req.params.docEntry) < 1) {
      return res.status(404).json({ code: "VENDOR_RECORD_NOT_FOUND", error: "The requested record was not found." });
    }
    try {
      return res.json(await method(req.portalAccount, req.params.docEntry, req.query.companyCode));
    } catch (error) {
      return next(error);
    }
  };

  router.get("/session", (req, res) => {
    res.json({ session: { role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });
  router.get("/profile", async (req, res, next) => {
    try {
      return res.json(await vendorPortalService.getProfile(req.portalAccount));
    } catch (error) {
      return next(error);
    }
  });
  router.get("/dashboard", async (req, res, next) => {
    try {
      return res.json(await vendorPortalService.getDashboard(req.portalAccount));
    } catch (error) {
      return next(error);
    }
  });

  router.get("/purchase-orders", listHandler(vendorPortalService.getPurchaseOrders));
  router.get("/purchase-orders/:docEntry", detailHandler(vendorPortalService.getPurchaseOrder));
  router.get("/invoices", listHandler(vendorPortalService.getInvoices));
  router.get("/invoices/:docEntry", detailHandler(vendorPortalService.getInvoice));
  router.get("/credit-notes", listHandler(vendorPortalService.getCreditNotes));
  router.get("/credit-notes/:docEntry", detailHandler(vendorPortalService.getCreditNote));
  router.get("/debit-notes", listHandler(vendorPortalService.getDebitNotes));
  router.get("/debit-notes/:docEntry", detailHandler(vendorPortalService.getDebitNote));
  router.get("/grpos", listHandler(vendorPortalService.getGrpos));
  router.get("/grpos/:docEntry", detailHandler(vendorPortalService.getGrpo));
  router.get("/payments", listHandler(vendorPortalService.getPayments));
  router.get("/payments/:docEntry", detailHandler(vendorPortalService.getPayment));

  router.use((error, _req, res, _next) => {
    if (error instanceof VendorPortalRecordNotFoundError) {
      return res.status(404).json({ code: "VENDOR_RECORD_NOT_FOUND", error: "The requested record was not found." });
    }
    const safe = toSafeCisClientError(error);
    return res.status(safe.status).json({ code: safe.code, error: safe.message });
  });

  return router;
};

export default createPortalVendorRouter();
