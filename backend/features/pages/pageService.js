import { badRequest, notFound } from "../../shared/errors.js";
import {
  deletePageById,
  findPageById,
  findPublishedPage,
  insertPage,
  listPages,
  updatePageById,
} from "./pageRepository.js";

const statuses = new Set(["draft", "published", "archived"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const normalizeSlug = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const validatePagePayload = (input, { partial = false } = {}) => {
  const payload = {};

  if (!partial || input.title !== undefined) {
    const title = String(input.title || "").trim();
    if (!title) throw badRequest("Page title is required.");
    payload.title = title;
  }

  if (!partial || input.slug !== undefined) {
    const slug = normalizeSlug(input.slug || input.title);
    if (!slug || !slugPattern.test(slug)) throw badRequest("A valid page slug is required.");
    payload.slug = slug;
  }

  if (!partial || input.routePath !== undefined || input.route_path !== undefined) {
    const routePath = String(input.routePath ?? input.route_path ?? `/${payload.slug || ""}`).trim();
    if (!routePath.startsWith("/") || routePath.includes("?")) {
      throw badRequest("Route path must begin with '/' and cannot contain a query string.");
    }
    payload.route_path = routePath === "/" ? routePath : routePath.replace(/\/+$/, "");
  }

  if (!partial || input.template !== undefined) {
    payload.template = String(input.template || "standard").trim() || "standard";
  }

  if (!partial || input.status !== undefined) {
    const status = String(input.status || "draft").toLowerCase();
    if (!statuses.has(status)) throw badRequest("Invalid page status.");
    payload.status = status;
    if (status === "published") payload.published_at = new Date().toISOString();
  }

  if (!partial || input.sections !== undefined) {
    if (!Array.isArray(input.sections || [])) throw badRequest("Page sections must be an array.");
    payload.sections = input.sections || [];
  }

  if (!partial || input.seo !== undefined) {
    const seo = input.seo || {};
    if (typeof seo !== "object" || Array.isArray(seo)) {
      throw badRequest("Page SEO data must be an object.");
    }
    payload.seo = seo;
  }

  return payload;
};

export const getPages = async (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 20, 1), 100);
  const result = await listPages({
    page,
    limit,
    status: query.status ? String(query.status).toLowerCase() : undefined,
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

export const getPage = async (id) => {
  const page = await findPageById(id);
  if (!page) throw notFound("Page");
  return page;
};

export const resolvePublicPage = async ({ slug, routePath }) => {
  if (!slug && !routePath) throw badRequest("Provide a slug or route path.");
  const page = await findPublishedPage({ slug, routePath });
  if (!page) throw notFound("Published page");
  return page;
};

export const createPage = (input, adminId) =>
  insertPage({
    ...validatePagePayload(input),
    created_by: adminId || null,
    updated_by: adminId || null,
  });

export const updatePage = async (id, input, adminId) => {
  const page = await updatePageById(id, {
    ...validatePagePayload(input, { partial: true }),
    updated_by: adminId || null,
  });
  if (!page) throw notFound("Page");
  return page;
};

export const removePage = async (id) => {
  const page = await deletePageById(id);
  if (!page) throw notFound("Page");
};

