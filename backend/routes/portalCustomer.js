import express from "express";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { toSafeCisClientError } from "../integrations/cis/cisErrors.js";
import { createPortalAccountService } from "../services/portalAccountService.js";
import {
  CustomerPortalFeatureUnavailableError,
  CustomerPortalRecordNotFoundError,
  createCustomerPortalService,
} from "../services/customerPortalService.js";

export const createPortalCustomerRouter = ({
  environment = process.env,
  accountService = createPortalAccountService({ environment }),
  customerPortalService = createCustomerPortalService(),
} = {}) => {
  const router = express.Router();
  const { requirePortalRole } = createPortalAuth({ environment, accountService });

  router.use(requirePortalRole("customer"));
  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  const listOptions = (req) => ({ page: req.query.page, pageSize: req.query.pageSize, q: req.query.q });

  const detailHandler = (method) => async (req, res, next) => {
    if (!/^\d+$/.test(req.params.docEntry) || Number(req.params.docEntry) < 1) {
      return res.status(404).json({ code: "CUSTOMER_RECORD_NOT_FOUND", error: "The requested record was not found." });
    }
    try {
      return res.json(await method(req.portalAccount, req.params.docEntry, req.query.companyCode));
    } catch (error) {
      return next(error);
    }
  };

  const listHandler = (method) => async (req, res, next) => {
    try {
      return res.json(await method(req.portalAccount, listOptions(req)));
    } catch (error) {
      return next(error);
    }
  };

  router.get("/session", (req, res) => {
    res.json({ session: { role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });

  router.get("/profile", async (req, res, next) => {
    try {
      return res.json(await customerPortalService.getProfile(req.portalAccount));
    } catch (error) {
      return next(error);
    }
  });

  router.get("/dashboard", async (req, res, next) => {
    try {
      return res.json(await customerPortalService.getDashboard(req.portalAccount));
    } catch (error) {
      return next(error);
    }
  });

  router.get("/orders", listHandler(customerPortalService.getOrders));
  router.get("/orders/:docEntry", detailHandler(customerPortalService.getOrder));
  router.get("/invoices", listHandler(customerPortalService.getInvoices));
  router.get("/invoices/:docEntry", detailHandler(customerPortalService.getInvoice));
  router.get("/credit-notes", listHandler(customerPortalService.getCreditNotes));
  router.get("/credit-notes/:docEntry", detailHandler(customerPortalService.getCreditNote));
  router.get("/deliveries", listHandler(customerPortalService.getDeliveries));
  router.get("/deliveries/:docEntry", detailHandler(customerPortalService.getDelivery));
  router.get("/payments", listHandler(customerPortalService.getPayments));
  router.get("/payments/:docEntry", detailHandler(customerPortalService.getPayment));

  router.use((error, _req, res, _next) => {
    if (error instanceof CustomerPortalRecordNotFoundError) {
      return res.status(404).json({ code: "CUSTOMER_RECORD_NOT_FOUND", error: "The requested record was not found." });
    }
    if (error instanceof CustomerPortalFeatureUnavailableError) {
      return res.status(501).json({
        code: "CUSTOMER_FEATURE_UNAVAILABLE",
        error: "This feature is not exposed by the current CIS API.",
      });
    }
    const safe = toSafeCisClientError(error);
    return res.status(safe.status).json({ code: safe.code, error: safe.message });
  });

  return router;
};

export default createPortalCustomerRouter();
