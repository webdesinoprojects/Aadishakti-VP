import test from "node:test";
import assert from "node:assert/strict";

let dependencies;
let dependencyUnavailable = false;
try {
  const [expressModule, cookieParserModule, jwtModule, authRoutes, customerRoutes, vendorRoutes] = await Promise.all([
    import("express"),
    import("cookie-parser"),
    import("jsonwebtoken"),
    import("../routes/portalAuth.js"),
    import("../routes/portalCustomer.js"),
    import("../routes/portalVendor.js"),
  ]);
  dependencies = {
    express: expressModule.default,
    cookieParser: cookieParserModule.default,
    jwt: jwtModule.default,
    createPortalAuthRouter: authRoutes.createPortalAuthRouter,
    createPortalCustomerRouter: customerRoutes.createPortalCustomerRouter,
    createPortalVendorRouter: vendorRoutes.createPortalVendorRouter,
  };
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
  dependencyUnavailable = true;
}

const environment = {
  PORTAL_SESSION_SECRET: "test-only-session-secret-that-is-long-enough",
  PORTAL_SESSION_TTL_MINUTES: "30",
  PORTAL_COOKIE_SAME_SITE: "lax",
  NODE_ENV: "test",
  PORTAL_CUSTOMER_LOGIN_ID: "customer-login",
  PORTAL_CUSTOMER_LOGIN_PASSWORD: "customer-password",
  PORTAL_CUSTOMER_SAP_CARD_CODE: "SERVER-CUSTOMER-CARD",
  PORTAL_CUSTOMER_CIS_COMPANY_CODE: "AGRPL",
  PORTAL_CUSTOMER_DISPLAY_NAME: "Customer Test",
  PORTAL_VENDOR_LOGIN_ID: "vendor-login",
  PORTAL_VENDOR_LOGIN_PASSWORD: "vendor-password",
  PORTAL_VENDOR_SAP_CARD_CODE: "SERVER-VENDOR-CARD",
  PORTAL_VENDOR_CIS_COMPANY_CODE: "AMRPL",
  PORTAL_VENDOR_DISPLAY_NAME: "Vendor Test",
};

const startTestServer = async ({ customerPortalService, vendorPortalService } = {}) => {
  const app = dependencies.express();
  app.use(dependencies.cookieParser());
  app.use(dependencies.express.json());
  app.use("/api/portal/auth", dependencies.createPortalAuthRouter({ environment }));
  app.use("/api/portal/customer", dependencies.createPortalCustomerRouter({
    environment,
    ...(customerPortalService ? { customerPortalService } : {}),
  }));
  app.use("/api/portal/vendor", dependencies.createPortalVendorRouter({
    environment,
    ...(vendorPortalService ? { vendorPortalService } : {}),
  }));

  const server = await new Promise((resolve) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
  });
  const address = server.address();
  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
};

test("portal login issues an HttpOnly cookie and resolves session server-side", { skip: dependencyUnavailable }, async () => {
  const server = await startTestServer();
  try {
    const login = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: "customer-login",
        password: "customer-password",
        role: "customer",
        cardCode: "ATTACKER-CHOSEN-CARD",
      }),
    });
    assert.equal(login.status, 200);
    assert.equal(login.headers.get("cache-control"), "no-store");
    const loginBody = await login.json();
    assert.deepEqual(loginBody, { session: { accountId: "customer-demo", role: "customer", displayName: "Customer Test" } });
    assert.doesNotMatch(JSON.stringify(loginBody), /ATTACKER-CHOSEN-CARD|SERVER-CUSTOMER-CARD/);
    const setCookie = login.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Lax/i);
    assert.match(setCookie, /Path=\/api\/portal/i);

    const cookie = setCookie.split(";", 1)[0];
    const session = await fetch(`${server.baseUrl}/api/portal/auth/session`, { headers: { Cookie: cookie } });
    assert.equal(session.status, 200);
    assert.deepEqual(await session.json(), { session: { accountId: "customer-demo", role: "customer", displayName: "Customer Test" } });

    const customer = await fetch(`${server.baseUrl}/api/portal/customer/session`, { headers: { Cookie: cookie } });
    assert.equal(customer.status, 200);
    const vendor = await fetch(`${server.baseUrl}/api/portal/vendor/session`, { headers: { Cookie: cookie } });
    assert.equal(vendor.status, 403);

    const logout = await fetch(`${server.baseUrl}/api/portal/auth/logout`, {
      method: "POST",
      headers: { Cookie: cookie },
    });
    assert.equal(logout.status, 204);
    assert.match(logout.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/i);
    assert.match(logout.headers.get("set-cookie"), /Path=\/api\/portal/i);
  } finally {
    await server.close();
  }
});

test("customer portal ignores caller CardCode and uses the server-side account mapping", { skip: dependencyUnavailable }, async () => {
  let observedAccount;
  let observedOptions;
  const customerPortalService = {
    getOrders: async (account, options) => {
      observedAccount = account;
      observedOptions = options;
      return { items: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } };
    },
  };
  const server = await startTestServer({ customerPortalService });
  try {
    const login = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "customer-login", password: "customer-password", role: "customer" }),
    });
    const cookie = login.headers.get("set-cookie").split(";", 1)[0];
    const response = await fetch(`${server.baseUrl}/api/portal/customer/orders?cardCode=ATTACKER-CARD`, {
      headers: { Cookie: cookie },
    });

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(observedAccount.cardCode, "SERVER-CUSTOMER-CARD");
    assert.deepEqual(observedOptions, { page: undefined, pageSize: undefined, q: undefined });
    assert.doesNotMatch(JSON.stringify(await response.json()), /ATTACKER-CARD|SERVER-CUSTOMER-CARD/);
  } finally {
    await server.close();
  }
});

test("customer detail routes return 404 for records outside the authenticated account", { skip: dependencyUnavailable }, async () => {
  const { CustomerPortalRecordNotFoundError } = await import("../services/customerPortalService.js");
  const rejectOwnership = async () => { throw new CustomerPortalRecordNotFoundError(); };
  const customerPortalService = {
    getOrder: rejectOwnership,
    getInvoice: rejectOwnership,
    getCreditNote: rejectOwnership,
    getDelivery: rejectOwnership,
    getPayment: rejectOwnership,
  };
  const server = await startTestServer({ customerPortalService });
  try {
    const login = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "customer-login", password: "customer-password", role: "customer" }),
    });
    const cookie = login.headers.get("set-cookie").split(";", 1)[0];
    for (const area of ["orders", "invoices", "credit-notes", "deliveries", "payments"]) {
      const response = await fetch(`${server.baseUrl}/api/portal/customer/${area}/99`, { headers: { Cookie: cookie } });
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        code: "CUSTOMER_RECORD_NOT_FOUND",
        error: "The requested record was not found.",
      });
    }
  } finally {
    await server.close();
  }
});

test("vendor detail routes return 404 for records outside the authenticated account", { skip: dependencyUnavailable }, async () => {
  const { VendorPortalRecordNotFoundError } = await import("../services/vendorPortalService.js");
  const rejectOwnership = async () => { throw new VendorPortalRecordNotFoundError(); };
  const vendorPortalService = {
    getPurchaseOrder: rejectOwnership,
    getInvoice: rejectOwnership,
    getCreditNote: rejectOwnership,
    getDebitNote: rejectOwnership,
    getGrpo: rejectOwnership,
    getPayment: rejectOwnership,
  };
  const server = await startTestServer({ vendorPortalService });
  try {
    const login = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "vendor-login", password: "vendor-password", role: "vendor" }),
    });
    const cookie = login.headers.get("set-cookie").split(";", 1)[0];
    for (const area of ["purchase-orders", "invoices", "credit-notes", "debit-notes", "grpos", "payments"]) {
      const response = await fetch(`${server.baseUrl}/api/portal/vendor/${area}/99`, { headers: { Cookie: cookie } });
      assert.equal(response.status, 404);
      assert.deepEqual(await response.json(), {
        code: "VENDOR_RECORD_NOT_FOUND",
        error: "The requested record was not found.",
      });
    }
  } finally {
    await server.close();
  }
});

test("vendor portal ignores caller CardCode and enforces the server-side role and mapping", { skip: dependencyUnavailable }, async () => {
  let observedAccount;
  const vendorPortalService = {
    getPurchaseOrders: async (account) => {
      observedAccount = account;
      return { items: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } };
    },
  };
  const server = await startTestServer({ vendorPortalService });
  try {
    const vendorLogin = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "vendor-login", password: "vendor-password", role: "vendor" }),
    });
    const vendorCookie = vendorLogin.headers.get("set-cookie").split(";", 1)[0];
    const response = await fetch(`${server.baseUrl}/api/portal/vendor/purchase-orders?cardCode=ATTACKER-CARD`, {
      headers: { Cookie: vendorCookie },
    });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(observedAccount.cardCode, "SERVER-VENDOR-CARD");
    assert.equal(observedAccount.companyCode, "AMRPL");
    assert.doesNotMatch(JSON.stringify(await response.json()), /ATTACKER-CARD|SERVER-VENDOR-CARD/);

    const customerLogin = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "customer-login", password: "customer-password", role: "customer" }),
    });
    const customerCookie = customerLogin.headers.get("set-cookie").split(";", 1)[0];
    const wrongRole = await fetch(`${server.baseUrl}/api/portal/vendor/purchase-orders`, {
      headers: { Cookie: customerCookie },
    });
    assert.equal(wrongRole.status, 403);
  } finally {
    await server.close();
  }
});

test("expired portal sessions are rejected", { skip: dependencyUnavailable }, async () => {
  const server = await startTestServer();
  try {
    const expiredToken = dependencies.jwt.sign(
      { sub: "customer-demo", typ: "portal-session" },
      environment.PORTAL_SESSION_SECRET,
      { expiresIn: -1, issuer: "aadishakti-portal", audience: "aadishakti-portal" },
    );
    const response = await fetch(`${server.baseUrl}/api/portal/customer/session`, {
      headers: { Cookie: `portal_session=${expiredToken}` },
    });
    assert.equal(response.status, 401);
    assert.match((await response.json()).error, /expired/i);
  } finally {
    await server.close();
  }
});

test("portal routes reject missing sessions and invalid credentials", { skip: dependencyUnavailable }, async () => {
  const server = await startTestServer();
  try {
    const missing = await fetch(`${server.baseUrl}/api/portal/customer/session`);
    assert.equal(missing.status, 401);

    const invalid = await fetch(`${server.baseUrl}/api/portal/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "customer-login", password: "wrong", role: "customer" }),
    });
    assert.equal(invalid.status, 401);
  } finally {
    await server.close();
  }
});
