import { getCisCompanyCredential, getCisConfig } from "./cisConfig.js";
import { CisIntegrationError, getSafeCisDiagnostic } from "./cisErrors.js";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const isRetryableStatus = (status) => status === 500 || status === 502 || status === 503;

const parseJson = async (response) => {
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned invalid JSON.", {
      status: response.status,
      cause,
    });
  }
};

const assertSuccessEnvelope = (payload) => {
  if (!payload || payload.success !== true || !Array.isArray(payload.data)) {
    throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned an invalid data response.");
  }
  return payload.data;
};

const assertLoginPayload = (payload, companyCode) => {
  if (
    !payload
    || payload.success !== true
    || typeof payload.token !== "string"
    || !payload.token
    || typeof payload.expiresAtUtc !== "string"
    || payload.companyCode !== companyCode
    || !Array.isArray(payload.permissions)
  ) {
    throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned an invalid login response.");
  }
  const expiresAt = Date.parse(payload.expiresAtUtc);
  if (!Number.isFinite(expiresAt)) {
    throw new CisIntegrationError("CIS_MALFORMED_RESPONSE", "CIS returned an invalid token expiry.");
  }
  return { token: payload.token, expiresAt, permissions: [...payload.permissions] };
};

export const createCisClient = ({
  environment = process.env,
  configProvider = getCisConfig,
  fetchImpl = globalThis.fetch,
  logger = console,
  wait = sleep,
  now = () => Date.now(),
} = {}) => {
  if (typeof fetchImpl !== "function") {
    throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", "A fetch implementation is required.");
  }

  const tokenCache = new Map();
  const pendingLogins = new Map();
  const resourceCache = new Map();
  const pendingResources = new Map();

  const cacheSettings = () => {
    const config = configProvider(environment);
    return {
      ttlMs: Number.isFinite(config.resourceCacheTtlMs) ? config.resourceCacheTtlMs : 120000,
      staleMs: Number.isFinite(config.resourceCacheStaleMs) ? config.resourceCacheStaleMs : 900000,
      maxEntries: Number.isFinite(config.resourceCacheMaxEntries) ? config.resourceCacheMaxEntries : 50,
    };
  };

  const pruneResourceCache = (currentTime, maxEntries) => {
    resourceCache.forEach((entry, key) => {
      if (entry.staleUntil <= currentTime) resourceCache.delete(key);
    });
    while (resourceCache.size >= maxEntries) {
      resourceCache.delete(resourceCache.keys().next().value);
    }
  };

  const requestAttempt = async ({ url, method, headers, body, timeoutMs }) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(url, { method, headers, body, signal: controller.signal });
      const payload = await parseJson(response);
      return { response, payload };
    } catch (error) {
      if (error instanceof CisIntegrationError) throw error;
      const isTimeout = error?.name === "AbortError";
      throw new CisIntegrationError(
        isTimeout ? "CIS_TIMEOUT" : "CIS_NETWORK_ERROR",
        "CIS request failed.",
        { retryable: true, cause: error },
      );
    } finally {
      clearTimeout(timeout);
    }
  };

  const requestWithRetry = async ({ endpoint, method = "GET", headers, body, acceptedStatuses = [] }) => {
    const config = configProvider(environment);
    const url = new URL(endpoint, `${config.baseUrl}/`);
    const totalAttempts = config.retryAttempts + 1;
    let lastError;

    for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
      try {
        const result = await requestAttempt({
          url,
          method,
          headers,
          body,
          timeoutMs: config.timeoutMs,
        });
        if (result.response.ok || acceptedStatuses.includes(result.response.status)) return result;

        const retryable = isRetryableStatus(result.response.status);
        const code = result.response.status === 403 ? "CIS_PERMISSION_DENIED" : "CIS_UPSTREAM_ERROR";
        const error = new CisIntegrationError(code, "CIS request failed.", {
          status: result.response.status,
          retryable,
        });
        if (!retryable || attempt === totalAttempts) throw error;
        lastError = error;
      } catch (error) {
        const normalized = error instanceof CisIntegrationError
          ? error
          : new CisIntegrationError("CIS_NETWORK_ERROR", "CIS request failed.", { retryable: true, cause: error });
        lastError = normalized;
        logger.warn?.("[CIS Integration] request failed", getSafeCisDiagnostic(normalized, { endpoint, attempt }));
        if (!normalized.retryable || attempt === totalAttempts) throw normalized;
      }
      await wait(config.retryDelayMs * (2 ** (attempt - 1)));
    }
    throw lastError || new CisIntegrationError("CIS_UNAVAILABLE", "CIS request failed.");
  };

  const login = async (companyCode) => {
    const config = configProvider(environment);
    const credential = getCisCompanyCredential(config, companyCode);
    const { response, payload } = await requestWithRetry({
      endpoint: "api/auth/login",
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ UserName: credential.username, Password: credential.password }),
      acceptedStatuses: [401],
    });
    if (response.status === 401) {
      throw new CisIntegrationError("CIS_AUTHENTICATION_FAILED", "CIS authentication failed.", { status: 401 });
    }
    return assertLoginPayload(payload, companyCode);
  };

  const getToken = async (companyCode, forceRefresh = false) => {
    const config = configProvider(environment);
    const cached = tokenCache.get(companyCode);
    if (!forceRefresh && cached && cached.expiresAt - config.tokenExpirySkewMs > now()) return cached.token;
    if (!forceRefresh && pendingLogins.has(companyCode)) return pendingLogins.get(companyCode);

    const pending = login(companyCode)
      .then((session) => {
        tokenCache.set(companyCode, session);
        return session.token;
      })
      .finally(() => pendingLogins.delete(companyCode));
    pendingLogins.set(companyCode, pending);
    return pending;
  };

  const fetchResource = async ({ companyCode, resource }) => {
    let token = await getToken(companyCode);
    let result = await requestWithRetry({
      endpoint: `api/${resource}`,
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      acceptedStatuses: [401],
    });

    if (result.response.status === 401) {
      tokenCache.delete(companyCode);
      token = await getToken(companyCode, true);
      result = await requestWithRetry({
        endpoint: `api/${resource}`,
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        acceptedStatuses: [401],
      });
    }

    if (!result.response.ok) {
      throw new CisIntegrationError("CIS_AUTHENTICATION_FAILED", "CIS authentication failed.", {
        status: result.response.status,
      });
    }
    return assertSuccessEnvelope(result.payload);
  };

  const getResource = async ({ companyCode, resource, forceRefresh = false }) => {
    if (!companyCode || typeof resource !== "string" || !/^[a-z]+$/.test(resource)) {
      throw new CisIntegrationError("CIS_CONFIGURATION_INVALID", "A valid CIS company and resource are required.");
    }

    const key = `${companyCode}:${resource}`;
    const currentTime = now();
    const cached = resourceCache.get(key);
    if (!forceRefresh && cached?.expiresAt > currentTime) return cached.value;
    if (pendingResources.has(key)) return pendingResources.get(key);

    const settings = cacheSettings();
    const pending = fetchResource({ companyCode, resource })
      .then((value) => {
        const completedAt = now();
        pruneResourceCache(completedAt, settings.maxEntries);
        resourceCache.set(key, {
          value,
          expiresAt: completedAt + settings.ttlMs,
          staleUntil: completedAt + settings.ttlMs + settings.staleMs,
        });
        return value;
      })
      .catch((error) => {
        if (cached?.staleUntil > now()) {
          logger.warn?.("[CIS Integration] serving stale cached resource", { companyCode, resource });
          return cached.value;
        }
        throw error;
      })
      .finally(() => pendingResources.delete(key));
    pendingResources.set(key, pending);
    return pending;
  };

  const clearTokens = () => tokenCache.clear();
  const clearResourceCache = () => resourceCache.clear();
  return { getResource, clearTokens, clearResourceCache };
};
