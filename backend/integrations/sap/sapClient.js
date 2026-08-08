import { getSapConfig } from "./sapConfig.js";
import { SapIntegrationError, getSafeSapDiagnostic } from "./sapErrors.js";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const encodePath = (segments) => segments.map((segment) => encodeURIComponent(String(segment))).join("/");

const createUrl = (baseUrl, pathSegments, query = {}) => {
  const url = new URL(`${baseUrl}/${encodePath(pathSegments)}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
};

const isRetryableStatus = (status) => status === 500 || status === 502;

const endpointLabelFor = (pathSegments) => {
  if (pathSegments[0] !== "api") return "sap-get";
  if (pathSegments[1] === "documents") return "documents";
  return pathSegments.slice(0, 3).join("/");
};

const parseJson = async (response) => {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new SapIntegrationError("SAP_MALFORMED_RESPONSE", "SAP returned invalid JSON.", { status: response.status, cause });
  }
};

const assertPagedResponse = (payload) => {
  if (!payload || !Number.isInteger(payload.total) || payload.total < 0 || !Array.isArray(payload.items)) {
    throw new SapIntegrationError("SAP_MALFORMED_RESPONSE", "SAP returned an invalid paged response.");
  }
  return payload;
};

export const createSapClient = ({
  environment = process.env,
  configProvider = getSapConfig,
  fetchImpl = globalThis.fetch,
  logger = console,
  wait = sleep,
} = {}) => {
  if (typeof fetchImpl !== "function") {
    throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "A fetch implementation is required.");
  }

  const get = async ({ pathSegments, query, endpointLabel } = {}) => {
    if (!Array.isArray(pathSegments) || pathSegments.length === 0) {
      throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "SAP request path is required.");
    }

    const config = configProvider(environment);
    const label = endpointLabel || endpointLabelFor(pathSegments);
    const url = createUrl(config.baseUrl, pathSegments, query);
    const totalAttempts = config.retryAttempts + 1;
    let lastError;

    for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const response = await fetchImpl(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Api-Key": config.apiKey,
          },
          signal: controller.signal,
        });

        if (response.ok) return await parseJson(response);

        // Consume the provider response while this attempt's timeout remains active.
        // Provider error details are intentionally discarded and never relayed or logged.
        await response.text();

        const retryable = isRetryableStatus(response.status);
        lastError = new SapIntegrationError("SAP_UPSTREAM_ERROR", "SAP request failed.", {
          status: response.status,
          retryable,
        });

        if (!retryable || attempt === totalAttempts) throw lastError;
      } catch (error) {
        const isTimeout = error?.name === "AbortError";
        const normalized = error instanceof SapIntegrationError
          ? error
          : new SapIntegrationError(isTimeout ? "SAP_TIMEOUT" : "SAP_NETWORK_ERROR", "SAP request failed.", {
            retryable: true,
            cause: error,
          });
        lastError = normalized;

        logger.warn?.("[SAP Integration] request failed", getSafeSapDiagnostic(normalized, { endpoint: label, attempt }));
        if (!normalized.retryable || attempt === totalAttempts) throw normalized;
      } finally {
        clearTimeout(timeout);
      }

      await wait(config.retryDelayMs * (2 ** (attempt - 1)));
    }

    throw lastError || new SapIntegrationError("SAP_UNAVAILABLE", "SAP request failed.");
  };

  const listAllExactDocumentRecords = async ({ type, authorizedCardCode, pageSize } = {}) => {
    if (!type || !authorizedCardCode) {
      throw new SapIntegrationError("SAP_CONFIGURATION_INVALID", "Document type and authorized account are required.");
    }

    const config = configProvider(environment);
    const requestedPageSize = Math.min(Math.max(Number(pageSize) || config.documentPageSize, 1), 500);
    const exactMatches = [];
    let providerTotal = null;
    let providerPageCount = 0;
    let providerRecordsSeen = 0;

    const failPaginationSafely = (code, message) => {
      const error = new SapIntegrationError(code, message);
      logger.error?.(
        "[SAP Integration] document pagination stopped safely",
        getSafeSapDiagnostic(error, { endpoint: "documents-list" }),
      );
      throw error;
    };

    for (let page = 1; ; page += 1) {
      if (page > config.maxDocumentPages) {
        failPaginationSafely("SAP_DOCUMENT_RESULT_LIMIT", "SAP document search exceeded the configured page limit.");
      }

      const payload = assertPagedResponse(await get({
        pathSegments: ["api", "documents", type],
        query: { page, pageSize: requestedPageSize, q: authorizedCardCode },
        endpointLabel: "documents-list",
      }));

      if (providerTotal === null) {
        providerTotal = payload.total;
        providerPageCount = Math.ceil(providerTotal / requestedPageSize);
        if (providerTotal > config.maxDocumentRecords || providerPageCount > config.maxDocumentPages) {
          failPaginationSafely("SAP_DOCUMENT_RESULT_LIMIT", "SAP document search exceeded the configured result limit.");
        }
      } else if (payload.total !== providerTotal) {
        failPaginationSafely("SAP_PAGINATION_CHANGED", "SAP document pagination changed during the request.");
      }

      providerRecordsSeen += payload.items.length;
      if (providerRecordsSeen > config.maxDocumentRecords) {
        failPaginationSafely("SAP_DOCUMENT_RESULT_LIMIT", "SAP document search exceeded the configured record limit.");
      }

      payload.items.forEach((record) => {
        if (record?.CardCode === authorizedCardCode) exactMatches.push(record);
      });

      if (page >= providerPageCount) break;
    }

    if (providerRecordsSeen !== providerTotal) {
      failPaginationSafely("SAP_PAGINATION_CHANGED", "SAP document pagination returned an inconsistent result count.");
    }

    return { total: exactMatches.length, items: exactMatches };
  };

  return { get, listAllExactDocumentRecords };
};
