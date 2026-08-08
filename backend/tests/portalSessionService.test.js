import test from "node:test";
import assert from "node:assert/strict";

let sessionService;
let jwt;
let dependencyUnavailable = false;
try {
  [sessionService, { default: jwt }] = await Promise.all([
    import("../services/portalSessionService.js"),
    import("jsonwebtoken"),
  ]);
} catch (error) {
  if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
  dependencyUnavailable = true;
}

const environment = {
  PORTAL_SESSION_SECRET: "test-only-session-secret-that-is-long-enough",
  PORTAL_SESSION_TTL_MINUTES: "30",
  PORTAL_COOKIE_SAME_SITE: "lax",
  NODE_ENV: "test",
};

test("portal sessions contain only the server account identifier", { skip: dependencyUnavailable }, () => {
  const token = sessionService.createPortalSession({
    id: "customer-demo",
    role: "customer",
    cardCode: "MUST-NOT-BE-IN-TOKEN",
  }, environment);
  const payload = sessionService.verifyPortalSession(token, environment);

  assert.equal(payload.sub, "customer-demo");
  assert.equal(payload.typ, "portal-session");
  assert.equal(payload.role, undefined);
  assert.equal(payload.cardCode, undefined);
  assert.doesNotMatch(token, /MUST-NOT-BE-IN-TOKEN/);
  const header = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"));
  assert.equal(header.alg, "HS256");
});

test("portal cookies are HttpOnly, scoped, and Secure in production", { skip: dependencyUnavailable }, () => {
  const development = sessionService.getPortalCookieOptions(environment);
  assert.equal(development.httpOnly, true);
  assert.equal(development.secure, false);
  assert.equal(development.sameSite, "lax");
  assert.equal(development.path, "/api/portal");

  const production = sessionService.getPortalCookieOptions({ ...environment, NODE_ENV: "production" });
  assert.equal(production.secure, true);

  const clearOptions = sessionService.getPortalCookieClearOptions(environment);
  assert.equal("maxAge" in clearOptions, false);
});

test("portal sessions reject missing or weak secrets", { skip: dependencyUnavailable }, () => {
  assert.throws(
    () => sessionService.createPortalSession({ id: "customer-demo" }, { PORTAL_SESSION_SECRET: "" }),
    sessionService.PortalSessionConfigurationError,
  );
  assert.throws(
    () => sessionService.getPortalSessionConfig({ PORTAL_SESSION_SECRET: "too-short" }),
    sessionService.PortalSessionConfigurationError,
  );
});

test("portal session verification rejects JWT algorithms other than HS256", { skip: dependencyUnavailable }, () => {
  const token = jwt.sign(
    { sub: "customer-demo", typ: "portal-session" },
    environment.PORTAL_SESSION_SECRET,
    {
      algorithm: "HS384",
      expiresIn: "30m",
      issuer: "aadishakti-portal",
      audience: "aadishakti-portal",
    },
  );

  assert.throws(() => sessionService.verifyPortalSession(token, environment), jwt.JsonWebTokenError);
});
