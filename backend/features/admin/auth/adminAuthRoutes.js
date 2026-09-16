import express from "express";
import { env } from "../../../config/env.js";
import { requireAdmin } from "../../../middleware/adminAuth.js";
import { createRateLimit } from "../../../middleware/rateLimit.js";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { badRequest } from "../../../shared/errors.js";
import { recordAudit } from "../../audit/auditService.js";
import {
  adminCookieOptions,
  authenticateAdmin,
} from "./adminAuthService.js";

const router = express.Router();
const loginRateLimit = createRateLimit({ windowMs: 15 * 60 * 1000, max: 10, keyPrefix: "admin-login" });

router.post(
  "/login",
  loginRateLimit,
  asyncHandler(async (req, res) => {
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");
    if (!username || !password) throw badRequest("Username and password are required.");

    const { token, user, expiresIn } = await authenticateAdmin({ username, password });
    res.cookie(env.admin.cookieName, token, adminCookieOptions);
    req.admin = user;
    await recordAudit({ req, action: "admin.login", resourceType: "admin_session" });

    res.json({
      success: true,
      token,
      username: user.username,
      user,
      expiresIn: expiresIn || env.admin.jwtExpiry,
    });
  }),
);

router.post(
  "/logout",
  requireAdmin,
  asyncHandler(async (req, res) => {
    await recordAudit({ req, action: "admin.logout", resourceType: "admin_session" });
    res.clearCookie(env.admin.cookieName, { ...adminCookieOptions, maxAge: undefined });
    res.json({ success: true, message: "Logged out successfully." });
  }),
);

router.get("/verify", requireAdmin, (req, res) => {
  res.json({
    success: true,
    admin: {
      username: req.admin.username,
      role: req.admin.role,
      permissions: req.admin.permissions,
    },
  });
});

export default router;
