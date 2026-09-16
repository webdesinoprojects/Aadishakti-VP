import dotenv from "dotenv";

dotenv.config();

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const splitCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const isProduction = process.env.NODE_ENV === "production";

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction,
  port: parseInteger(process.env.PORT, 5000),
  host: process.env.HOST || "0.0.0.0",
  trustProxy: parseInteger(process.env.TRUST_PROXY, 1),
  frontendOrigins: splitCsv(
    process.env.FRONTEND_URL ||
      "http://localhost:5174,http://localhost:5173,http://localhost:3000",
  ),
  admin: Object.freeze({
    username: process.env.ADMIN_USERNAME || process.env.ADMIN_USER || "admin@aadishakti",
    password: process.env.ADMIN_PASSWORD || "admin123",
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
    jwtSecret:
      process.env.ADMIN_JWT_SECRET ||
      process.env.JWT_SECRET ||
      "development-only-admin-secret-change-before-production",
    jwtExpiry: process.env.ADMIN_JWT_EXPIRY || process.env.JWT_EXPIRY || "8h",
    cookieName: process.env.ADMIN_COOKIE_NAME || "admin_token",
    cookieSecure: parseBoolean(process.env.ADMIN_COOKIE_SECURE, isProduction),
    cookieSameSite: process.env.ADMIN_COOKIE_SAME_SITE || "lax",
  }),
  supabase: Object.freeze({
    enabled: parseBoolean(process.env.SUPABASE_ENABLED, false),
    url: process.env.SUPABASE_URL || "",
    publishableKey:
      process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "",
    secretKey:
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  }),
  imagekit: Object.freeze({
    enabled: parseBoolean(process.env.IMAGEKIT_ENABLED, false),
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    uploadFolder: process.env.IMAGEKIT_UPLOAD_FOLDER || "/aadishakti",
  }),
});

export const validateRuntimeConfig = () => {
  const errors = [];

  if (env.isProduction && !env.supabase.enabled && env.admin.jwtSecret.length < 32) {
    errors.push("ADMIN_JWT_SECRET (or JWT_SECRET) must contain at least 32 characters.");
  }

  if (
    env.isProduction &&
    !env.supabase.enabled &&
    !env.admin.passwordHash &&
    env.admin.password === "admin123"
  ) {
    errors.push("Configure ADMIN_PASSWORD_HASH or a non-default ADMIN_PASSWORD.");
  }

  if (env.frontendOrigins.length === 0) {
    errors.push("FRONTEND_URL must contain at least one allowed origin.");
  }

  if (
    env.supabase.enabled &&
    (!env.supabase.url || !env.supabase.publishableKey || !env.supabase.secretKey)
  ) {
    errors.push(
      "SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY are required when SUPABASE_ENABLED=true.",
    );
  }

  if (
    env.imagekit.enabled &&
    (!env.imagekit.urlEndpoint || !env.imagekit.publicKey || !env.imagekit.privateKey)
  ) {
    errors.push(
      "IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLIC_KEY, and IMAGEKIT_PRIVATE_KEY are required when IMAGEKIT_ENABLED=true.",
    );
  }

  if (errors.length > 0) {
    throw new Error(`Invalid backend configuration:\n- ${errors.join("\n- ")}`);
  }
};
