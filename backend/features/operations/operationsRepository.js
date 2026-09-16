import { getSupabaseAdminClient, throwOnSupabaseError } from "../../infrastructure/supabase/supabaseClients.js";

export const listOperationRows = async (table, { columns = "*", status, orderBy = "created_at" } = {}) => {
  let query = getSupabaseAdminClient().from(table).select(columns).order(orderBy, { ascending: false });
  if (status && String(status).toLowerCase() !== "all") query = query.eq("status", String(status).toLowerCase());
  const { data, error } = await query;
  throwOnSupabaseError(error, `list ${table}`);
  return data || [];
};

export const findOperationRow = async (table, id, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient().from(table).select(columns).eq("id", id).maybeSingle();
  throwOnSupabaseError(error, `load ${table}`);
  return data;
};

export const insertOperationRow = async (table, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient().from(table).insert(payload).select(columns).single();
  throwOnSupabaseError(error, `create ${table}`);
  return data;
};

export const updateOperationRow = async (table, id, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient().from(table).update(payload).eq("id", id).select(columns).maybeSingle();
  throwOnSupabaseError(error, `update ${table}`);
  return data;
};

export const upsertLogisticsOrders = async (rows) => {
  const { error } = await getSupabaseAdminClient().from("logistics_orders").upsert(rows, { onConflict: "id" });
  throwOnSupabaseError(error, "import logistics orders");
};

