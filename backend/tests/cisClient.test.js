import test from "node:test";
import assert from "node:assert/strict";
import { createCisClient } from "../integrations/cis/cisClient.js";

const config = {
  baseUrl: "http://cis.test:81",
  timeoutMs: 100,
  retryAttempts: 1,
  retryDelayMs: 1,
  tokenExpirySkewMs: 5000,
  credentials: new Map([["AGRPL", { username: "company-user", password: "company-password" }]]),
};

const jsonResponse = (status, payload) => new Response(JSON.stringify(payload), {
  status,
  headers: { "Content-Type": "application/json" },
});

const loginPayload = (token = "private-token") => ({
  success: true,
  token,
  expiresAtUtc: "2030-01-01T00:00:00Z",
  companyCode: "AGRPL",
  permissions: ["Customer.Read"],
});

test("CIS client logs in backend-side, reuses JWT, and returns validated data envelopes", async () => {
  const calls = [];
  const client = createCisClient({
    configProvider: () => config,
    now: () => Date.parse("2029-01-01T00:00:00Z"),
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      if (String(url).endsWith("/api/auth/login")) return jsonResponse(200, loginPayload());
      return jsonResponse(200, { success: true, message: null, data: [{ cardCode: "C-1" }] });
    },
  });

  await client.getResource({ companyCode: "AGRPL", resource: "customer" });
  await client.getResource({ companyCode: "AGRPL", resource: "arinvoice" });
  assert.equal(calls.filter((call) => call.url.endsWith("/api/auth/login")).length, 1);
  assert.equal(calls[1].options.headers.Authorization, "Bearer private-token");
  assert.doesNotMatch(JSON.stringify(calls[1]), /company-password/);
});

test("CIS client refreshes one rejected JWT once", async () => {
  let logins = 0;
  let reads = 0;
  const client = createCisClient({
    configProvider: () => config,
    now: () => Date.parse("2029-01-01T00:00:00Z"),
    fetchImpl: async (url) => {
      if (String(url).endsWith("/api/auth/login")) {
        logins += 1;
        return jsonResponse(200, loginPayload(`token-${logins}`));
      }
      reads += 1;
      return reads === 1
        ? jsonResponse(401, { success: false, message: "Authentication is required." })
        : jsonResponse(200, { success: true, data: [] });
    },
  });
  assert.deepEqual(await client.getResource({ companyCode: "AGRPL", resource: "customer" }), []);
  assert.equal(logins, 2);
  assert.equal(reads, 2);
});

test("CIS timeout covers blocked response-body consumption", async () => {
  const client = createCisClient({
    configProvider: () => ({ ...config, retryAttempts: 0, timeoutMs: 20 }),
    fetchImpl: async (_url, options) => ({
      ok: true,
      status: 200,
      text: () => new Promise((_resolve, reject) => {
        options.signal.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
      }),
    }),
  });
  await assert.rejects(
    () => client.getResource({ companyCode: "AGRPL", resource: "customer" }),
    (error) => error.code === "CIS_TIMEOUT",
  );
});

test("CIS client retries transient failures but rejects malformed envelopes", async () => {
  let call = 0;
  const retrying = createCisClient({
    configProvider: () => config,
    wait: async () => {},
    now: () => Date.parse("2029-01-01T00:00:00Z"),
    fetchImpl: async (url) => {
      if (String(url).endsWith("/api/auth/login")) return jsonResponse(200, loginPayload());
      call += 1;
      return call === 1
        ? jsonResponse(502, { success: false })
        : jsonResponse(200, { success: true, data: [] });
    },
  });
  assert.deepEqual(await retrying.getResource({ companyCode: "AGRPL", resource: "customer" }), []);
  assert.equal(call, 2);

  const malformed = createCisClient({
    configProvider: () => config,
    now: () => Date.parse("2029-01-01T00:00:00Z"),
    fetchImpl: async (url) => String(url).endsWith("/api/auth/login")
      ? jsonResponse(200, loginPayload())
      : jsonResponse(200, { success: true, data: {} }),
  });
  await assert.rejects(
    () => malformed.getResource({ companyCode: "AGRPL", resource: "customer" }),
    (error) => error.code === "CIS_MALFORMED_RESPONSE",
  );
});
