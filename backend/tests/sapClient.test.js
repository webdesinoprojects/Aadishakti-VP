import test from "node:test";
import assert from "node:assert/strict";
import { createSapClient } from "../integrations/sap/sapClient.js";
import { SapIntegrationError } from "../integrations/sap/sapErrors.js";

const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

const createConfig = (overrides = {}) => ({
  baseUrl: "https://sap.example.test",
  apiKey: "test-only-key",
  timeoutMs: 1000,
  retryAttempts: 1,
  retryDelayMs: 1,
  documentPageSize: 2,
  maxDocumentPages: 10,
  maxDocumentRecords: 20,
  ...overrides,
});

test("SAP GET safely encodes paths and query parameters", async () => {
  let request;
  const client = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async (url, options) => {
      request = { url, options };
      return jsonResponse({ ok: true });
    },
  });

  await client.get({
    pathSegments: ["api", "customers", "A/B ?"],
    query: { q: "name & code", page: 1 },
  });

  assert.equal(request.options.method, "GET");
  assert.equal(request.options.headers.Accept, "application/json");
  assert.equal(request.options.headers["X-Api-Key"], "test-only-key");
  assert.equal(request.url.pathname, "/api/customers/A%2FB%20%3F");
  assert.equal(request.url.searchParams.get("q"), "name & code");
  assert.equal(request.url.searchParams.get("page"), "1");
});

test("SAP GET retries 500 once but does not retry 400", async () => {
  let retryableCalls = 0;
  const retryDelays = [];
  const retryableClient = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => {
      retryableCalls += 1;
      return retryableCalls === 1 ? jsonResponse({ detail: "internal" }, 500) : jsonResponse({ items: [] });
    },
    logger: { warn() {} },
    wait: async (delay) => retryDelays.push(delay),
  });

  assert.deepEqual(await retryableClient.get({ pathSegments: ["api", "documents"] }), { items: [] });
  assert.equal(retryableCalls, 2);
  assert.deepEqual(retryDelays, [1]);

  let nonRetryableCalls = 0;
  const nonRetryableClient = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => {
      nonRetryableCalls += 1;
      return jsonResponse({ detail: "bad request" }, 400);
    },
    logger: { warn() {} },
    wait: async () => {},
  });

  await assert.rejects(
    nonRetryableClient.get({ pathSegments: ["api", "documents"] }),
    (error) => error instanceof SapIntegrationError && error.status === 400 && error.retryable === false,
  );
  assert.equal(nonRetryableCalls, 1);

  let notFoundCalls = 0;
  const notFoundClient = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => {
      notFoundCalls += 1;
      return jsonResponse({ detail: "not found" }, 404);
    },
    logger: { warn() {} },
  });
  await assert.rejects(
    notFoundClient.get({ pathSegments: ["api", "orders", 999] }),
    (error) => error instanceof SapIntegrationError && error.status === 404 && error.retryable === false,
  );
  assert.equal(notFoundCalls, 1);
});

test("SAP diagnostics never include the API key or provider response detail", async () => {
  const diagnostics = [];
  const client = createSapClient({
    configProvider: () => createConfig({ apiKey: "NEVER-LOG-THIS-KEY", retryAttempts: 0 }),
    fetchImpl: async () => jsonResponse({ detail: "private infrastructure detail" }, 502),
    logger: { warn: (...args) => diagnostics.push(args) },
  });

  await assert.rejects(client.get({ pathSegments: ["api", "documents", "ap-invoice"] }));
  const logged = JSON.stringify(diagnostics);
  assert.doesNotMatch(logged, /NEVER-LOG-THIS-KEY/);
  assert.doesNotMatch(logged, /private infrastructure detail/);
});

test("malformed successful responses are normalized", async () => {
  const client = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => new Response("not-json", { status: 200 }),
    logger: { warn() {} },
  });

  await assert.rejects(
    client.get({ pathSegments: ["api", "customers"] }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_MALFORMED_RESPONSE",
  );
});

test("SAP timeout is normalized and empty paged results remain successful", async () => {
  const timeoutClient = createSapClient({
    configProvider: () => createConfig({ timeoutMs: 5, retryAttempts: 0 }),
    fetchImpl: async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true });
    }),
    logger: { warn() {} },
  });
  await assert.rejects(
    timeoutClient.get({ pathSegments: ["api", "documents"] }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_TIMEOUT",
  );

  const emptyClient = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => jsonResponse({ total: 0, items: [] }),
  });
  assert.deepEqual(
    await emptyClient.listAllExactDocumentRecords({ type: "purchase-order", authorizedCardCode: "VEND-A" }),
    { total: 0, items: [] },
  );
});

test("SAP timeout remains active while the response body is being consumed", async () => {
  let headersReturned = false;
  const client = createSapClient({
    configProvider: () => createConfig({ timeoutMs: 5, retryAttempts: 0 }),
    fetchImpl: async (_url, { signal }) => {
      headersReturned = true;
      return {
        ok: true,
        status: 200,
        text: () => new Promise((_resolve, reject) => {
          signal.addEventListener(
            "abort",
            () => reject(new DOMException("Response body timed out", "AbortError")),
            { once: true },
          );
        }),
      };
    },
    logger: { warn() {} },
  });

  await assert.rejects(
    client.get({ pathSegments: ["api", "documents"] }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_TIMEOUT",
  );
  assert.equal(headersReturned, true);
});

test("generic document pagination scans every provider page and exact-matches CardCode", async () => {
  const queries = [];
  const pages = {
    1: { total: 3, items: [{ DocEntry: 1, CardCode: "VEND-A" }, { DocEntry: 2, CardCode: "VEND-AB" }] },
    2: { total: 3, items: [{ DocEntry: 3, CardCode: "VEND-A" }] },
  };
  const client = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async (url) => {
      queries.push(Object.fromEntries(url.searchParams));
      return jsonResponse(pages[Number(url.searchParams.get("page"))]);
    },
  });

  const result = await client.listAllExactDocumentRecords({
    type: "purchase-order",
    authorizedCardCode: "VEND-A",
  });

  assert.deepEqual(result.items.map((record) => record.DocEntry), [1, 3]);
  assert.equal(result.total, 2);
  assert.equal(queries.length, 2);
  assert.ok(queries.every((query) => query.q === "VEND-A"));
});

test("generic document pagination fails instead of returning an incomplete broad result", async () => {
  const diagnostics = [];
  const client = createSapClient({
    configProvider: () => createConfig({ maxDocumentPages: 2, maxDocumentRecords: 4 }),
    fetchImpl: async () => jsonResponse({ total: 5, items: [] }),
    logger: { error: (...args) => diagnostics.push(args) },
  });

  await assert.rejects(
    client.listAllExactDocumentRecords({ type: "ap-invoice", authorizedCardCode: "VEND-SECRET" }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_DOCUMENT_RESULT_LIMIT",
  );
  assert.equal(diagnostics.length, 1);
  assert.doesNotMatch(JSON.stringify(diagnostics), /VEND-SECRET/);
});

test("generic document pagination rejects inconsistent provider totals", async () => {
  let page = 0;
  const client = createSapClient({
    configProvider: () => createConfig(),
    fetchImpl: async () => {
      page += 1;
      return jsonResponse(page === 1
        ? { total: 3, items: [{ CardCode: "VEND-A" }, { CardCode: "VEND-A" }] }
        : { total: 4, items: [{ CardCode: "VEND-A" }] });
    },
    logger: { error() {} },
  });

  await assert.rejects(
    client.listAllExactDocumentRecords({ type: "outgoing-payment", authorizedCardCode: "VEND-A" }),
    (error) => error instanceof SapIntegrationError && error.code === "SAP_PAGINATION_CHANGED",
  );
});
