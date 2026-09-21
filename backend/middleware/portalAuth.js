import jwt from "jsonwebtoken";
import { createPortalAccountService } from "../services/portalAccountService.js";
import { getPortalCookieName, getPortalSessionConfig, verifyPortalSession } from "../services/portalSessionService.js";

const safeUnauthorized = (res, message = "Portal authentication is required.") => res.status(401).json({ error: message });

export const createPortalAuth = ({ accountService = createPortalAccountService(), environment = process.env } = {}) => {
  const getRequestedRole = (req) => {
    const role = String(req.get("X-Portal-Role") || req.query?.role || req.body?.role || "").trim().toLowerCase();
    return new Set(["customer", "vendor"]).has(role) ? role : null;
  };

  const getSessionToken = (req, requestedRole) => {
    const config = getPortalSessionConfig(environment);
    if (requestedRole) {
      const requestedToken = req.cookies?.[getPortalCookieName(requestedRole, environment)];
      if (requestedToken) return requestedToken;
    }

    const roleTokens = ["customer", "vendor"]
      .map((role) => req.cookies?.[getPortalCookieName(role, environment)])
      .filter(Boolean);
    if (roleTokens.length === 1) return roleTokens[0];
    return req.cookies?.[config.cookieName] || null;
  };

  const authenticate = async (req, res, next, requiredRole = null) => {
    try {
      const requestedRole = requiredRole || getRequestedRole(req);
      const token = getSessionToken(req, requestedRole);
      if (!token) return safeUnauthorized(res);

      const payload = verifyPortalSession(token, environment);
      const account = await accountService.getAccountById(payload.sub);
      if (!account) return safeUnauthorized(res, "Portal session is no longer valid.");
      if (requiredRole && account.role !== requiredRole) {
        return res.status(403).json({ error: "This portal role is not authorized for the requested resource." });
      }
      if (requestedRole && account.role !== requestedRole) return safeUnauthorized(res, "Portal session role does not match this tab.");

      req.portalAccount = account;
      return next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) return safeUnauthorized(res, "Portal session has expired.");
      if (error instanceof jwt.JsonWebTokenError) return safeUnauthorized(res, "Portal session is invalid.");
      return res.status(503).json({ error: "Portal authentication is not configured." });
    }
  };

  const requirePortalSession = (req, res, next) => authenticate(req, res, next);

  const requirePortalRole = (role) => (req, res, next) => authenticate(req, res, next, role);

  return { requirePortalSession, requirePortalRole };
};
