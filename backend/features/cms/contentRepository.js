import {
  getSupabaseAdminClient,
  throwOnSupabaseError,
} from "../../infrastructure/supabase/supabaseClients.js";

export const listRows = async (
  table,
  { columns = "*", filters = {}, orderBy = "created_at", ascending = false } = {},
) => {
  let query = getSupabaseAdminClient().from(table).select(columns);
  for (const [column, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") query = query.eq(column, value);
  }
  if (orderBy) query = query.order(orderBy, { ascending });
  const { data, error } = await query;
  throwOnSupabaseError(error, `list ${table}`);
  return data || [];
};

export const insertRow = async (table, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .insert(payload)
    .select(columns)
    .single();
  throwOnSupabaseError(error, `create ${table}`);
  return data;
};

export const updateRow = async (table, id, payload, columns = "*") => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .update(payload)
    .eq("id", id)
    .select(columns)
    .maybeSingle();
  throwOnSupabaseError(error, `update ${table}`);
  return data;
};

export const deleteRow = async (table, id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from(table)
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  throwOnSupabaseError(error, `delete ${table}`);
  return data;
};

export const getSingleton = async (key) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_singletons")
    .select("key,content,created_at,updated_at")
    .eq("key", key)
    .maybeSingle();
  throwOnSupabaseError(error, `load CMS singleton ${key}`);
  return data;
};

export const listSingletons = async () => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_singletons")
    .select("key,content,updated_at");
  throwOnSupabaseError(error, "list CMS singletons");
  return data || [];
};

export const upsertSingleton = async (key, content, adminId) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_singletons")
    .upsert({ key, content, updated_by: adminId || null }, { onConflict: "key" })
    .select("key,content,created_at,updated_at")
    .single();
  throwOnSupabaseError(error, `save CMS singleton ${key}`);
  return data;
};

export const findOrCreateGalleryAlbum = async (slug, adminId) => {
  const client = getSupabaseAdminClient();
  const { data: existing, error: findError } = await client
    .from("gallery_albums")
    .select("id,slug,title,status,sort_order")
    .eq("slug", slug)
    .maybeSingle();
  throwOnSupabaseError(findError, "load the gallery album");
  if (existing) return existing;

  const title = slug.replace(/(^|[-_])([a-z])/g, (_match, prefix, letter) =>
    `${prefix ? " " : ""}${letter.toUpperCase()}`,
  );
  const { data, error } = await client
    .from("gallery_albums")
    .insert({
      slug,
      title,
      status: "published",
      created_by: adminId || null,
      updated_by: adminId || null,
    })
    .select("id,slug,title,status,sort_order")
    .single();
  throwOnSupabaseError(error, "create the gallery album");
  return data;
};

export const listGalleryItems = async ({ category, publicOnly = false } = {}) => {
  let query = getSupabaseAdminClient()
    .from("gallery_items")
    .select("id,title,image_url,media_id,sort_order,created_at,gallery_albums!inner(slug,title,status),media_assets(url)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (category) query = query.eq("gallery_albums.slug", category);
  if (publicOnly) query = query.eq("gallery_albums.status", "published");
  const { data, error } = await query;
  throwOnSupabaseError(error, "list gallery items");
  return data || [];
};

export const insertGalleryItem = async (payload) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("gallery_items")
    .insert(payload)
    .select("id,title,image_url,media_id,sort_order,created_at")
    .single();
  throwOnSupabaseError(error, "create the gallery item");
  return data;
};

const navigationColumns = "id,menu_key,parent_id,label,href,sort_order,is_visible,opens_new_tab,created_by,updated_by,created_at,updated_at";

export const listNavigationItems = async ({ menuKey = "primary", publicOnly = false } = {}) => {
  let query = getSupabaseAdminClient()
    .from("cms_navigation_items")
    .select(navigationColumns)
    .eq("menu_key", menuKey)
    .order("sort_order", { ascending: true });
  if (publicOnly) query = query.eq("is_visible", true);
  const { data, error } = await query;
  throwOnSupabaseError(error, "list navigation items");
  return data || [];
};

