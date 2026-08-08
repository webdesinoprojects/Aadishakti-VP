import express from "express";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { createPortalAccountService } from "../services/portalAccountService.js";

export const createPortalCustomerRouter = ({
  environment = process.env,
  accountService = createPortalAccountService({ environment }),
} = {}) => {
  const router = express.Router();
  const { requirePortalRole } = createPortalAuth({ environment, accountService });

  router.use(requirePortalRole("customer"));

  // Phase 1A scaffolding only. SAP-backed customer routes begin in Phase 1B.
  router.get("/session", (req, res) => {
    res.json({ session: { role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });

  return router;
};

export default createPortalCustomerRouter();
