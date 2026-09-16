import {
  getSupabaseAdminClient,
  throwOnSupabaseError,
} from "../../infrastructure/supabase/supabaseClients.js";

const columns = "id,imagekit_file_id,name,file_path,url,thumbnail_url,file_type,mime_type,width,height,size_bytes,folder,alt_text,caption,tags,custom_metadata,created_by,created_at,updated_at";

export const listMediaAssets = async ({ page, limit, type, search }) => {
  const from = (page - 1) * limit;
  let query = getSupabaseAdminClient()
    .from("media_assets")
    .select(columns, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);
  if (type) query = query.eq("file_type", type);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error, count } = await query;
  throwOnSupabaseError(error, "list media assets");
  return { data: data || [], count: count || 0 };
};

export const insertMediaAsset = async (payload) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("media_assets")
    .insert(payload)
    .select(columns)
    .single();
  throwOnSupabaseError(error, "register the media asset");
  return data;
};

export const findMediaAssetById = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("media_assets")
    .select(columns)
    .eq("id", id)
    .maybeSingle();
  throwOnSupabaseError(error, "load the media asset");
  return data;
};

export const updateMediaAsset = async (id, payload) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("media_assets")
    .update(payload)
    .eq("id", id)
    .select(columns)
    .maybeSingle();
  throwOnSupabaseError(error, "update the media asset");
  return data;
};

export const deleteMediaAsset = async (id) => {
  const { data, error } = await getSupabaseAdminClient()
    .from("media_assets")
    .delete()
    .eq("id", id)
    .select(columns)
    .maybeSingle();
  throwOnSupabaseError(error, "delete the media asset record");
  return data;
};
