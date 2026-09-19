import crypto from "crypto";
import bcrypt from "bcryptjs";
import { isSupabaseEnabled } from "../infrastructure/supabase/supabaseClients.js";
import { findPortalAccountById, findPortalAccountByLogin, updatePortalAccountRow } from "../features/portal/portalAccountRepository.js";
import { portalAccountFromDb } from "../features/portal/portalAccountAdminService.js";

export class PortalAccountConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "PortalAccountConfigurationError";
  }
}

export class PortalPasswordChangeError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "PortalPasswordChangeError";
    this.statusCode = statusCode;
  }
}

const secureEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const readAccount = (environment, role, prefix) => {
  const identifier = environment[`PORTAL_${prefix}_LOGIN_ID`]?.trim();
  const password = environment[`PORTAL_${prefix}_LOGIN_PASSWORD`];
  const cardCode = environment[`PORTAL_${prefix}_SAP_CARD_CODE`]?.trim();
  const companyCode = environment[`PORTAL_${prefix}_CIS_COMPANY_CODE`]?.trim();
  const displayName = environment[`PORTAL_${prefix}_DISPLAY_NAME`]?.trim() || role;
  const values = [identifier, password, cardCode, companyCode];
  const populated = values.filter(Boolean).length;

  if (populated === 0) return null;
  if (populated !== values.length) {
    throw new PortalAccountConfigurationError(`Temporary ${role} portal account configuration is incomplete.`);
  }

  return { id: `${role}-demo`, role, identifier, password, cardCode, companyCode, displayName };
};

const toResolvedAccount = ({ password: _password, ...account }) => account;

export const createPortalAccountService = ({ environment = process.env } = {}) => {
  const databaseEnabled = ["1", "true", "yes", "on"].includes(String(environment.SUPABASE_ENABLED || "").toLowerCase());
  const getConfiguredAccounts = () => [
    readAccount(environment, "customer", "CUSTOMER"),
    readAccount(environment, "vendor", "VENDOR"),
  ].filter(Boolean);

  const getAccounts = () => getConfiguredAccounts().map(toResolvedAccount);

  const getAccountById = (accountId) => {
    const configured = getConfiguredAccounts().find((candidate) => candidate.id === accountId);
    if (configured) return toResolvedAccount(configured);
    if (databaseEnabled && isSupabaseEnabled()) {
      return findPortalAccountById(accountId).then((row) => {
        if (!row || row.status !== "active") return null;
        return portalAccountFromDb(row, { includeLogin: false });
      });
    }
    return null;
  };

  const authenticate = ({ identifier, password, role }) => {
    if (!["customer", "vendor"].includes(role) || !identifier || !password) return null;
    if (databaseEnabled && isSupabaseEnabled()) {
      return (async () => {
        const row = await findPortalAccountByLogin(identifier, role);
        if (!row) {
          const configured = getConfiguredAccounts().find((candidate) => candidate.role === role && secureEqual(candidate.identifier, identifier));
          return configured && secureEqual(configured.password, password) ? toResolvedAccount(configured) : null;
        }
        const now = Date.now();
        if (row.status === "inactive") return null;
        if (row.status === "locked" && row.locked_until && new Date(row.locked_until).getTime() > now) return null;
        if (!await bcrypt.compare(String(password), row.password_hash)) {
          const attempts = Number(row.failed_login_attempts || 0) + 1;
          await updatePortalAccountRow(row.id, {
            failed_login_attempts: attempts >= 5 ? 0 : attempts,
            status: attempts >= 5 ? "locked" : row.status,
            locked_until: attempts >= 5 ? new Date(now + 15 * 60 * 1000).toISOString() : row.locked_until,
          });
          return null;
        }
        const refreshed = await updatePortalAccountRow(row.id, {
          status: "active",
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: new Date().toISOString(),
        });
        return portalAccountFromDb(refreshed, { includeLogin: false });
      })();
    }
    const account = getConfiguredAccounts().find((candidate) => candidate.role === role && secureEqual(candidate.identifier, identifier));
    if (!account || !secureEqual(account.password, password)) return null;
    return toResolvedAccount(account);
  };

  const changePassword = async ({ accountId, currentPassword, newPassword }) => {
    if (!databaseEnabled || !isSupabaseEnabled()) {
      throw new PortalPasswordChangeError(503, "Password changes require database-backed portal accounts.");
    }
    const current = String(currentPassword || "");
    const replacement = String(newPassword || "");
    if (!current) throw new PortalPasswordChangeError(400, "Current password is required.");
    if (replacement.length < 8 || replacement.length > 128) {
      throw new PortalPasswordChangeError(400, "New password must contain between 8 and 128 characters.");
    }
    if (current === replacement) {
      throw new PortalPasswordChangeError(400, "New password must be different from the current password.");
    }
    const row = await findPortalAccountById(accountId);
    if (!row || row.status === "inactive") throw new PortalPasswordChangeError(401, "Portal account is unavailable.");
    if (!await bcrypt.compare(current, row.password_hash)) {
      throw new PortalPasswordChangeError(400, "Current password is incorrect.");
    }
    await updatePortalAccountRow(row.id, {
      password_hash: await bcrypt.hash(replacement, 12),
      must_change_password: false,
      failed_login_attempts: 0,
      locked_until: null,
      status: "active",
    });
    return { success: true };
  };

  return { getAccounts, getAccountById, authenticate, changePassword };
};
