import jwt from "jsonwebtoken";

export class PortalSessionConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "PortalSessionConfigurationError";
  }
}

const parseMinutes = (value) => {
  const minutes = Number.parseInt(value, 10);
  return Number.isFinite(minutes) ? Math.min(Math.max(minutes, 5), 1440) : 480;
};

export const getPortalSessionConfig = (environment = process.env) => {
  const secret = environment.PORTAL_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new PortalSessionConfigurationError("Portal session configuration is missing or too weak.");
  }

  const sameSite = String(environment.PORTAL_COOKIE_SAME_SITE || "lax").toLowerCase();
  if (!["lax", "strict", "none"].includes(sameSite)) {
    throw new PortalSessionConfigurationError("Portal cookie SameSite configuration is invalid.");
  }

  const secure = environment.NODE_ENV === "production" || environment.PORTAL_COOKIE_SECURE === "true";
  if (sameSite === "none" && !secure) {
    throw new PortalSessionConfigurationError("SameSite=None portal cookies require Secure=true.");
  }

  return {
    secret,
    cookieName: environment.PORTAL_COOKIE_NAME?.trim() || "portal_session",
    sessionMinutes: parseMinutes(environment.PORTAL_SESSION_TTL_MINUTES),
    sameSite,
    secure,
  };
};

const portalRoles = new Set(["customer", "vendor"]);

export const getPortalCookieName = (role, environment = process.env) => {
  const normalizedRole = String(role || "").trim().toLowerCase();
  if (!portalRoles.has(normalizedRole)) {
    throw new PortalSessionConfigurationError("A valid portal role is required for this session.");
  }
  return `${getPortalSessionConfig(environment).cookieName}_${normalizedRole}`;
};

export const createPortalSession = (account, environment = process.env) => {
  const config = getPortalSessionConfig(environment);
  return jwt.sign(
    { sub: account.id, typ: "portal-session" },
    config.secret,
    {
      algorithm: "HS256",
      expiresIn: `${config.sessionMinutes}m`,
      issuer: "aadishakti-portal",
      audience: "aadishakti-portal",
    },
  );
};

export const verifyPortalSession = (token, environment = process.env) => {
  const config = getPortalSessionConfig(environment);
  const payload = jwt.verify(token, config.secret, {
    algorithms: ["HS256"],
    issuer: "aadishakti-portal",
    audience: "aadishakti-portal",
  });
  if (payload?.typ !== "portal-session" || typeof payload.sub !== "string") {
    throw new jwt.JsonWebTokenError("Invalid portal session.");
  }
  return payload;
};

export const getPortalCookieOptions = (environment = process.env) => {
  const config = getPortalSessionConfig(environment);
  return {
    httpOnly: true,
    secure: config.secure,
    sameSite: config.sameSite,
    path: "/api/portal",
    maxAge: config.sessionMinutes * 60 * 1000,
  };
};

export const getPortalCookieClearOptions = (environment = process.env) => {
  const { maxAge: _maxAge, ...options } = getPortalCookieOptions(environment);
  return options;
};
