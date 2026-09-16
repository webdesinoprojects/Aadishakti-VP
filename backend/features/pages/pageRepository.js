import {
  getSupabaseAdminClient,
  throwOnSupabaseError,
} from "../../infrastructure/supabase/supabaseClients.js";

const pageColumns = [
  "id",
  "slug",
  "route_path",
  "title",
  "template",
  "status",
  "sections",
  "seo",
  "published_at",
  "created_by",
  "updated_by",
  "created_at",
  "updated_at",
].join(",");

export const listPages = async ({ page, limit, status, search }) => {
  const client = getSupabaseAdminClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  let query = client
    .from("cms_pages")
    .select(pageColumns, { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error, count } = await query;
  throwOnSupabaseError(error, "list CMS pages");
  return { data: data || [], count: count || 0 };
};

export const findPageById = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_pages")
    .select(pageColumns)
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error, "load the CMS page");
  return data;
};

export const findPublishedPage = async ({ slug, routePath }) => {
  let query = getSupabaseAdminClient()
    .from("cms_pages")
    .select(pageColumns)
    .eq("status", "published");

  query = routePath ? query.eq("route_path", routePath) : query.eq("slug", slug);
  const { data, error } = await query.maybeSingle();
  throwOnSupabaseError(error, "resolve the public page");
  return data;
};

export const insertPage = async (payload) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_pages")
    .insert(payload)
    .select(pageColumns)
    .single();
  throwOnSupabaseError(error, "create the CMS page");
  return data;
};

export const updatePageById = async (id, payload) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_pages")
    .update(payload)
    .eq("id", id)
    .select(pageColumns)
    .maybeSingle();
  throwOnSupabaseError(error, "update the CMS page");
  return data;
};

export const deletePageById = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("cms_pages")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();
  throwOnSupabaseError(error, "delete the CMS page");
  return data;
};

