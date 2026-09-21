import { toFile } from "@imagekit/nodejs";
import { env } from "../../config/env.js";
import { getImageKitClient } from "../../infrastructure/imagekit/imagekitClient.js";
import { badRequest, notFound } from "../../shared/errors.js";
import {
  deleteMediaAsset,
  findMediaAssetById,
  insertMediaAsset,
  listMediaAssets,
  updateMediaAsset,
} from "./mediaRepository.js";

export const createUploadAuthentication = () => {
  const client = getImageKitClient();
  return {
    ...client.helper.getAuthenticationParameters(),
    publicKey: env.imagekit.publicKey,
    urlEndpoint: env.imagekit.urlEndpoint,
    folder: env.imagekit.uploadFolder,
  };
};

export const getMediaAssets = async (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 24, 1), 100);
  const result = await listMediaAssets({
    page,
    limit,
    type: query.type ? String(query.type) : undefined,
    search: query.search ? String(query.search).trim() : undefined,
  });
  return {
    data: result.data,
    pagination: {
      page,
      limit,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
    },
  };
};

export const registerMediaAsset = async (input, adminId) => {
  const fileId = String(input.fileId || input.imagekitFileId || "").trim();
  const name = String(input.name || "").trim();
  const url = String(input.url || "").trim();
  const filePath = String(input.filePath || "").trim();
  if (!fileId || !name || !url || !filePath) {
    throw badRequest("ImageKit fileId, name, url, and filePath are required.");
  }

  return insertMediaAsset({
    imagekit_file_id: fileId,
    name,
    file_path: filePath,
    url,
    thumbnail_url: input.thumbnailUrl || null,
    file_type: String(input.fileType || "image"),
    mime_type: input.mimeType || null,
    width: Number.isFinite(input.width) ? input.width : null,
    height: Number.isFinite(input.height) ? input.height : null,
    size_bytes: Number.isFinite(input.size) ? input.size : null,
    folder: input.folder || env.imagekit.uploadFolder,
    alt_text: String(input.altText || ""),
    caption: String(input.caption || ""),
    tags: Array.isArray(input.tags) ? input.tags.map(String) : [],
    custom_metadata:
      input.customMetadata && typeof input.customMetadata === "object"
        ? input.customMetadata
        : {},
    created_by: adminId || null,
  });
};

export const uploadMediaBuffer = async ({ buffer, originalName, mimeType, folder, tags = [] }) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) throw badRequest("A file is required.");
  const safeFileName = String(originalName || "upload").replace(/[^a-zA-Z0-9.-]/g, "_");
  const file = await toFile(buffer, safeFileName, { type: mimeType || "application/octet-stream" });
  const uploaded = await getImageKitClient().files.upload({
    file,
    fileName: safeFileName,
    folder: folder || env.imagekit.uploadFolder,
    tags,
    useUniqueFileName: true,
  });
  return registerMediaAsset(
    {
      fileId: uploaded.fileId,
      name: uploaded.name || originalName,
      filePath: uploaded.filePath,
      url: uploaded.url,
      thumbnailUrl: uploaded.thumbnailUrl,
      fileType: uploaded.fileType || (mimeType?.startsWith("image/") ? "image" : "non-image"),
      mimeType,
      width: uploaded.width,
      height: uploaded.height,
      size: uploaded.size,
      folder: folder || env.imagekit.uploadFolder,
      tags,
    },
    null,
  );
};

export const editMediaAsset = async (id, input) => {
  const payload = {};
  if (input.altText !== undefined) payload.alt_text = String(input.altText);
  if (input.caption !== undefined) payload.caption = String(input.caption);
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) throw badRequest("Media tags must be an array.");
    payload.tags = input.tags.map(String);
  }
  const asset = await updateMediaAsset(id, payload);
  if (!asset) throw notFound("Media asset");
  return asset;
};

export const removeMediaAsset = async (id) => {
  const asset = await findMediaAssetById(id);
  if (!asset) throw notFound("Media asset");

  // Delete the provider object first. If that fails, the database remains truthful and
  // the operation can be retried without losing the ImageKit file identifier.
  await getImageKitClient().files.delete(asset.imagekit_file_id);
  await deleteMediaAsset(id);

  return asset;
};
