import "dotenv/config";
import { createPortalAccount } from "../features/portal/portalAccountAdminService.js";
import { findPortalAccountByLogin } from "../features/portal/portalAccountRepository.js";
import { env } from "../config/env.js";

if (!env.supabase.enabled) throw new Error("SUPABASE_ENABLED=true is required.");

for (const role of ["customer", "vendor"]) {
  const prefix = role.toUpperCase();
  const loginId = process.env[`PORTAL_${prefix}_LOGIN_ID`]?.trim();
  const password = process.env[`PORTAL_${prefix}_LOGIN_PASSWORD`];
  const cardCode = process.env[`PORTAL_${prefix}_SAP_CARD_CODE`]?.trim();
  const companyCode = process.env[`PORTAL_${prefix}_CIS_COMPANY_CODE`]?.trim();
  const displayName = process.env[`PORTAL_${prefix}_DISPLAY_NAME`]?.trim();
  if (![loginId, password, cardCode, companyCode, displayName].every(Boolean)) {
    console.log(`Skipped ${role}: legacy portal environment account is incomplete.`);
    continue;
  }
  const existing = await findPortalAccountByLogin(loginId, role);
  if (existing) {
    console.log(`Skipped ${role}: database portal account already exists.`);
    continue;
  }
  await createPortalAccount({
    role,
    loginId,
    password,
    displayName,
    mustChangePassword: false,
    mappings: [{ companyCode, cardCode, isPrimary: true }],
  }, null);
  console.log(`Created ${role} database portal account.`);
}
