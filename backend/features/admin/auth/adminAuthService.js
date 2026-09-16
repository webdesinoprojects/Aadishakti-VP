import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
import { ROLE_PERMISSIONS } from "./adminPermissions.js";
import { unauthorized } from "../../../shared/errors.js";
import {
  getSupabaseAdminClient,
  getSupabasePublicClient,
  isSupabaseEnabled,
  throwOnSupabaseError,
} from "../../../infrastructure/supabase/supabaseClients.js";

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const verifyPassword = async (password) => {
  if (env.admin.passwordHash) {
    return bcrypt.compare(password, env.admin.passwordHash);
  }
  return safeEqual(password, env.admin.password);
};

export const authenticateAdmin = async ({ username, password }) => {
  if (isSupabaseEnabled()) {
    const publicClient = getSupabasePublicClient();
    const { data: authData, error: authError } = await publicClient.auth.signInWithPassword({
      email: username,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      throw unauthorized("Invalid credentials. Please try again.");
    }

    const adminClient = getSupabaseAdminClient();
    const { data: profile, error: profileError } = await adminClient
      .from("admin_profiles")
      .select("id, email, display_name, role, permissions, is_active")
      .eq("id", authData.user.id)
      .maybeSingle();
    throwOnSupabaseError(profileError, "load the administrator profile");

    if (!profile?.is_active) {
      throw unauthorized("This administrator account is not active.");
    }

    const rolePermissions = ROLE_PERMISSIONS[profile.role] || [];
    const permissions = [...new Set([...rolePermissions, ...(profile.permissions || [])])];
    return {
      token: authData.session.access_token,
      expiresIn: authData.session.expires_in,
      user: {
        id: profile.id,
        username: profile.email || username,
        displayName: profile.display_name,
        role: profile.role,
        permissions,
      },
    };
  }

  const usernameMatches = safeEqual(username.toLowerCase(), env.admin.username.toLowerCase());
  const passwordMatches = await verifyPassword(password);

  if (!usernameMatches || !passwordMatches) {
    throw unauthorized("Invalid credentials. Please try again.");
  }

  const role = "super_admin";
  const permissions = ROLE_PERMISSIONS[role];
  const token = jwt.sign(
    { sub: username, username, role, permissions, type: "admin" },
    env.admin.jwtSecret,
    {
      expiresIn: env.admin.jwtExpiry,
      issuer: "aadishakti-api",
      audience: "aadishakti-admin",
    },
  );

  return { token, user: { username, role, permissions } };
};

export const verifyAdminToken = (token) => {
  if (isSupabaseEnabled()) return verifySupabaseAdminToken(token);

  try {
    const payload = jwt.verify(token, env.admin.jwtSecret, {
      issuer: "aadishakti-api",
      audience: "aadishakti-admin",
    });

    if (payload.type !== "admin") throw new Error("Unexpected token type");
    return payload;
  } catch {
    throw unauthorized("Invalid or expired admin session.");
  }
};

const verifySupabaseAdminToken = async (token) => {
  const publicClient = getSupabasePublicClient();
  const { data: userData, error: userError } = await publicClient.auth.getUser(token);
  if (userError || !userData.user) throw unauthorized("Invalid or expired admin session.");

  const adminClient = getSupabaseAdminClient();
  const { data: profile, error: profileError } = await adminClient
    .from("admin_profiles")
    .select("id, email, display_name, role, permissions, is_active")
    .eq("id", userData.user.id)
    .maybeSingle();
  throwOnSupabaseError(profileError, "verify the administrator profile");

  if (!profile?.is_active) throw unauthorized("This administrator account is not active.");
  const permissions = [
    ...new Set([...(ROLE_PERMISSIONS[profile.role] || []), ...(profile.permissions || [])]),
  ];
  return {
    sub: profile.id,
    id: profile.id,
    username: profile.email || userData.user.email,
    displayName: profile.display_name,
    role: profile.role,
    permissions,
    type: "admin",
  };
};

export const adminCookieOptions = Object.freeze({
  httpOnly: true,
  secure: env.admin.cookieSecure,
  sameSite: env.admin.cookieSameSite,
  path: "/",
  maxAge: 8 * 60 * 60 * 1000,
});
