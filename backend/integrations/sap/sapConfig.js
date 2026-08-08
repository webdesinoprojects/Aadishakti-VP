import { SapIntegrationError } from "./sapErrors.js";

const parseBoundedInteger = (value, fallback, minimum, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(parsed, minimum), maximum);
};

export const getSapConfig = (environment = process.env) => {
  const baseUrl = environment.SAP_API_BASE_URL?.trim();
  const apiKey = environment.SAP_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    throw new SapIntegrationError("SAP_CONFIGURATION_MISSING", "SAP configuration is missing.");
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "SAP base URL is invalid.");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "SAP base URL must be an HTTP(S) URL without embedded credentials.");
  }

  if (environment.NODE_ENV === "production" && parsedUrl.protocol !== "https:") {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "Production SAP configuration must use HTTPS.");
  }

  return {
    baseUrl: parsedUrl.toString().replace(/\/$/, ""),
    apiKey,
    timeoutMs: parseBoundedInteger(environment.SAP_REQUEST_TIMEOUT_MS, 30000, 1000, 60000),
    retryAttempts: parseBoundedInteger(environment.SAP_RETRY_ATTEMPTS, 1, 0, 2),
    retryDelayMs: parseBoundedInteger(environment.SAP_RETRY_DELAY_MS, 1000, 100, 5000),
    documentPageSize: parseBoundedInteger(environment.SAP_DOCUMENT_PAGE_SIZE, 100, 1, 500),
    maxDocumentPages: parseBoundedInteger(environment.SAP_MAX_DOCUMENT_PAGES, 50, 1, 500),
    maxDocumentRecords: parseBoundedInteger(environment.SAP_MAX_DOCUMENT_RECORDS, 5000, 1, 100000),
  };
};
