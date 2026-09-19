import crypto from "crypto";
import bcrypt from "bcryptjs";
import { badRequest, notFound } from "../../shared/errors.js";
import {
  findPortalAccountById,
  insertPortalAccountRow,
  listPortalAccountRows,
  replacePortalAccountMappings,
  updatePortalAccountRow,
} from "./portalAccountRepository.js";

const supportedCompanies = new Set(["AGRPL", "AM", "AMRPL"]);
const clean = (value) => String(value ?? "").trim();
const requireText = (value, label) => {
  const result = clean(value);
  if (!result) throw badRequest(`${label} is required.`);
  return result;
};
const normalizeMappings = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) throw badRequest("At least one CIS company mapping is required.");
  const seen = new Set();
  const rows = items.map((item, index) => {
    const companyCode = clean(item.companyCode).toUpperCase();
    const cardCode = requireText(item.cardCode || item.sapCardCode, "SAP card code");
    if (!supportedCompanies.has(companyCode)) throw badRequest(`Unsupported CIS company: ${companyCode}.`);
    if (seen.has(companyCode)) throw badRequest(`CIS company ${companyCode} is mapped more than once.`);
    seen.add(companyCode);
    return {
      company_code: companyCode,
      sap_card_code: cardCode,
      company_label: clean(item.companyLabel),
      is_primary: Boolean(item.isPrimary) || (index === 0 && !items.some((entry) => entry.isPrimary)),
    };
  });
  if (rows.filter((item) => item.is_primary).length !== 1) throw badRequest("Exactly one CIS company mapping must be primary.");
  return rows;
};

const mappingFromDb = (row) => ({
  id: row.id,
  companyCode: row.company_code,
  cardCode: row.sap_card_code,
  companyLabel: row.company_label,
  isPrimary: row.is_primary,
});

export const portalAccountFromDb = (row, { includeLogin = true } = {}) => {
  if (!row) return null;
  const mappings = [...(row.mappings || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary)).map(mappingFromDb);
  const primary = mappings.find((mapping) => mapping.isPrimary) || mappings[0] || null;
  return {
    id: row.id,
    role: row.role,
    ...(includeLogin ? { loginId: row.login_id } : {}),
    displayName: row.display_name,
    email: row.email,
    status: row.status,
    mustChangePassword: row.must_change_password,
    lastLoginAt: row.last_login_at,
    mappings,
    cardCode: primary?.cardCode || null,
    companyCode: primary?.companyCode || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export const generateTemporaryPassword = () => `Aadi@${crypto.randomInt(100000, 1000000)}`;

export const listPortalAccounts = async (query = {}) =>
  (await listPortalAccountRows({ role: clean(query.role).toLowerCase() || undefined, status: clean(query.status).toLowerCase() || undefined }))
    .map((row) => portalAccountFromDb(row));

export const createPortalAccount = async (input, adminId) => {
  const role = clean(input.role).toLowerCase();
  if (!new Set(["vendor", "customer"]).has(role)) throw badRequest("Portal role must be vendor or customer.");
  const loginId = requireText(input.loginId, "Login ID").toLowerCase();
  const displayName = requireText(input.displayName, "Display name");
  const password = clean(input.password) || generateTemporaryPassword();
  if (password.length < 8) throw badRequest("Temporary password must contain at least 8 characters.");
  const row = await insertPortalAccountRow({
    role,
    login_id: loginId,
    password_hash: await bcrypt.hash(password, 12),
    display_name: displayName,
    email: clean(input.email).toLowerCase(),
    status: "active",
    must_change_password: input.mustChangePassword !== false,
    created_by: adminId || null,
    updated_by: adminId || null,
  }, normalizeMappings(input.mappings));
  return { account: portalAccountFromDb(row), temporaryPassword: password };
};

export const updatePortalAccount = async (id, input, adminId) => {
  const current = await findPortalAccountById(id);
  if (!current) throw notFound("Portal account");
  const payload = { updated_by: adminId || null };
  if (input.displayName !== undefined) payload.display_name = requireText(input.displayName, "Display name");
  if (input.email !== undefined) payload.email = clean(input.email).toLowerCase();
  if (input.status !== undefined) {
    const status = clean(input.status).toLowerCase();
    if (!new Set(["active", "inactive", "locked"]).has(status)) throw badRequest("Invalid portal account status.");
    payload.status = status;
    if (status === "active") payload.locked_until = null;
  }
  let result = await updatePortalAccountRow(id, payload);
  if (input.mappings !== undefined) result = await replacePortalAccountMappings(id, normalizeMappings(input.mappings));
  return portalAccountFromDb(result);
};

export const resetPortalAccountPassword = async (id, input, adminId) => {
  if (!await findPortalAccountById(id)) throw notFound("Portal account");
  const password = clean(input.password) || generateTemporaryPassword();
  if (password.length < 8) throw badRequest("Temporary password must contain at least 8 characters.");
  const row = await updatePortalAccountRow(id, {
    password_hash: await bcrypt.hash(password, 12),
    must_change_password: true,
    failed_login_attempts: 0,
    locked_until: null,
    status: "active",
    updated_by: adminId || null,
  });
  return { account: portalAccountFromDb(row), temporaryPassword: password };
};
