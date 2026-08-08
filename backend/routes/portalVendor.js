import express from "express";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { createPortalAccountService } from "../services/portalAccountService.js";

export const createPortalVendorRouter = ({
  environment = process.env,
  accountService = createPortalAccountService({ environment }),
} = {}) => {
  const router = express.Router();
  const { requirePortalRole } = createPortalAuth({ environment, accountService });

  router.use(requirePortalRole("vendor"));

  // Phase 1A scaffolding only. SAP-backed vendor routes begin in Phase 1C.
  router.get("/session", (req, res) => {
    res.json({ session: { role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });

  return router;
};

export default createPortalVendorRouter();
