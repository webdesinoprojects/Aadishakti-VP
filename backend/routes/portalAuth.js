import express from "express";
import { createPortalAuth } from "../middleware/portalAuth.js";
import { PortalAccountConfigurationError, PortalPasswordChangeError, createPortalAccountService } from "../services/portalAccountService.js";
import { createRateLimit } from "../middleware/rateLimit.js";
import { PortalSessionConfigurationError, createPortalSession, getPortalCookieClearOptions, getPortalCookieName, getPortalCookieOptions, getPortalSessionConfig } from "../services/portalSessionService.js";

export const createPortalAuthRouter = ({ environment = process.env, accountService = createPortalAccountService({ environment }) } = {}) => {
  const router = express.Router();
  const { requirePortalSession } = createPortalAuth({ accountService, environment });
  const passwordChangeLimit = createRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyPrefix: "portal-password-change",
    code: "PASSWORD_CHANGE_RATE_LIMITED",
    message: "Too many password-change attempts. Please wait and try again.",
  });

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
      const cookieName = getPortalCookieName(account.role, environment);
      res.cookie(cookieName, token, getPortalCookieOptions(environment));
      return res.json({ session: { accountId: account.id, role: account.role, displayName: account.displayName } });
    } catch (error) {
      if (error instanceof PortalAccountConfigurationError || error instanceof PortalSessionConfigurationError) {
        return res.status(503).json({ error: "Portal authentication is not configured." });
      }
      return res.status(500).json({ error: "Portal login could not be completed." });
    }
  });

  router.post("/logout", (req, res) => {
    try {
      const requestedRole = String(req.get("X-Portal-Role") || req.body?.role || "").trim().toLowerCase();
      if (new Set(["customer", "vendor"]).has(requestedRole)) {
        res.clearCookie(getPortalCookieName(requestedRole, environment), getPortalCookieClearOptions(environment));
      } else {
        res.clearCookie(getPortalCookieName("customer", environment), getPortalCookieClearOptions(environment));
        res.clearCookie(getPortalCookieName("vendor", environment), getPortalCookieClearOptions(environment));
      }
      res.clearCookie(getPortalSessionConfig(environment).cookieName, getPortalCookieClearOptions(environment));
      return res.status(204).end();
    } catch {
      return res.status(204).end();
    }
  });

  router.get("/session", requirePortalSession, (req, res) => {
    res.json({ session: { accountId: req.portalAccount.id, role: req.portalAccount.role, displayName: req.portalAccount.displayName } });
  });

  router.post("/password", passwordChangeLimit, requirePortalSession, async (req, res) => {
    try {
      await accountService.changePassword({
        accountId: req.portalAccount.id,
        currentPassword: req.body?.currentPassword,
        newPassword: req.body?.newPassword,
      });
      return res.json({ success: true });
    } catch (error) {
      if (error instanceof PortalPasswordChangeError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      return res.status(500).json({ error: "Password could not be changed." });
    }
  });

  return router;
};

export default createPortalAuthRouter();
