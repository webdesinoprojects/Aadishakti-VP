import { CisIntegrationError } from "./cisErrors.js";

const SUPPORTED_COMPANIES = ["AGRPL", "AM", "AMRPL"];

const parseBoundedInteger = (value, fallback, minimum, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
};

const readCompanyCredential = (environment, companyCode) => {
  const username = environment[`CIS_${companyCode}_USERNAME`]?.trim();
  const password = environment[`CIS_${companyCode}_PASSWORD`];
  if (!username && !password) return null;
  if (!username || !password) {
    throw new CisIntegrationError(
      "CIS_CONFIGURATION_INVALID",
      `CIS credential configuration for ${companyCode} is incomplete.`,
    );
  }
  return { username, password };
};

export const getCisConfig = (environment = process.env) => {
  const baseUrl = environment.CIS_API_BASE_URL?.trim();
  if (!baseUrl) {
    throw new CisIntegrationError("CIS_CONFIGURATION_MISSING", "CIS base URL is missing.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", "CIS base URL is invalid.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new CisIntegrationError(
      "CIS_CONFIGURATION_INVALID",
      "CIS base URL must be an HTTP(S) URL without embedded credentials.",
    );
  }
  if (environment.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
    throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", "Production CIS configuration must use HTTPS.");
  }

  const credentials = new Map();
  SUPPORTED_COMPANIES.forEach((companyCode) => {
    const credential = readCompanyCredential(environment, companyCode);
    if (credential) credentials.set(companyCode, credential);
  });

  return {
    baseUrl: parsedUrl.toString().replace(/\/$/, ""),
    timeoutMs: parseBoundedInteger(environment.CIS_REQUEST_TIMEOUT_MS, 30000, 1000, 60000),
    retryAttempts: parseBoundedInteger(environment.CIS_RETRY_ATTEMPTS, 1, 0, 2),
    retryDelayMs: parseBoundedInteger(environment.CIS_RETRY_DELAY_MS, 1000, 100, 5000),
    tokenExpirySkewMs: parseBoundedInteger(environment.CIS_TOKEN_EXPIRY_SKEW_MS, 60000, 5000, 300000),
    resourceCacheTtlMs: parseBoundedInteger(environment.CIS_RESOURCE_CACHE_TTL_MS, 120000, 10000, 900000),
    resourceCacheStaleMs: parseBoundedInteger(environment.CIS_RESOURCE_CACHE_STALE_MS, 900000, 60000, 3600000),
    resourceCacheMaxEntries: parseBoundedInteger(environment.CIS_RESOURCE_CACHE_MAX_ENTRIES, 50, 10, 500),
    credentials,
  };
};

export const getCisCompanyCredential = (config, companyCode) => {
  if (!SUPPORTED_COMPANIES.includes(companyCode)) {
    throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", "Portal account has an unsupported CIS company mapping.");
  }
  const credential = config.credentials.get(companyCode);
  if (!credential) {
    throw new CisIntegrationError("CIS_CONFIGURATION_MISSING", "CIS company credentials are not configured.");
  }
  return credential;
};
