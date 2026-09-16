import {
  getSupabaseAdminClient,
  throwOnSupabaseError,
} from "../../infrastructure/supabase/supabaseClients.js";

export const listCrmRows = async ({ table, columns = "*", status, role, search, searchColumns = [] }) => {
  let query = getSupabaseAdminClient()
    .from(table)
    .select(columns)
    .order("submitted_at", { ascending: false });
  if (status && status.toLowerCase() !== "all") query = query.eq("status", status.toLowerCase());
  if (role) query = query.eq("role_category", role);
  if (search && searchColumns.length) {
    const safe = String(search).replace(/[%_,()]/g, " ").trim();
    if (safe) query = query.or(searchColumns.map((column) => `${column}.ilike.%${safe}%`).join(","));
  }
  const { data, error } = await query;
  throwOnSupabaseError(error, `list ${table}`);
  return data || [];
};

export const insertCrmRow = async (table, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .insert(payload)
    .select(columns)
    .single();
  throwOnSupabaseError(error, `create ${table}`);
  return data;
};

export const findCrmRow = async (table, id, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .select(columns)
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error, `load ${table}`);
  return data;
};

export const updateCrmRow = async (table, id, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .update(payload)
    .eq("id", id)
    .select(columns)
    .maybeSingle();
  throwOnSupabaseError(error, `update ${table}`);
  return data;
};

export const deleteCrmRow = async (table, id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  throwOnSupabaseError(error, `delete ${table}`);
  return data;
};

export const findApplicationResume = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("job_applications")
    .select("id,resume_original_name,media_assets!job_applications_resume_media_id_fkey(url)")
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error, "load the application resume");
  return data;
};
