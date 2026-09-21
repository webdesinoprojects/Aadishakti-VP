import { badRequest, notFound } from "../../shared/errors.js";
import {
  deleteRow,
  findOrCreateGalleryAlbum,
  getSingleton,
  insertGalleryItem,
  insertRow,
  listGalleryItems,
  listNavigationItems,
  listRows,
  listSingletons,
  updateRow,
  upsertSingleton,
} from "./contentRepository.js";

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const asObject = (value, label) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw badRequest(`${label} must be an object.`);
  }
  return value;
};

const asArray = (value) => (Array.isArray(value) ? value : []);
const text = (value) => String(value ?? "").trim();
const publishedStatus = (value, fallback = "published") => {
  const status = text(value).toLowerCase();
  if (["published", "active", "open"].includes(status)) return "published";
  if (["archived", "closed"].includes(status)) return status;
  if (status === "draft") return "draft";
  return fallback;
};

const requireName = (input, label = "Name") => {
  const value = text(input);
  if (!value) throw badRequest(`${label} is required.`);
  return value;
};

export const getCmsSingleton = async (key, fallback = {}) => {
  const record = await getSingleton(key);
  return record?.content ?? fallback;
};

export const saveCmsSingleton = async (key, input, adminId) => {
  const content = asObject(input, "CMS content");
  const result = await upsertSingleton(key, content, adminId);
  return result.content;
};

export const normalizeSingletonKey = (value) => {
  const key = String(value || "").trim();
  if (!/^[a-z][a-zA-Z0-9_-]{1,63}$/.test(key)) throw badRequest("Invalid CMS content key.");
  return key;
};

const productFromDb = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  code: row.code,
  purity: row.purity,
  description: row.description,
  packaging: row.packaging,
  specifications: row.specifications,
  features: row.features,
  image: row.image_url,
  datasheet: row.datasheet_url,
  status: row.status,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  lastEdited: row.updated_at,
});

const productPayload = (input, adminId, partial = false) => {
  const payload = { updated_by: adminId || null };
  if (!partial || input.name !== undefined) payload.name = requireName(input.name, "Product name");
  if (!partial || input.slug !== undefined || input.name !== undefined) {
    payload.slug = slugify(input.slug || input.name);
    if (!payload.slug) throw badRequest("A valid product slug is required.");
  }
  const fields = [["code", "code"], ["purity", "purity"], ["description", "description"], ["packaging", "packaging"], ["image", "image_url"], ["datasheet", "datasheet_url"]];
  for (const [source, target] of fields) if (!partial || input[source] !== undefined) payload[target] = text(input[source]);
  if (!partial || input.specifications !== undefined) payload.specifications = asArray(input.specifications);
  if (!partial || input.features !== undefined) payload.features = asArray(input.features);
  if (!partial || input.status !== undefined) payload.status = publishedStatus(input.status);
  if (!partial || input.sortOrder !== undefined) payload.sort_order = Number(input.sortOrder) || 0;
  if (!partial) payload.created_by = adminId || null;
  return payload;
};

export const listProducts = async ({ publicOnly = false } = {}) =>
  (await listRows("products", {
    filters: publicOnly ? { status: "published" } : {},
    orderBy: "sort_order",
    ascending: true,
  })).map(productFromDb);

export const createProduct = async (input, adminId) =>
  productFromDb(await insertRow("products", productPayload(input, adminId)));

export const editProduct = async (id, input, adminId) => {
  const row = await updateRow("products", id, productPayload(input, adminId, true));
  if (!row) throw notFound("Product");
  return productFromDb(row);
};

const newsFromDb = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  status: row.status === "published" ? "Published" : row.status,
  publishDate: row.publish_date,
  content: row.content,
  featuredImage: row.featured_image_url,
  displayOnHome: row.display_on_home,
  displayOnNews: row.display_on_news,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const newsPayload = (input, adminId, partial = false) => {
  const payload = { updated_by: adminId || null };
  if (!partial || input.title !== undefined) payload.title = requireName(input.title, "News title");
  if (!partial || input.slug !== undefined || input.title !== undefined) payload.slug = slugify(input.slug || input.title);
  if (!partial || input.category !== undefined) payload.category = text(input.category);
  if (!partial || input.status !== undefined) payload.status = publishedStatus(input.status);
  if (!partial || input.publishDate !== undefined) payload.publish_date = input.publishDate ? String(input.publishDate).slice(0, 10) : null;
  if (!partial || input.content !== undefined) payload.content = String(input.content || "");
  if (!partial || input.featuredImage !== undefined) payload.featured_image_url = text(input.featuredImage);
  if (!partial || input.displayOnHome !== undefined) payload.display_on_home = Boolean(input.displayOnHome);
  if (!partial || input.displayOnNews !== undefined) payload.display_on_news = input.displayOnNews === undefined ? true : Boolean(input.displayOnNews);
  if (!partial) payload.created_by = adminId || null;
  return payload;
};

export const listNews = async ({ status, publicOnly = false } = {}) =>
  (await listRows("news_posts", {
    filters: { status: publicOnly ? "published" : status ? publishedStatus(status, undefined) : undefined },
    orderBy: "created_at",
  })).map(newsFromDb);
export const createNews = async (input, adminId) => newsFromDb(await insertRow("news_posts", newsPayload(input, adminId)));
export const editNews = async (id, input, adminId) => {
  const row = await updateRow("news_posts", id, newsPayload(input, adminId, true));
  if (!row) throw notFound("News item");
  return newsFromDb(row);
};

const jobFromDb = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  category: row.category,
  department: row.department,
  dept: row.department,
  location: row.location,
  type: row.employment_type,
  experience: row.experience,
  exp: row.experience,
  salaryRange: row.salary_range,
  description: row.description,
  desc: row.description,
  requirements: row.requirements,
  whyWorkHere: row.why_work_here,
  image: row.image_url,
  img: row.image_url,
  status: row.status === "published" ? "Open" : row.status === "archived" ? "Archived" : row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const jobPayload = (input, adminId, partial = false) => {
  const payload = { updated_by: adminId || null };
  if (!partial || input.title !== undefined) payload.title = requireName(input.title, "Job title");
  if (!partial || input.slug !== undefined || input.title !== undefined) payload.slug = slugify(input.slug || input.title);
  const fields = [
    ["category", "category"], ["department", "department", "dept"], ["location", "location"],
    ["type", "employment_type"], ["experience", "experience", "exp"], ["salaryRange", "salary_range"],
    ["description", "description", "desc"], ["whyWorkHere", "why_work_here"], ["image", "image_url", "img"],
  ];
  for (const [source, target, alias] of fields) {
    if (!partial || input[source] !== undefined || (alias && input[alias] !== undefined)) payload[target] = text(input[source] ?? input[alias]);
  }
  if (!partial || input.requirements !== undefined) payload.requirements = asArray(input.requirements);
  if (!partial || input.status !== undefined) payload.status = publishedStatus(input.status);
  if (!partial) payload.created_by = adminId || null;
  return payload;
};

export const listJobs = async ({ status, publicOnly = false } = {}) =>
  (await listRows("job_postings", {
    filters: { status: publicOnly ? "published" : status ? publishedStatus(status, undefined) : undefined },
    orderBy: "created_at",
  })).map(jobFromDb);
export const createJob = async (input, adminId) => jobFromDb(await insertRow("job_postings", jobPayload(input, adminId)));
export const editJob = async (id, input, adminId) => {
  const row = await updateRow("job_postings", id, jobPayload(input, adminId, true));
  if (!row) throw notFound("Job posting");
  return jobFromDb(row);
};

const teamFromDb = (row) => ({
  id: row.id,
  name: row.name,
  role: row.role,
  bio: row.bio,
  image: row.photo_url,
  photo: row.photo_url,
  category: row.category,
  displayOrder: row.display_order,
  linkedinUrl: row.linkedin_url,
  isVisible: row.is_visible,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const teamPayload = (input, adminId, partial = false) => {
  const payload = { updated_by: adminId || null };
  if (!partial || input.name !== undefined) payload.name = requireName(input.name, "Team member name");
  if (!partial || input.role !== undefined) payload.role = requireName(input.role, "Team member role");
  if (!partial || input.bio !== undefined) payload.bio = text(input.bio);
  if (!partial || input.image !== undefined || input.photo !== undefined) payload.photo_url = text(input.image ?? input.photo);
  if (!partial || input.category !== undefined) payload.category = text(input.category);
  if (!partial || input.displayOrder !== undefined) payload.display_order = Number(input.displayOrder) || 0;
  if (!partial || input.linkedinUrl !== undefined) payload.linkedin_url = text(input.linkedinUrl);
  if (!partial || input.isVisible !== undefined) payload.is_visible = input.isVisible === undefined ? true : Boolean(input.isVisible);
  if (!partial) payload.created_by = adminId || null;
  return payload;
};

export const listTeam = async ({ publicOnly = false } = {}) =>
  (await listRows("team_members", {
    filters: publicOnly ? { is_visible: true } : {},
    orderBy: "display_order",
    ascending: true,
  })).map(teamFromDb);
export const createTeamMember = async (input, adminId) => teamFromDb(await insertRow("team_members", teamPayload(input, adminId)));
export const editTeamMember = async (id, input, adminId) => {
  const row = await updateRow("team_members", id, teamPayload(input, adminId, true));
  if (!row) throw notFound("Team member");
  return teamFromDb(row);
};

const galleryFromDb = (row) => ({
  id: row.id,
  category: row.gallery_albums?.slug || "",
  image: row.media_assets?.url || row.image_url,
  title: row.title,
  sortOrder: row.sort_order,
  createdAt: row.created_at,
});

export const listGallery = async (options = {}) => (await listGalleryItems(options)).map(galleryFromDb);
export const createGalleryItem = async (input, adminId) => {
  const category = slugify(input.category || "general");
  const image = text(input.image);
  if (!image && !input.mediaId) throw badRequest("A gallery image is required.");
  const album = await findOrCreateGalleryAlbum(category, adminId);
  const row = await insertGalleryItem({
    album_id: album.id,
    media_id: input.mediaId || null,
    image_url: image,
    title: text(input.title),
    sort_order: Number(input.sortOrder) || 0,
  });
  return galleryFromDb({ ...row, gallery_albums: album, media_assets: null });
};

export const editGalleryItem = async (id, input) => {
  const payload = {};
  if (input.image !== undefined) payload.image_url = text(input.image);
  if (input.mediaId !== undefined) payload.media_id = input.mediaId || null;
  if (input.title !== undefined) payload.title = text(input.title);
  if (input.sortOrder !== undefined) payload.sort_order = Number(input.sortOrder) || 0;
  if (input.category !== undefined) {
    const album = await findOrCreateGalleryAlbum(slugify(input.category), null);
    payload.album_id = album.id;
  }
  const row = await updateRow("gallery_items", id, payload);
  if (!row) throw notFound("Gallery item");
  const resolved = (await listGalleryItems()).find((item) => item.id === id);
  return galleryFromDb(resolved || row);
};

export const removeContentRow = async (table, id, label) => {
  const row = await deleteRow(table, id);
  if (!row) throw notFound(label);
};

const navigationFromDb = (row) => ({
  id: row.id,
  menuKey: row.menu_key,
  parentId: row.parent_id,
  label: row.label,
  href: row.href,
  sortOrder: row.sort_order,
  isVisible: row.is_visible,
  opensNewTab: row.opens_new_tab,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const navigationPayload = (input, adminId, partial = false) => {
  const payload = { updated_by: adminId || null };
  if (!partial || input.menuKey !== undefined) payload.menu_key = text(input.menuKey || "primary") || "primary";
  if (!partial || input.parentId !== undefined) payload.parent_id = input.parentId || null;
  if (!partial || input.label !== undefined) payload.label = requireName(input.label, "Navigation label");
  if (!partial || input.href !== undefined) {
    payload.href = requireName(input.href, "Navigation URL");
    if (!payload.href.startsWith("/") && !/^https?:\/\//i.test(payload.href)) {
      throw badRequest("Navigation URL must be an internal path or an HTTP(S) URL.");
    }
  }
  if (!partial || input.sortOrder !== undefined) payload.sort_order = Number(input.sortOrder) || 0;
  if (!partial || input.isVisible !== undefined) payload.is_visible = input.isVisible === undefined ? true : Boolean(input.isVisible);
  if (!partial || input.opensNewTab !== undefined) payload.opens_new_tab = Boolean(input.opensNewTab);
  if (!partial) payload.created_by = adminId || null;
  return payload;
};

const buildNavigationTree = (items) => {
  const mapped = new Map(items.map((row) => [row.id, { ...navigationFromDb(row), children: [] }]));
  const roots = [];
  for (const item of mapped.values()) {
    const parent = item.parentId ? mapped.get(item.parentId) : null;
    if (parent) parent.children.push(item);
    else roots.push(item);
  }
  return roots;
};

export const getNavigation = async ({ menuKey = "primary", publicOnly = false } = {}) =>
  buildNavigationTree(await listNavigationItems({ menuKey, publicOnly }));

export const createNavigationItem = async (input, adminId) =>
  navigationFromDb(await insertRow("cms_navigation_items", navigationPayload(input, adminId)));

export const editNavigationItem = async (id, input, adminId) => {
  if (input.parentId === id) throw badRequest("A navigation item cannot be its own parent.");
  const row = await updateRow("cms_navigation_items", id, navigationPayload(input, adminId, true));
  if (!row) throw notFound("Navigation item");
  return navigationFromDb(row);
};

export const buildPublicCms = async () => {
  const [singletons, products, gallery, news, jobs, team, navigation] = await Promise.all([
    listSingletons(),
    listProducts({ publicOnly: true }),
    listGallery({ publicOnly: true }),
    listNews({ publicOnly: true }),
    listJobs({ publicOnly: true }),
    listTeam({ publicOnly: true }),
    getNavigation({ menuKey: "primary", publicOnly: true }),
  ]);
  const content = Object.fromEntries(singletons.map((item) => [item.key, item.content]));
  return {
    ...content,
    home: content.home || content.hero || { heroSlides: [] },
    products,
    gallery,
    news,
    team,
    jobListings: jobs,
    careersData: {
      ...(content.careersData || {}),
      categories: content.careersData?.categories || [
        { id: "factory", name: "Factory" },
        { id: "office", name: "Office" },
      ],
      jobs,
    },
    navigation,
  };
};
