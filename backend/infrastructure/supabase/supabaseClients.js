import { createClient } from "@supabase/supabase-js";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";

let publicClient;
let adminClient;

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

const requireSupabase = () => {
  if (!env.supabase.enabled) {
    throw new AppError(
      503,
      "SUPABASE_NOT_CONFIGURED",
      "Database-backed admin features are not configured yet.",
    );
  }
};

export const getSupabasePublicClient = () => {
  requireSupabase();
  if (!publicClient) {
    publicClient = createClient(
      env.supabase.url,
      env.supabase.publishableKey,
      clientOptions,
    );
  }
  return publicClient;
};

export const getSupabaseAdminClient = () => {
  requireSupabase();
  if (!adminClient) {
    adminClient = createClient(env.supabase.url, env.supabase.secretKey, clientOptions);
  }
  return adminClient;
};

export const isSupabaseEnabled = () => env.supabase.enabled;

export const throwOnSupabaseError = (error, operation) => {
  if (!error) return;
  const errorMap = {
    "23505": [409, "RESOURCE_CONFLICT"],
    "23503": [409, "RESOURCE_IN_USE"],
    "23514": [400, "CONSTRAINT_VIOLATION"],
    "22P02": [400, "INVALID_IDENTIFIER"],
  };
  const [status, code] = errorMap[error.code] || [500, "DATABASE_OPERATION_FAILED"];
  const wrapped = new AppError(status, code, `Unable to ${operation}.`);
  wrapped.cause = error;
  throw wrapped;
};
