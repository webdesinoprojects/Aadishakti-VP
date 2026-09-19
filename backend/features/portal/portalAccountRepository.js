import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";

const accountColumns = "*,mappings:portal_account_companies(*)";

export const findPortalAccountById = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("portal_accounts")
    .select(accountColumns)
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error, "load portal account");
  return data;
};

export const findPortalAccountByLogin = async (loginId, role) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("portal_accounts")
    .select(accountColumns)
    .eq("login_id", String(loginId).trim().toLowerCase())
    .eq("role", role)
    .maybeSingle();
  throwOnSupabaseError(error, "load portal account");
  return data;
};

export const listPortalAccountRows = async ({ role, status } = {}) => {
  let query = getSupabaseAdminClient().from("portal_accounts").select(accountColumns).order("created_at", { ascending: false });
  if (role) query = query.eq("role", role);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  throwOnSupabaseError(error, "list portal accounts");
  return data || [];
};

export const insertPortalAccountRow = async (account, mappings) => {
  const client = getSupabaseAdminClient();
  const { data, error } = await client.from("portal_accounts").insert(account).select("*").single();
  throwOnSupabaseError(error, "create portal account");
  const mappingRows = mappings.map((mapping) => ({ ...mapping, portal_account_id: data.id }));
  const { error: mappingError } = await client.from("portal_account_companies").insert(mappingRows);
  if (mappingError) {
    await client.from("portal_accounts").delete().eq("id", data.id);
    throwOnSupabaseError(mappingError, "create portal company mappings");
  }
  return findPortalAccountById(data.id);
};

export const updatePortalAccountRow = async (id, payload) => {
  const { error } = await getSupabaseAdminClient().from("portal_accounts").update(payload).eq("id", id);
  throwOnSupabaseError(error, "update portal account");
  return findPortalAccountById(id);
};

export const replacePortalAccountMappings = async (id, mappings) => {
  const client = getSupabaseAdminClient();
  const { error: deleteError } = await client.from("portal_account_companies").delete().eq("portal_account_id", id);
  throwOnSupabaseError(deleteError, "replace portal company mappings");
  if (mappings.length) {
    const { error } = await client.from("portal_account_companies").insert(
      mappings.map((mapping) => ({ ...mapping, portal_account_id: id })),
    );
    throwOnSupabaseError(error, "replace portal company mappings");
  }
  return findPortalAccountById(id);
};
