import { env } from "../config/env.js";
import { can } from "../features/admin/auth/adminPermissions.js";
import { verifyAdminToken } from "../features/admin/auth/adminAuthService.js";
import { forbidden, unauthorized } from "../shared/errors.js";

const readToken = (req) => {
  const authorization = req.headers.authorization || "";
  if (authorization.startsWith("Bearer ")) return authorization.slice(7);
  return req.cookies?.[env.admin.cookieName] || "";
};

export const requireAdmin = async (req, _res, next) => {
  try {
    const token = readToken(req);
    if (!token) throw unauthorized("No authentication token provided.");
    req.admin = await verifyAdminToken(token);
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePermission = (permission) => (req, _res, next) => {
  if (!req.admin) return next(unauthorized());
  if (!can(req.admin.permissions || [], permission)) return next(forbidden());
  next();
};
