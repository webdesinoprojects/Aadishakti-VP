import { getSupabaseAdminClient, throwOnSupabaseError } from "../../../infrastructure/supabase/supabaseClients.js";
import { badRequest, notFound } from "../../../shared/errors.js";
import { ROLE_PERMISSIONS } from "../auth/adminPermissions.js";

const roles = new Set(Object.keys(ROLE_PERMISSIONS));

const validateRole = (value) => {
  const role = String(value || "viewer").toLowerCase();
  if (!roles.has(role)) throw badRequest("Invalid Admin role.");
  return role;
};

export const listAdminUsers = async () => {
  const { data, error } = await getSupabaseAdminClient()
    .from("admin_profiles")
    .select("id,email,display_name,role,permissions,is_active,created_at,updated_at")
    .order("created_at", { ascending: false });
  throwOnSupabaseError(error, "list Admin users");
  return data || [];
};

export const createAdminUser = async (input) => {
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const displayName = String(input.displayName || "").trim();
  const role = validateRole(input.role);
  if (!email || !email.includes("@")) throw badRequest("A valid Admin email is required.");
  if (password.length < 12) throw badRequest("Admin passwords must contain at least 12 characters.");
  if (!displayName) throw badRequest("Admin display name is required.");

  const client = getSupabaseAdminClient();
  const { data: authData, error: authError } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName },
  });
  throwOnSupabaseError(authError, "create the Admin identity");

  const permissions = Array.isArray(input.permissions) ? input.permissions.map(String) : [];
  const { data, error } = await client
    .from("admin_profiles")
    .insert({
      id: authData.user.id,
      email,
      display_name: displayName,
      role,
      permissions,
      is_active: true,
    })
    .select("id,email,display_name,role,permissions,is_active,created_at,updated_at")
    .single();
  if (error) {
    await client.auth.admin.deleteUser(authData.user.id).catch(() => undefined);
    throwOnSupabaseError(error, "create the Admin profile");
  }
  return data;
};

export const updateAdminUser = async (id, input, currentAdminId) => {
  const payload = {};
  if (input.displayName !== undefined) {
    payload.display_name = String(input.displayName || "").trim();
    if (!payload.display_name) throw badRequest("Admin display name cannot be empty.");
  }
  if (input.role !== undefined) payload.role = validateRole(input.role);
  if (input.permissions !== undefined) {
    if (!Array.isArray(input.permissions)) throw badRequest("Permissions must be an array.");
    payload.permissions = input.permissions.map(String);
  }
  if (input.isActive !== undefined) {
    if (id === currentAdminId && input.isActive === false) {
      throw badRequest("You cannot deactivate your own Admin account.");
    }
    payload.is_active = Boolean(input.isActive);
  }
  const { data, error } = await getSupabaseAdminClient()
    .from("admin_profiles")
    .update(payload)
    .eq("id", id)
    .select("id,email,display_name,role,permissions,is_active,created_at,updated_at")
    .maybeSingle();
  throwOnSupabaseError(error, "update the Admin user");
  if (!data) throw notFound("Admin user");
  return data;
};

