import { badRequest, notFound } from "../../shared/errors.js";
import { uploadMediaBuffer } from "../media/mediaService.js";
import {
  deleteCrmRow,
  findCrmRow,
  findApplicationResume,
  insertCrmRow,
  listCrmRows,
  updateCrmRow,
} from "./crmRepository.js";

const text = (value) => String(value ?? "").trim();
const parseList = (value) => {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [String(value)];
  } catch {
    return String(value).split(",").map((item) => item.trim()).filter(Boolean);
  }
};
const requireFields = (input, fields) => {
  const missing = fields.filter(([key]) => !text(input[key]));
  if (missing.length) throw badRequest(`Missing required fields: ${missing.map(([, label]) => label).join(", ")}.`);
};
const displayStatus = (value) => String(value || "new").replace(/\b\w/g, (letter) => letter.toUpperCase());

const enquiryFromDb = (row) => ({
  id: row.id,
  fullName: row.full_name,
  workEmail: row.work_email,
  phone: row.phone,
  companyName: row.company_name,
  country: row.country,
  inquiryType: row.inquiry_type,
  products: row.products,
  materials: row.materials,
  estimatedQuantity: row.estimated_quantity,
  packagingRequirement: row.packaging_requirement,
  additionalDetails: row.additional_details,
  attachmentUrl: row.media_assets?.url || null,
  status: displayStatus(row.status),
  notes: row.notes,
  assignedVendorId: row.assigned_vendor_id,
  assignedVendorName: row.assigned_vendor_name,
  chatHistory: row.chat_history,
  submittedAt: row.submitted_at,
  updatedAt: row.updated_at,
});

const enquiryColumns = "*,media_assets!enquiries_specification_media_id_fkey(url)";

export const submitEnquiry = async (input, file) => {
  requireFields(input, [
    ["fullName", "full name"], ["workEmail", "work email"], ["phone", "phone"],
    ["companyName", "company name"], ["country", "country"], ["inquiryType", "inquiry type"],
  ]);
  let media = null;
  if (file) {
    media = await uploadMediaBuffer({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: "/aadishakti/enquiries",
      tags: ["enquiry", "specification"],
    });
  }
  const row = await insertCrmRow("enquiries", {
    full_name: text(input.fullName),
    work_email: text(input.workEmail).toLowerCase(),
    phone: text(input.phone),
    company_name: text(input.companyName),
    country: text(input.country),
    inquiry_type: text(input.inquiryType),
    products: parseList(input.products),
    materials: parseList(input.materials),
    estimated_quantity: text(input.estimatedQuantity),
    packaging_requirement: text(input.packagingRequirement),
    additional_details: text(input.additionalDetails),
    specification_media_id: media?.id || null,
    status: "new",
  }, enquiryColumns);
  return enquiryFromDb(row);
};

export const getEnquiries = async (query = {}) =>
  (await listCrmRows({
    table: "enquiries",
    columns: enquiryColumns,
    status: query.status,
    search: query.search,
    searchColumns: ["full_name", "company_name", "work_email"],
  })).map(enquiryFromDb);

export const editEnquiry = async (id, input) => {
  const payload = {};
  if (input.status !== undefined) payload.status = text(input.status).toLowerCase();
  if (input.notes !== undefined) payload.notes = String(input.notes || "");
  if (input.assignedVendorId !== undefined) payload.assigned_vendor_id = input.assignedVendorId || null;
  if (input.assignedVendorName !== undefined) payload.assigned_vendor_name = input.assignedVendorName || null;
  if (input.chatHistory !== undefined) {
    if (!Array.isArray(input.chatHistory)) throw badRequest("Chat history must be an array.");
    payload.chat_history = input.chatHistory;
  }
  const row = await updateCrmRow("enquiries", id, payload, enquiryColumns);
  if (!row) throw notFound("Enquiry");
  return enquiryFromDb(row);
};

export const assignEnquiry = (id, input) => {
  if (!input.vendorId || !input.vendorName) throw badRequest("Vendor ID and name are required.");
  return editEnquiry(id, {
    assignedVendorId: input.vendorId,
    assignedVendorName: input.vendorName,
    ...(input.status ? { status: input.status } : {}),
  });
};

export const addEnquiryChat = async (id, input, actor) => {
  const message = text(input.message);
  if (!message) throw badRequest("Message is required.");
  const currentRow = await findCrmRow("enquiries", id, enquiryColumns);
  if (!currentRow) throw notFound("Enquiry");
  const current = enquiryFromDb(currentRow);
  return editEnquiry(id, {
    chatHistory: [...(current.chatHistory || []), {
      sender: input.sender || actor?.displayName || actor?.email || "Admin",
      message,
      timestamp: new Date().toISOString(),
    }],
  });
};

const applicationFromDb = (row) => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  roleCategory: row.role_category,
  experience: row.experience,
  description: row.description,
  resumeUrl: row.media_assets?.url || null,
  resumeOriginalName: row.resume_original_name,
  status: displayStatus(row.status),
  notes: row.notes,
  submittedAt: row.submitted_at,
  updatedAt: row.updated_at,
});
const applicationColumns = "*,media_assets!job_applications_resume_media_id_fkey(url)";

export const submitApplication = async (input, file) => {
  requireFields(input, [
    ["fullName", "full name"], ["email", "email"], ["phone", "phone"],
    ["roleCategory", "role/category"], ["experience", "experience"],
  ]);
  if (!file) throw badRequest("A resume file is required.");
  const media = await uploadMediaBuffer({
    buffer: file.buffer,
    originalName: file.originalname,
    mimeType: file.mimetype,
    folder: "/aadishakti/applications",
    tags: ["job-application", "resume"],
  });
  const row = await insertCrmRow("job_applications", {
    full_name: text(input.fullName),
    email: text(input.email).toLowerCase(),
    phone: text(input.phone),
    role_category: text(input.roleCategory),
    experience: text(input.experience),
    description: text(input.description),
    resume_media_id: media.id,
    resume_original_name: file.originalname,
    status: "new",
  }, applicationColumns);
  return applicationFromDb(row);
};

export const getApplications = async (query = {}) =>
  (await listCrmRows({
    table: "job_applications",
    columns: applicationColumns,
    status: query.status,
    role: query.role,
    search: query.search,
    searchColumns: ["full_name", "email", "role_category"],
  })).map(applicationFromDb);

export const editApplication = async (id, input) => {
  const payload = {};
  if (input.status !== undefined) payload.status = text(input.status).toLowerCase();
  if (input.notes !== undefined) payload.notes = String(input.notes || "");
  const row = await updateCrmRow("job_applications", id, payload, applicationColumns);
  if (!row) throw notFound("Job application");
  return applicationFromDb(row);
};

export const removeCrmRow = async (table, id, label) => {
  const row = await deleteCrmRow(table, id);
  if (!row) throw notFound(label);
};

export const getResume = async (id) => {
  const application = await findApplicationResume(id);
  if (!application?.media_assets?.url) throw notFound("Application resume");
  return { url: application.media_assets.url, fileName: application.resume_original_name || "resume" };
};
