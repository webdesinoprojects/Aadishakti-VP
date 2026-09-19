import jwt from "jsonwebtoken";
import { createPortalAccountService } from "../services/portalAccountService.js";
import { getPortalSessionConfig, verifyPortalSession } from "../services/portalSessionService.js";

const safeUnauthorized = (res, message = "Portal authentication is required.") => res.status(401).json({ error: message });

export const createPortalAuth = ({ accountService = createPortalAccountService(), environment = process.env } = {}) => {
  const requirePortalSession = async (req, res, next) => {
    try {
      const { cookieName } = getPortalSessionConfig(environment);
      const token = req.cookies?.[cookieName];
      if (!token) return safeUnauthorized(res);

      const payload = verifyPortalSession(token, environment);
      const account = await accountService.getAccountById(payload.sub);
      if (!account) return safeUnauthorized(res, "Portal session is no longer valid.");

      req.portalAccount = account;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) return safeUnauthorized(res, "Portal session has expired.");
      if (error instanceof jwt.JsonWebTokenError) return safeUnauthorized(res, "Portal session is invalid.");
      return res.status(503).json({ error: "Portal authentication is not configured." });
    }
  };

  const requirePortalRole = (role) => (req, res, next) => {
    requirePortalSession(req, res, () => {
      if (req.portalAccount.role !== role) {
        return res.status(403).json({ error: "This portal role is not authorized for the requested resource." });
      }
      return next();
    });
  };

  return { requirePortalSession, requirePortalRole };
};
