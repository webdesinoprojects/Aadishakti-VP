import express from "express";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { PortalAccountConfigurationError, createPortalAccountService } from "../services/portalAccountService.js";
import { PortalSessionConfigurationError, createPortalSession, getPortalCookieClearOptions, getPortalCookieOptions, getPortalSessionConfig } from "../services/portalSessionService.js";

export const createPortalAuthRouter = ({ environment = process.env, accountService = createPortalAccountService({ environment }) } = {}) => {
  const router = express.Router();
  const { requirePortalSession } = createPortalAuth({ accountService, environment });

  router.use((_req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });

  router.post("/login", async (req, res) => {
    try {
      const { identifier, password, role } = req.body || {};
      const account = await accountService.authenticate({ identifier: String(identifier || "").trim(), password, role });
      if (!account) return res.status(401).json({ error: "Invalid portal credentials." });

      const token = createPortalSession(account, environment);
      const { cookieName } = getPortalSessionConfig(environment);
      res.cookie(cookieName, token, getPortalCookieOptions(environment));
      return res.json({ session: { role: account.role, displayName: account.displayName } });
    } catch (error) {
      if (error instanceof PortalAccountConfigurationError || error instanceof PortalSessionConfigurationError) {
        return res.status(503).json({ error: "Portal authentication is not configured." });
      }
      return res.status(500).json({ error: "Portal login could not be completed." });
    }
  });

  router.post("/logout", (req, res) => {
    try {
      const { cookieName } = getPortalSessionConfig(environment);
      res.clearCookie(cookieName, getPortalCookieClearOptions(environment));
      return res.status(204).end();
    } catch {
      return res.status(204).end();
    }
  });

  router.get("/session", requirePortalSession, (req, res) => {
    res.json({ session: { role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });

  return router;
};

export default createPortalAuthRouter();
